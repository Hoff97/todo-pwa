package em.model

import play.api.libs.json._
import java.sql.Timestamp
import em.util.DateTime._

case class Todo(id: String, name: String, loginFk: Int,
                date: Option[Timestamp], priority: Option[Int],
                done: Boolean, category: Option[String],
                timestamp: Timestamp,
                reminder: Option[Timestamp],
                serverTimestamp: Option[Timestamp]) extends HasCopy[Todo, String] {
  def cpy(i: Option[String]) = this.copy(id = i.getOrElse(this.id))

  def toTodoV = TodoV(id, name, date, priority, done, category, timestamp, reminder, serverTimestamp)
}

case class TodoV(id: String, name: String,
                 date: Option[Timestamp], priority: Option[Int],
                 done: Boolean, category: Option[String],
                 timestamp: Timestamp,
                 reminder: Option[Timestamp],
                 serverTimestamp: Option[Timestamp]) {
  def toTodo(loginFk: Int) = Todo(id, name, loginFk, date, priority, done, category, timestamp, reminder, serverTimestamp)
}

object Todo {
  implicit val todoFormat = Json.format[Todo]

  val tupled = (this.apply _).tupled
}

object TodoV {
  implicit val todoVFormat = Json.format[TodoV]

  val tupled = (this.apply _).tupled
}
