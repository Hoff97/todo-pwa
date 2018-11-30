package em.model

import play.api.libs.json.Json

case class Notification(id: Option[Int], loginFk: Int) extends HasCopy[Notification, Int] {
  def cpy(i: Option[Int]) = this.copy(id = i)

  def getId = id.get
}

object Notification {
  implicit val notificationFormat = Json.format[Notification]

  val tupled = (this.apply _).tupled
}