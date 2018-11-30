package em.model

import em.model.forms.Subscription
import em.model.forms.SubscriptionForm._
import play.api.libs.json.Json

case class PushPayload(id: Int, title: String, content: String, actions: List[String], data: String, token: Option[String])

case class PushMessage(subscription: Subscription, payload: PushPayload, ttl: Int)

object PushMessage {
  implicit val pushPayloadFormat = Json.format[PushPayload]
  implicit val pushFormat = Json.format[PushMessage]

  val tupled = (this.apply _).tupled
}