package em.model

import play.api.libs.json._
import java.sql.Timestamp
import em.util.DateTime._

case class Todo(id: String, name: String, loginFk: Int,
                date: Option[Timestamp], priority: Option[Int],
                done: Boolean, category: Option[String],
                timestamp: Timestamp) extends HasCopy[Todo, String] {
  def cpy(i: Option[String]) = this.copy(id = i.getOrElse(this.id))
}

object Todo {
  implicit val todoFormat = Json.format[Todo]

  val tupled = (this.apply _).tupled
}
