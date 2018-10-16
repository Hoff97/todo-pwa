package em.util

import java.sql.Timestamp
import java.text.SimpleDateFormat

import play.api.libs.json._
import play.api.mvc._

object DateTime {
  val format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

  implicit object timestampFormat extends Format[Timestamp] {
    def reads(json: JsValue) = {
      val str = json.as[String]
      JsSuccess(new Timestamp(format.parse(str).getTime))
    }
    def writes(ts: Timestamp) = JsString(format.format(ts))
  }

  implicit def queryStringBinder(implicit stringBinder: QueryStringBindable[String]) = new QueryStringBindable[Timestamp] {
    override def bind(key: String, params: Map[String, Seq[String]]): Option[Either[String, Timestamp]] = {
      stringBinder.bind(key, params) match {
        case Some(Right(str)) => format.parse(str) match {
          case null => Some(Left("Unable to bind a timestamp"))
          case x => Some(Right(new Timestamp(x.getTime)))
        }
        case Some(Left(e)) => Some(Left(e))
        case None => None
      }
    }
    override def unbind(key: String, ts: Timestamp): String = {
      stringBinder.unbind(key, format.format(ts))
    }
  }
}
