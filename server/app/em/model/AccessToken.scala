package em.model

import play.api.libs.json._

case class AccessToken(token: String)

object AccessToken {
  implicit val accessTokenReads = Json.reads[AccessToken]
  implicit val accessTokenyWrites = Json.writes[AccessToken]
}
