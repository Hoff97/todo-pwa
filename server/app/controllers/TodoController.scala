package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{ DatabaseConfigProvider, HasDatabaseConfigProvider }
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import play.api.libs.json._
import scala.concurrent._
import em.db.Util._
import em.model.Todo
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

  def getTodos(search: Option[String], done: Option[Boolean]) = silhouette.SecuredAction.async { implicit request =>
    val q = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)
      .optionalFilter(search, (s: String,e: TodoTable) => upper(e.name) like upper("%" + s + "%"))
      .optionalFilter(done, (d: Boolean,e: TodoTable) => e.done === d)

    returnPaged(q.queryPaged.result,q,db)
  }
  
  def createTodo = silhouette.SecuredAction.async(parse.json[Todo]) { implicit request: SecuredRequest[AuthEnv, Todo] =>
    db.run(insertAndReturn[Todo, TodoTable](TodoTable.todo, request.body.copy(loginId = request.identity.id.get)))
      .map(x => Ok(Json.toJson(x)))
  }
  
  def updateTodo(id: Int) = silhouette.SecuredAction.async(parse.json[Todo]) { implicit request: SecuredRequest[AuthEnv, Todo] =>
    val q = TodoTable.todo.filter(x => x.id === id && x.loginFk === request.identity.id.get)
    
    db.run(q.update(request.body.copy(id = Some(id), loginId = request.identity.id.get))).map {
      case 0 => NotFound
      case _ => Ok
    }
  }
  
  def deleteTodo(id: Int) = silhouette.SecuredAction.async { implicit request =>
    val q = TodoTable.todo.filter(x => x.id === id)
    
    db.run(q.delete).map {
      case 0 => NotFound
      case _ => Ok
    }
  }
}
