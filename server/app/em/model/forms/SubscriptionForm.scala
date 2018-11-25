package em.model.forms

import java.sql.Timestamp
import java.time.Instant

import em.model.SubscriptionUser
import play.api.libs.functional.syntax._
import play.api.libs.json._
import em.util.DateTime._

case class SubscriptionForm(subscription: Subscription, deviceDescription: String)

case class Subscription(endpoint: String, keys: Keys) {
  def toUserSubscription(userFk: Int, deviceDescription: String)
    = SubscriptionUser(None, endpoint, keys.auth, keys.p256dh, userFk, deviceDescription, Timestamp.from(Instant.now()))
}

case class Keys(auth: String, p256dh: String)

object SubscriptionForm {
  implicit val keysFormat = Json.format[Keys]
  implicit val subscriptionFormat = Json.format[Subscription]
  implicit val subscriptionFormFormat = Json.format[SubscriptionForm]
}
