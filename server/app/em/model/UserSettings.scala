package em.model

import java.sql.{Time, Timestamp}

import play.api.libs.json._
import em.util.DateTime._

case class UserSettings(mail: Boolean, notificationTime: Option[Time])

object UserSettings {
  implicit val settingsFormat = Json.format[UserSettings]

  val tupled = (this.apply _).tupled
}
