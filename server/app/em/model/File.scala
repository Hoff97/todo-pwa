package em.model

import java.sql.Timestamp

import play.api.libs.json.Json
import em.util.DateTime._

case class File(id: String,
                name: String,
                todoFk: String,
                data: String,
                timestamp: Timestamp,
                serverTimestamp: Option[Timestamp])
  extends CopyTime[File, String] {
  def cpy(i: Option[String]) = this.copy(id = i.getOrElse(this.id))

  def getId = id

  def cpyT(serverTimestamp: Timestamp) = this.copy(serverTimestamp = Some(serverTimestamp))
}

object File {
  implicit val fileFormat = Json.format[File]

  val tupled = (this.apply _).tupled
}