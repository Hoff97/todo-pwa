package em.db

import slick.jdbc.PostgresProfile.api._
import slick.lifted.ProvenShape.proveShapeOf
import em.model._
import java.sql.Timestamp

class FileTable(tag: Tag) extends Table[File](tag, "file") with TimeId[File, String] {
  def id = column[String]("id",O.PrimaryKey)

  def name = column[String]("name")

  def todoFk = column[String]("todo_fk")

  def bytea = column[String]("data")

  def timestamp = column[Timestamp]("timestamp")

  def serverTimestamp = column[Option[Timestamp]]("server_timestamp")

  def * = (id, name, todoFk, bytea, timestamp, serverTimestamp) <> (File.tupled, File.unapply)

  def todo = foreignKey("todo",todoFk,TodoTable.todo)(_.id)
}

object FileTable {
  val file = TableQuery[FileTable]
}