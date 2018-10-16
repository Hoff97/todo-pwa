package em.model

import play.api.libs.json._
import com.mohiva.play.silhouette.api.{ Identity, LoginInfo }

case class Login(id: Option[Int], email: String, pwHash: Option[String],
                 pwSalt: Option[String], pwHasher: Option[String],
                 providerID: String, providerKey: String) extends Identity with HasCopy[Login] {
  def cpy(i: Option[Int]) = this.copy(id = i)
  
  val loginInfo = LoginInfo(providerID,providerKey)
}

object Login {
  implicit val loginFormat = Json.format[Login]

  val tupled = (this.apply _).tupled
}
