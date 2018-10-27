package em.model

import java.sql.Timestamp

import slick.lifted.Query
import slick.jdbc.PostgresProfile.api._
import em.db.TodoTable
import play.api.libs.json._
import slick.dbio.{DBIOAction, NoStream}
import em.util.DateTime._

import scala.concurrent.ExecutionContext

case class Todo(id: String, name: String, loginFk: Int,
                date: Option[Timestamp], priority: Option[Int],
                done: Boolean, category: Option[String],
                timestamp: Timestamp,
                reminder: Option[Timestamp],
                serverTimestamp: Option[Timestamp],
                parentFk: Option[String],
                comment: Option[String]) extends CopyTime[Todo, String] {
  def cpy(i: Option[String]) = this.copy(id = i.getOrElse(this.id))
  def cpyT(serverTimestamp: Timestamp) = this.copy(serverTimestamp = Some(serverTimestamp))

  def toTodoV(files: Seq[File]) = TodoV(id, name, date, priority, done, category, timestamp,
    reminder, serverTimestamp, parentFk, files, comment)

  def getId = id
}

case class TodoV(id: String, name: String,
                 date: Option[Timestamp], priority: Option[Int],
                 done: Boolean, category: Option[String],
                 timestamp: Timestamp,
                 reminder: Option[Timestamp],
                 serverTimestamp: Option[Timestamp],
                 parentFk: Option[String],
                 files: Seq[File],
                 comment: Option[String]) {

  def toTodo(loginFk: Int) = Todo(id, name, loginFk, date, priority, done, category, timestamp,
    reminder, serverTimestamp, parentFk, comment)
}

object Todo {
  implicit val todoFormat = Json.format[Todo]

  val tupled = (this.apply _).tupled

  implicit class DetailedQuery(val q: Query[TodoTable, Todo, Seq]) {
    def detailed(implicit ec: ExecutionContext): DBIOAction[Seq[TodoV], NoStream, Nothing] = {
      q.result.zip(q.flatMap(_.files).result).map { case (todos, files) =>
        val fMap = files.groupBy(f => f.todoFk)
        todos.map(x => x.toTodoV(fMap.getOrElse(x.id, List())))
      }
    }
  }
}

object TodoV {
  implicit val todoVFormat = Json.format[TodoV]

  val tupled = (this.apply _).tupled
}
