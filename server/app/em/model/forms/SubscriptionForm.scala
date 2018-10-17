package em.model.forms

import em.model.SubscriptionUser
import play.api.libs.functional.syntax._
import play.api.libs.json._

case class SubscriptionForm(subscription: Subscription)

case class Subscription(endpoint: String, keys: Keys) {
  def toUserSubscription(userFk: Int) = SubscriptionUser(None, endpoint, keys.auth, keys.p256dh, userFk)
}

case class Keys(auth: String, p256dh: String)

object SubscriptionForm {
  implicit val keysFormat = Json.format[Keys]
  implicit val subscriptionFormat = Json.format[Subscription]
  implicit val subscriptionFormFormat = Json.format[SubscriptionForm]
}
