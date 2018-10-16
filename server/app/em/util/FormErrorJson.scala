package em.util

import java.sql.Timestamp
import java.text.SimpleDateFormat

import play.api.libs.json._

import play.api.data._

object FormErrorJson {
  implicit object formErrorFormat extends Writes[Seq[FormError]] {
    def writes(e: Seq[FormError]) = JsObject(e.map(x => x.key -> JsString(x.message)).toMap)
  }
}
