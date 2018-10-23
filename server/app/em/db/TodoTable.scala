package em.db

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._
import java.sql.Timestamp


class TodoTable(tag: Tag) extends Table[Todo](tag, "todo") with HasID[Todo, String] {
  def id = column[String]("id",O.PrimaryKey)

  def name = column[String]("name")
  
  def loginFk = column[Int]("login_fk")
  
  def date = column[Option[Timestamp]]("date")
  def priority = column[Option[Int]]("priority")
  def category = column[Option[String]]("category")
  
  def done = column[Boolean]("done")

  def timestamp = column[Timestamp]("timestamp")

  def serverTimestamp = column[Option[Timestamp]]("server_timestamp")

  def reminder = column[Option[Timestamp]]("reminder")

  def * = (id, name, loginFk, date, priority, done, category, timestamp, reminder, serverTimestamp) <> (Todo.tupled, Todo.unapply)
}

object TodoTable {
  val todo = TableQuery[TodoTable]
}
