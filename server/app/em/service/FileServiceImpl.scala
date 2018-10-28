package em.service

import java.sql.Timestamp
import java.util.Date

import em.db.{FileTable, TodoTable}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.Json
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}
import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import em.model.File
import slick.ast.{BaseTypedType, TypedType}

class FileServiceImpl @Inject()(
                                 protected val dbConfigProvider: DatabaseConfigProvider,
                                 pushService: PushService,
                                 syncService: SyncService)(implicit context: ExecutionContext)
  extends FileService with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("service.todo")

  override def updateAndCreateFiles(files: Seq[File], loginId: Int) =
    syncService.updateCreateEntity[String, File, FileTable](files, FileTable.file,
      FileTable.file.filter(x => x.todo.map(_.loginFk).filter(x => x === loginId).exists),
      file => Future.successful(()),
      file => Future.successful(()))

}
