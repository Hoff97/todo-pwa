package em.model

import java.sql.Timestamp

trait HasID[A <: HasCopy[A, I], I] extends slick.lifted.AbstractTable[A] {
  def id: slick.lifted.Rep[I]
  
  type TableElementType <: A
}

trait HasCopy[A, I] {
  def cpy(i: Option[I]): A
  def getId: I
}

trait Timestamped {
  val timestamp: Timestamp
  val serverTimestamp: Option[Timestamp]
}

trait CopyTime[A,I] extends HasCopy[A,I] with Timestamped {
  def cpyT(serverTimestamp: Timestamp): A
}

trait HasTimestamp[A] extends slick.lifted.AbstractTable[A] {
  def timestamp: slick.lifted.Rep[Timestamp]

  def serverTimestamp: slick.lifted.Rep[Option[Timestamp]]

  type TableElementType <: Timestamped
}

trait TimeId[A <: CopyTime[A, I], I] extends HasID[A,I] with HasTimestamp[A] {
  type TableElementType <: A
}