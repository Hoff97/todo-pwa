package em.model

import em.model.forms.Subscription
import em.model.forms.SubscriptionForm._
import play.api.libs.json.Json

case class PushMessage(subscription: Subscription, payload: String, ttl: Int)

object PushMessage {
  implicit val pushFormat = Json.format[PushMessage]

  val tupled = (this.apply _).tupled
}