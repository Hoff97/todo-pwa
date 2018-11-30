package em.db

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._


class NotificationTable(tag: Tag) extends Table[Notification](tag, "notification") with HasID[Notification, Int] {
  def id = column[Int]("id",O.PrimaryKey,O.AutoInc)

  def loginFk = column[Int]("login_fk")

  def * = (id.?, loginFk) <> (Notification.tupled, Notification.unapply)
}

object NotificationTable {
  val notifications = TableQuery[NotificationTable]
}
