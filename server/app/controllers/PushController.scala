package controllers

import akka.actor.ActorSystem
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
import em.model.{PushMessage, PushPayload, Todo, TodoV}
import com.mohiva.play.silhouette.api.actions.SecuredRequest
import em.model.forms.SubscriptionForm
import em.service.PushService
import play.api.libs.ws.WSClient
import scala.concurrent.duration._

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */
@Singleton
class PushController @Inject()(
                                 cc:                             ControllerComponents,
                                 val silhouette:                 Silhouette[AuthEnv],
                                 protected val dbConfigProvider: DatabaseConfigProvider,
                                 config: Configuration,
                                 ws: WSClient,
                                 pushService: PushService,
                                 actorSystem: ActorSystem)(implicit context: ExecutionContext)
  extends AbstractController(cc)
    with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("api.push")

  def getVapidKey = Action { implicit request =>
    Ok(config.get[String]("application.push.publicKey"))
  }

  def registerSubscription= silhouette.SecuredAction.async(parse.json[SubscriptionForm]) { implicit request =>
    log.debug("Registering Push Subscription")

    val toInsert = request.body.subscription.toUserSubscription(request.identity.id.get, request.body.deviceDescription)
    val query = SubscriptionTable.subscriptions
      .filter(x => x.endpoint === request.body.subscription.endpoint && x.userFk === request.identity.id.get)

    db.run(query.result).flatMap{ nUpdated =>
      if(nUpdated.length > 0)
        db.run(query.update(toInsert.copy(id = nUpdated(0).id))).map(_ => Created)
      else
        db.run(SubscriptionTable.subscriptions.insertOrUpdate(toInsert)).map(_ => Created)
    }
  }

  def getSubscriptions= silhouette.SecuredAction.async { implicit request =>
    log.debug("Getting user subscriptions")

    val query = SubscriptionTable.subscriptions
      .filter(x => x.userFk === request.identity.id.get)

    db.run(query.result).map(subs => Ok(Json.toJson(subs)))
  }

  def deleteSubscription(id: Int) = silhouette.SecuredAction.async { implicit request =>
    log.debug("Deleting subscription")

    val query = SubscriptionTable.subscriptions
      .filter(x => x.userFk === request.identity.id.get && x.id === id)

    db.run(query.delete).map(x => Ok)
  }

}
