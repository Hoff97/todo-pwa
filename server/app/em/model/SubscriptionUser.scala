package em.model

import java.sql.Timestamp

import play.api.libs.json.Json

case class SubscriptionUser(id: Option[Int], endpoint: String, keyAuth: String, keyp256dh: String, userFk: Int) extends HasCopy[SubscriptionUser, Int] {
  def cpy(i: Option[Int]) = this.copy(id = i)
}

object SubscriptionUser {
  implicit val todoFormat = Json.format[SubscriptionUser]

  val tupled = (this.apply _).tupled
}