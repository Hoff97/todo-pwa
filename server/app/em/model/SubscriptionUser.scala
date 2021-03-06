package em.model

import java.sql.Timestamp

import em.model.forms.{Keys, Subscription}
import play.api.libs.json.Json
import em.util.DateTime._

case class SubscriptionUser(id: Option[Int], endpoint: String, keyAuth: String,
                            keyp256dh: String, userFk: Int, deviceDescription: String,
                            timestamp: Timestamp, version: Option[String]) extends HasCopy[SubscriptionUser, Int] {
  def cpy(i: Option[Int]) = this.copy(id = i)

  def toSubscription: Subscription = Subscription(endpoint, Keys(keyAuth, keyp256dh))

  def getId = id.get
}

object SubscriptionUser {
  implicit val todoFormat = Json.format[SubscriptionUser]

  val tupled = (this.apply _).tupled
}