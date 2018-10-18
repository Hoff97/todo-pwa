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

  val log = Logger("api.todo")

  def getTodos = silhouette.SecuredAction.async { implicit request =>
    val q = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)

    db.run(q.result).map {
      case todos => Ok(Json.toJson(todos.map(_.toTodoV)))
    }
  }
  
  def updateTodos = silhouette.SecuredAction.async(parse.json[List[TodoV]]) { implicit request: SecuredRequest[AuthEnv, List[TodoV]] =>
    val ids = request.body.map(_.id)
    val getAll = TodoTable.todo.filter(x => x.loginFk === request.identity.id.get)

    db.run(getAll.result).flatMap { case dbTodos =>
      val dbIds = dbTodos.map(_.id)
      val (toUpdate, toCreate) = request.body.partition(todo => dbIds.contains(todo.id))
      val dbById = dbTodos.map(x => (x.id, x)).toMap

      val create = Future.sequence(toCreate.map(todov => db.run(TodoTable.todo.insertOrUpdate(todov.toTodo(request.identity.id.get)))))

      val update = Future.sequence(toUpdate
        .map(todoV => (todoV, dbById.get(todoV.id).get))
          .map { case (todoV, todoDb) =>
            if(todoV.timestamp.before(todoDb.timestamp))
              Future.successful(todoDb)
            else {
              val update = TodoTable.todo.filter(x => x.id === todoV.id)
                .update(todoV.toTodo(request.identity.id.get))
              db.run(update)
            }
          })

      create.zip(update)
    }.flatMap { case (t1, t2) =>
      db.run(TodoTable.todo.filter(x => x.loginFk === request.identity.id.get).result)
        .map(todos => Ok(Json.toJson(todos.map(_.toTodoV))))
    }
  }

  def deleteTodo(id: String) = silhouette.SecuredAction.async(parse.empty) { implicit request: SecuredRequest[AuthEnv, Unit] =>
    db.run(TodoTable.todo.filter(x => x.loginFk === request.identity.id.get && x.id === id).delete)
      .map(x => Ok(id))
  }
}
