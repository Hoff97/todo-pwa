package em.service

import java.sql.Timestamp
import java.util.Date

import em.db.TodoTable
import em.model.Todo
import javax.inject.Inject
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
import em.model.Todo

class TodoServiceImpl @Inject()(
                                 protected val dbConfigProvider: DatabaseConfigProvider,
                                 pushService: PushService)(implicit context: ExecutionContext)
  extends TodoService with HasDatabaseConfigProvider[JdbcProfile] {

  override def updateAndCreateTodos(todos: Seq[Todo], userId: Int): Future[Seq[Todo]] = {
    val ids = todos.map(_.id)
    val getAll = TodoTable.todo.filter(x => x.loginFk === userId)

    db.run(getAll.result).flatMap { case dbTodos =>
      val dbIds = dbTodos.map(_.id)
      val (toUpdate, toCreateP) = todos.partition(todo => dbIds.contains(todo.id))
      val dbById = dbTodos.map(x => (x.id, x)).toMap

      val toCreate = toCreateP.filter(x => x.serverTimestamp.isEmpty)

      val create = Future.sequence(toCreate.map(todo => createTodo(todo)))

      val update = Future.sequence(toUpdate
        .map(todo => (todo, dbById.get(todo.id).get))
        .map { case (todo, todoDb) =>
          if(todo.timestamp.after(todoDb.timestamp))
            updateTodo(todo)
          else {
            Future.successful(todoDb)
          }
        })

      create.zip(update)
    }.flatMap { case (t1, t2) =>
      db.run(TodoTable.todo.filter(x => x.loginFk === userId).result)
    }
  }

  private def updateTodo(todo: Todo): Future[_] = {
    System.out.println("Updating:" + todo.toString)
    val todoU = todo.copy(serverTimestamp = Some(new Timestamp(new Date().getTime)))
    pushService.notifyTodo(todoU)

    val update = TodoTable.todo.filter(x => x.id === todoU.id)
      .update(todoU)
    db.run(update)
  }

  private def createTodo(todo: Todo): Future[_] = {
    System.out.println("Creating:" + todo.toString)

    val todoC = todo.copy(serverTimestamp = Some(new Timestamp(new Date().getTime)))
    db.run(TodoTable.todo.insertOrUpdate(todoC)).map { num =>
      pushService.notifyTodo(todoC)
    }
  }
}
