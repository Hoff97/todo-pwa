package em.service

import javax.inject.Inject
import slick.lifted.{Query, TableQuery}

import java.sql.Timestamp
import java.util.Date

import em.model.{CopyTime, TimeId}
import play.api._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import slick.ast.{BaseTypedType}

import scala.concurrent.{ExecutionContext, Future}

class SyncServiceImpl @Inject()(
                                 protected val dbConfigProvider: DatabaseConfigProvider)(implicit context: ExecutionContext)
  extends SyncService with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("service.sync")

  def updateCreateEntity[I, A <: CopyTime[A, I], T <: TimeId[A, I]]
  (entities: Seq[A], table: TableQuery[T], all: Query[T, A, Seq],
   afterUpdate: A => Future[_], afterCreate: A => Future[_])
  (implicit typeWitness: BaseTypedType[I]): Future[_] = {
    val ids = entities.map(_.getId)

    db.run(all.result).flatMap { case dbEntities =>
      val dbIds = dbEntities.map(x => x.getId)
      val (toUpdate, toCreateP) = entities.partition(entity => dbIds.contains(entity.getId))
      val dbById = dbEntities.map(x => (x.getId, x)).toMap

      val toCreate = toCreateP.filter(x => x.serverTimestamp.isEmpty)
      log.debug(s"Creating ${toCreate.length} entities, updating ${toUpdate.length} entities")

      val create = Future.sequence(toCreate.map(entity => {
        val entityC = entity.cpyT(serverTimestamp = new Timestamp(new Date().getTime))

        log.debug( s"Updating entity: ${entityC.toString}")

        db.run(table.insertOrUpdate(entityC.asInstanceOf[T#TableElementType])).map { num =>
          afterCreate(entityC)
        }
      }))

      val update = Future.sequence(toUpdate
        .map(entity => (entity, dbById.get(entity.getId).get))
        .map { case (entity, entityDb) =>
          if(entity.timestamp.after(entityDb.timestamp)) {
            val entityU = entity.cpyT(serverTimestamp = new Timestamp(new Date().getTime))
            log.debug( s"Updating entity: ${entityU.toString}")

            val i = entityU.getId
            val update = table.filter(x => x.id === entityU.getId)
              .update(entityU.asInstanceOf[T#TableElementType])
            db.run(update).map(x => afterUpdate(entityU))
          }
          else {
            Future.successful(entityDb)
          }
        })

      create.zip(update)
    }
  }
}
