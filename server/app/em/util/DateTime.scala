package em.util

import java.sql.{Time, Timestamp}
import java.text.SimpleDateFormat
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoField

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

  val timeFormatter = DateTimeFormatter.ofPattern("HH:mm")

  implicit object timeFormat extends Format[Time] {
    override def writes(o: Time): JsValue = JsString(timeFormatter.format(o.toInstant))

    override def reads(json: JsValue): JsResult[Time] = {
      val str = json.as[String]
      val parsed = timeFormatter.parse(str)
      JsSuccess(new Time(parsed.get(ChronoField.HOUR_OF_DAY),parsed.get(ChronoField.MINUTE_OF_HOUR), 0))
    }
  }
}
