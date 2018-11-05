package em.db

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._
import java.sql.Timestamp
import em.db.FileTable._


class TodoTable(tag: Tag) extends Table[Todo](tag, "todo") with TimeId[Todo, String] {
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

  def parentFk = column[Option[String]]("parent_fk")

  def comment = column[Option[String]]("comment")

  def created = column[Timestamp]("created")

  def * = (id, name, loginFk, date, priority, done,
    category, timestamp, reminder, serverTimestamp, parentFk, comment, created) <> (Todo.tupled, Todo.unapply)

  def files = file.filter(f => f.todoFk === id)
}

object TodoTable {
  val todo = TableQuery[TodoTable]
}
