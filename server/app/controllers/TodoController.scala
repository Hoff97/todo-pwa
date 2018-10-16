package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import play.api.libs.json._

import scala.concurrent._
import em.db.Util._
import em.model.{Todo, TodoV}
import com.mohiva.play.silhouette.api.actions.SecuredRequest

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class TodoController @Inject() (
  cc:                             ControllerComponents,
  val silhouette:                 Silhouette[AuthEnv],
  protected val dbConfigProvider: DatabaseConfigProvider)(implicit context: ExecutionContext)
  extends AbstractController(cc)
  with HasDatabaseConfigProvider[JdbcProfile] {

  def getTodos() = silhouette.SecuredAction.async { implicit request =>
    val q = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)

    db.run(q.result).map {
      case todos => Ok(Json.toJson(todos.map(_.toTodoV)))
    }
  }
  
  def updateTodos = silhouette.SecuredAction.async(parse.json[List[TodoV]]) { implicit request: SecuredRequest[AuthEnv, List[TodoV]] =>
    //val q = TodoTable.todo.filter(x => x.id === id && x.loginFk === request.identity.id.get)
    
    /*db.run(q.update(request.body.copy(id = Some(id), loginId = request.identity.id.get))).map {
      case 0 => NotFound
      case _ => Ok
    }*/
    // TODO: Implement
    Future.successful(Ok(Json.toJson(request.request.body)))
  }
}
