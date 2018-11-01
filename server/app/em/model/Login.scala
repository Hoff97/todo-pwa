package em.model

import java.sql.{Time, Timestamp}

import play.api.libs.json._
import com.mohiva.play.silhouette.api.{Identity, LoginInfo}
import em.util.DateTime._

case class Login(id: Option[Int], email: String, pwHash: Option[String],
                 pwSalt: Option[String], pwHasher: Option[String],
                 providerID: String, providerKey: String,
                 timestamp: Timestamp, dailyReminder: Option[Time], mail: Boolean) extends Identity with HasCopy[Login, Int] {
  def cpy(i: Option[Int]) = this.copy(id = i)
  
  val loginInfo = LoginInfo(providerID,providerKey)

  def getId = id.get

  def toUserSettings: UserSettings = UserSettings(mail, dailyReminder)
}

object Login {
  implicit val loginFormat = Json.format[Login]

  val tupled = (this.apply _).tupled
}
