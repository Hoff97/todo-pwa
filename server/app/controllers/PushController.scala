package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import com.mohiva.play.silhouette.api._
import em.auth._
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.{SubscriptionTable, TodoTable}
import play.api.libs.json._

import scala.concurrent._
import em.db.Util._
import em.model.{PushMessage, Todo, TodoV}
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import em.model.forms.SubscriptionForm
import play.api.libs.ws.WSClient

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class PushController @Inject() (
                                 cc:                             ControllerComponents,
                                 val silhouette:                 Silhouette[AuthEnv],
                                 protected val dbConfigProvider: DatabaseConfigProvider,
                                 config: Configuration,
                                 ws: WSClient)(implicit context: ExecutionContext)
  extends AbstractController(cc)
    with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("api.push")

  def getVapidKey = Action { implicit request =>
    Ok(config.get[String]("application.push.publicKey"))
  }

  def registerSubscription= silhouette.SecuredAction.async(parse.json[SubscriptionForm]) { implicit request =>
    log.debug("Registering Push Subscription")
    System.out.println(Json.toJson(PushMessage(request.body.subscription, "Testmessage", 30000)))
    ws.url("http://localhost:3000/sendNotification").post(Json.toJson(PushMessage(request.body.subscription, "Testmessage", 30000)))

    db.run(SubscriptionTable.subscriptions.filter(_.endpoint === request.body.subscription.endpoint).result).flatMap { case subs =>
      if (subs.length > 0) {
        Future.successful(Created)
      } else {
        val toInsert = request.body.subscription.toUserSubscription(request.identity.id.get)
        db.run(SubscriptionTable.subscriptions.insertOrUpdate(toInsert)).map(x => Created)
      }
    }
  }

}
