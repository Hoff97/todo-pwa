package em.db

import java.sql.{Time, Timestamp}

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._

class LoginTable(tag: Tag) extends Table[Login](tag, "login") with HasID[Login, Int] {
  def id = column[Int]("id",O.PrimaryKey,O.AutoInc)

  def pwSalt = column[String]("pwsalt")
  def pwHash = column[String]("pwhash")
  def pwHasher = column[String]("pwhasher")

  def providerId = column[String]("provider_id")
  def providerKey = column[String]("provider_key")

  def email = column[String]("email")

  def timestamp = column[Timestamp]("timestamp")

  def dailyReminder = column[Option[Time]]("daily_reminder")

  def mailNotifications = column[Boolean]("mail_notifications")

  def * = (id.?,email,pwHash.?, pwSalt.?, pwHasher.? ,providerId,
           providerKey, timestamp, dailyReminder, mailNotifications) <> (Login.tupled, Login.unapply)
}

object LoginTable {
  val login = TableQuery[LoginTable]
}
