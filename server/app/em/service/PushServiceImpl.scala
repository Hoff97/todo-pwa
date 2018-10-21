package em.service

import java.time.Instant
import java.time.temporal.{ChronoUnit, TemporalUnit}
import java.util.Date

import akka.actor.ActorSystem
import em.model.{PushMessage, PushPayload, Todo}
import em.model.forms.Subscription
import javax.inject.Inject
import play.api.Configuration
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import slick.jdbc.JdbcProfile

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import java.util.Calendar

import em.db.{SubscriptionTable, TodoTable}
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._

class PushServiceImpl @Inject()(protected val config: Configuration,
                                ws: WSClient,
                                actorSystem: ActorSystem,
                                protected val dbConfigProvider: DatabaseConfigProvider)(implicit context: ExecutionContext)
  extends PushService with HasDatabaseConfigProvider[JdbcProfile] {

  private val serverTimeOffset = config.get[Int]("server.timeOffsetMinutes")

  override def sendMessage(subscription: Subscription, payload: PushPayload, ttl: Int = 30000) =
      ws.url(config.get[String]("application.push.serviceUrl"))
        .post(Json.toJson(PushMessage(subscription, payload, ttl)))

  override def notifyTodo(todo: Todo): Unit = {
    todo.date match {
      case Some(d) => {
        val cal = Calendar.getInstance
        cal.setTimeInMillis(d.getTime)
        cal.set(Calendar.HOUR_OF_DAY, 10)
        cal.set(Calendar.MINUTE, 0)

        var diffMin = Instant.now().until(cal.toInstant, ChronoUnit.MINUTES).minutes

        if(diffMin._1 > 0) {
          actorSystem.scheduler.scheduleOnce(diffMin + serverTimeOffset.minutes) {
            checkAndNotify(todo)
          }
        }
      }
      case None =>
    }
  }

  private def checkAndNotify(todo: Todo): Unit = {
    db.run(TodoTable.todo.filter(_.id === todo.id).result).foreach{ todoDb =>
      if(todoDb.length > 0 && todo.equals(todoDb(0))) {
        sendToUser(todoNotification(todo), todo.loginFk)
      }
    }
  }

  private def sendToUser(payload: PushPayload, userId: Int): Unit = {
    db.run(SubscriptionTable.subscriptions.filter(_.userFk === userId).result).foreach { subs =>
      subs.foreach(sub => sendMessage(sub.toSubscription, payload))
    }
  }

  private def todoNotification(todo: Todo): PushPayload = PushPayload(todo.name, "Your todo item '" + todo.name + "' is due today", List())
}
