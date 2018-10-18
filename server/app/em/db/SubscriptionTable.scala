package em.db

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._
import java.sql.Timestamp


class SubscriptionTable(tag: Tag) extends Table[SubscriptionUser](tag, "subscription") with HasID[SubscriptionUser, Int] {
  def id = column[Int]("id",O.PrimaryKey,O.AutoInc)

  def endpoint = column[String]("endpoint")

  def keyAuth = column[String]("key_auth")
  def keyp256dh = column[String]("key_p256dh")

  def userFk = column[Int]("user_fk")

  def * = (id.?, endpoint, keyAuth, keyp256dh, userFk) <> (SubscriptionUser.tupled, SubscriptionUser.unapply)
}

object SubscriptionTable {
  val subscriptions = TableQuery[SubscriptionTable]
}
