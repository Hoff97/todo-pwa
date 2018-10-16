package em.db

import java.sql.Timestamp

import scala.concurrent.ExecutionContext
import play.api._
import play.api.libs.json._
import play.api.mvc._
import slick.ast.TypedType
import slick.dbio.DBIOAction
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.model._

object Util extends Results {
  def lower(a: Rep[String]) =
    SimpleFunction[String]("lower").apply(Seq(a))

  def upper(a: Rep[String]) =
    SimpleFunction[String]("upper").apply(Seq(a))

  def currentTimestamp = SimpleLiteral[java.sql.Timestamp]("current_timestamp")

  def diff(a: Rep[Timestamp], b: Rep[Timestamp]) = SimpleBinaryOperator[Timestamp]("-")

  def insertAndReturn[T, U <: HasID[T, Int]](a: TableQuery[U], b: U#TableElementType) = {
    (a returning a.map(x => x.id) into ((event,i) => event.cpy(Some(i))) += b)
  }

  def insertAndReturnS[T, U <: HasID[T, String]](a: TableQuery[U], b: U#TableElementType) = {
    (a returning a.map(x => x.id) into ((event,i) => event.cpy(Some(i))) += b)
  }

  implicit class RepUtils[A](rep: Rep[A]) {
    def dir(b: Boolean)(implicit t: TypedType[A]) = if(b) columnToOrdered(rep).asc else columnToOrdered(rep).desc
  }
}
