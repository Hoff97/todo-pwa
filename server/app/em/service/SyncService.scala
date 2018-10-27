package em.service

import em.model.{CopyTime, TimeId}

import scala.concurrent.{Future}
import slick.jdbc.PostgresProfile.api._
import slick.ast.{BaseTypedType}

trait SyncService {
  def updateCreateEntity[I, A <: CopyTime[A, I], T <: TimeId[A, I]]
  (entities: Seq[A], table: TableQuery[T], all: Query[T, A, Seq],
   afterUpdate: A => Future[_], afterCreate: A => Future[_])
  (implicit typeWitness: BaseTypedType[I]): Future[_]
}
