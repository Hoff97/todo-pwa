package em.db

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
  
  def runTwo[A,B,C](a: (Query[A,B, Seq], Rep[C]), db: Database) =
    db.run(a._1.result).zip(db.run(a._2.result))

  def returnPaged[A,B,C](a: DBIOAction[Seq[A],NoStream,Nothing], q: Query[B,C,Seq], db: Database)(implicit request: Request[_], ec: ExecutionContext, tjs: Writes[A]) = {
    db.run(a).zip(db.run(q.length.result)).map(x => {
      Ok(Json.toJson(x._1)).withHeaders("X-Number-Items" -> x._2.toString())
    })
  }

  def returnPagedNoCount[A](a: DBIOAction[Seq[A],NoStream,Nothing], db: Database)(implicit request: Request[_], ec: ExecutionContext, tjs: Writes[A]) = {
    db.run(a).map(x => {
      Ok(Json.toJson(x))
    })
  }

  def insertAndReturn[T, U <: HasID[T]](a: TableQuery[U], b: U#TableElementType) = {
    (a returning a.map(x => x.id) into ((event,i) => event.cpy(Some(i))) += b)
  }
  
  implicit class QueryUtils[B,C](q: Query[B,C,Seq]) {
    def queryPaged[A,B,C](implicit request: Request[A]) = {
      val page = request.headers.get("X-Page").map(_.toInt).getOrElse(0)
      val pageSize = request.headers.get("X-Page-Size").map(_.toInt).getOrElse(20)

      q.drop(page*pageSize).take(pageSize)
    }

    def returnPaged(db: Database)(implicit request: Request[_], ec: ExecutionContext, tjs: Writes[C]) = {
      runTwo(q.paged,db).map(x => Ok(Json.toJson(x._1)).withHeaders("X-Number-Items" -> x._2.toString()))
    }

    def paged[A](implicit request: Request[A]) = {
      val page = request.headers.get("X-Page").map(_.toInt).getOrElse(0)
      val pageSize = request.headers.get("X-Page-Size").map(_.toInt).getOrElse(20)

      (q.drop(page*pageSize).take(pageSize),q.length)
    }
    
    def optionalFilter[A](o: Option[A], filter: (A,B) => Rep[Boolean]) = o match {
      case None => q
      case Some(a) => q.filter(b => filter(a,b))
    }
  }

  implicit class RepUtils[A](rep: Rep[A]) {
    def dir(b: Boolean)(implicit t: TypedType[A]) = if(b) columnToOrdered(rep).asc else columnToOrdered(rep).desc
  }
}
