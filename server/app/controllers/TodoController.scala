package controllers

import akka.actor.ActorSystem
import akka.stream.ActorMaterializer
import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.{FileTable, TodoTable}
import play.api.libs.json._

import scala.concurrent._
import em.db.Util._
import em.model.{Todo, TodoV}
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import em.model.forms.RemindAgain
import em.service.{FileService, PushService, TodoService}
import play.api.Logger

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class TodoController @Inject()(
                                cc: ControllerComponents,
                                val silhouette: Silhouette[AuthEnv],
                                protected val dbConfigProvider: DatabaseConfigProvider,
                                pushService: PushService,
                                todoService: TodoService,
                                fileService: FileService,
                                implicit val actorSystem: ActorSystem)(implicit context: ExecutionContext)
  extends AbstractController(cc)
    with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("api.todo")

  implicit val materializer = ActorMaterializer()

  def getTodos = silhouette.SecuredAction.async { implicit request =>
    log.debug("Got request to get todos")
    val q = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)

    db.run(q.detailed).map {
      case todos => Ok(Json.toJson(todos))
    }
  }

  def updateTodos = silhouette.SecuredAction.async(parse.json(1000000)
      .validate(x => x.validate[List[TodoV]].asEither.swap.map(x => BadRequest).swap)) { implicit request: SecuredRequest[AuthEnv, List[TodoV]] =>
    val todosBody = request.body
    log.debug("Got request to update todos")
    val userId = request.identity.id.get

    val files = todosBody.flatMap(todo => todo.files.map(file => file.copy(todoFk = todo.id)))
    val todos = todosBody.map(x => x.toTodo(userId))

    for {
      _ <- todoService.updateAndCreateTodos(todos, userId)
      _ <- fileService.updateAndCreateFiles(files, userId)
      todos <- todoService.getTodosForUser(request.identity.id.get)
    } yield (Ok(Json.toJson(todos)))
  }

  def deleteTodo(id: String) = silhouette.SecuredAction.async(parse.empty) { implicit request: SecuredRequest[AuthEnv, Unit] =>
    log.debug(s"Request to delete todo with id ${id}")
    db.run(TodoTable.todo.filter(x => x.loginFk === request.identity.id.get && x.id === id).delete)
      .map(x => Ok(id))
  }

  def deleteFile(id: String, todoId: String) = silhouette.SecuredAction.async(parse.empty) { implicit request: SecuredRequest[AuthEnv, Unit] =>
    log.debug(s"Request to delete file with id ${id}")
    db.run(FileTable.file.filter(x => x.todo.filter(x => x.loginFk === request.identity.id.get).exists
        && x.id === id && x.todoFk === todoId).delete)
      .map(x => Ok(id))
  }

  def remindAgain = silhouette.SecuredAction.async(parse.json[RemindAgain]) { implicit request: SecuredRequest[AuthEnv, RemindAgain] =>
    log.debug(s"Request to reschedule reminder")
    val q = TodoTable.todo.filter(x => x.id === request.body.id && x.loginFk === request.identity.id.get)
    db.run(q.result).map { todosDb =>
      if(todosDb.length > 0) {
        val todo = todosDb(0)
        val reminder = todo.reminder.get
        val hours = request.body.hours
        reminder.setTime(reminder.getTime + hours*60*60*1000)
        val updated = todo.copy(reminder = Some(reminder), timestamp = request.body.timestamp)
        db.run(q.update(updated))
        pushService.notifyTodo(updated)
        Ok
      } else {
        BadRequest
      }
    }
  }
}
