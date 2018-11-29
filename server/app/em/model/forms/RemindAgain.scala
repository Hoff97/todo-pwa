package em.model.forms

import java.sql.Timestamp

import play.api.libs.json._
import em.util.DateTime._

case class RemindAgain(id: String, hours: Int, timestamp: Timestamp)

object RemindAgain {
  implicit val remindFormat = Json.format[RemindAgain]

  val tupled = (this.apply _).tupled
}
