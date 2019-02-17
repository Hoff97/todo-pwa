package em.service

import java.sql.Timestamp
import java.time.{Instant, LocalDateTime, ZoneOffset}
import java.time.temporal._
import java.util.Date

import akka.actor.ActorSystem
import em.model.{HasCopy, HasID, SubscriptionUser, _}
import em.model.forms.Subscription
import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.json.Json
import play.api.libs.ws.WSClient
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}
import scala.concurrent.duration._
import java.util.Calendar

import com.mohiva.play.silhouette.api.{LoginInfo, Silhouette}
import com.mohiva.play.silhouette.impl.providers.CredentialsProvider
import em.auth.AuthEnv
import em.db.LoginTable.login
import em.db.{LoginTable, NotificationTable, SubscriptionTable, TodoTable}
import play.api.libs.mailer._
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import views.html._
import em.db.Util._

class PushServiceImpl @Inject()(protected val config: Configuration,
                                ws: WSClient,
                                actorSystem: ActorSystem,
                                protected val dbConfigProvider: DatabaseConfigProvider,
                                mailerClient: MailerClient,
                                val silhouette: Silhouette[AuthEnv])(implicit context: ExecutionContext)
  extends PushService with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("service.push")

  private val serverTimeOffset = config.get[Int]("server.timeOffsetMinutes")

  private val maxMinutesSchedule = 357913

  initialize

  override def sendMessage(subscription: Subscription, payload: PushPayload, ttl: Int = 30000) =
      ws.url(config.get[String]("application.push.serviceUrl"))
        .withHttpHeaders("auth-pw" -> config.get[String]("application.push.pw"))
        .post(Json.toJson(PushMessage(subscription, payload, ttl))).foreach { response =>
        if(response.status == 500) {
          log.debug("Deleting subscription")
          db.run(SubscriptionTable.subscriptions.filter(sub => sub.endpoint === subscription.endpoint
            && sub.keyAuth === subscription.keys.auth && sub.keyp256dh === subscription.keys.p256dh).delete)
        }
      }

  override def notifyUser(login: Login): Unit = {
    login.dailyReminder match {
      case Some(r) => {
        val nextRemTime = Calendar.getInstance()
        nextRemTime.set(Calendar.HOUR_OF_DAY, r.toLocalTime.getHour)
        nextRemTime.set(Calendar.MINUTE, r.toLocalTime.getMinute)
        nextRemTime.set(Calendar.SECOND, 0)
        nextRemTime.set(Calendar.MILLISECOND, 0)
        if((Instant.now().until(nextRemTime.toInstant, ChronoUnit.MINUTES).minutes + serverTimeOffset.minutes) < 0.seconds) {
          nextRemTime.add(Calendar.DAY_OF_MONTH, 1)
        }
        var diffMin = Instant.now().until(nextRemTime.toInstant, ChronoUnit.MINUTES).minutes
        log.debug(s"Scheduling reminder for user ${login.email} in ${diffMin._1} minutes")

        actorSystem.scheduler.scheduleOnce(diffMin + serverTimeOffset.minutes) {
          checkAndNotifyUser(login, nextRemTime)
        }
      }
      case None =>
    }
  }

  private def checkAndNotifyUser(login: Login, time: Calendar): Unit = {
    db.run(LoginTable.login.filter(x => x.id === login.id.get).result).foreach { usersDb =>
      if(usersDb.length > 0 && login.timestamp.equals(usersDb(0).timestamp)) {
        val loginDb = usersDb(0)
        log.debug("Notifiying user " + loginDb.email)
        time.set(Calendar.HOUR, 0)
        time.add(Calendar.DAY_OF_MONTH, 1)
        db.run(TodoTable.todo.filter(x => x.loginFk === login.id.get && !x.done).result).foreach{ todoDb =>
          val todosToday = todoDb.filter(todo => todo.date.isEmpty || isBeforeOrAtDay(todo.date.get, time))
          if(todosToday.length > 0) {
            val sortedTodos = todosToday.sortBy(todo => (-todo.priority.getOrElse(0), todo.name))

            dailyNotification(login, sortedTodos).foreach(payload => sendToUser(payload, login.id.get))
            sendDailyMail(login.email, sortedTodos)
          }
        }

        actorSystem.scheduler.scheduleOnce(10.minutes) {
          notifyUser(loginDb)
        }
      }
    }
  }

  private def sendDailyMail(userMail: String, todos: Seq[Todo]): Unit = {
    val email = Email(
      "Here are your daily todos",
      config.get[String]("server.emailSender"),
      Seq(userMail),
      bodyHtml = Some(new DailyNotification(userMail, todos).render().toString())
    )
    mailerClient.send(email)
  }

  private def isBeforeOrAtDay(date: Timestamp, day: Calendar): Boolean =
    Instant.ofEpochMilli(date.getTime).isBefore(day.toInstant)

  private def dailyNotification(login: Login, todos: Seq[Todo]): Future[PushPayload] = {
    var content = "Hi " + login.email + ", here are your todos:\n"
    content += todos.map(_.name).fold("")((a,b) => a + "\n" + b)

    val notification = insertAndReturn[Notification, NotificationTable](NotificationTable.notifications, Notification(None, login.getId))

    val payload = notification.map(notification =>
      PushPayload(notification.getId, "Here are your daily todos", content, List(), "", None))
    db.run(payload)
  }

  override def notifyTodo(todo: Todo): Unit = {
    if(!todo.done) {
      todo.reminder match {
        case Some(d) => {
          var diffMin = Instant.now().until(Instant.ofEpochMilli(d.getTime), ChronoUnit.MINUTES).minutes
          if(todo.date.isEmpty || d.toLocalDateTime.isBefore(LocalDateTime.now())) {
            log.debug("Scheduling daily reminder for todo")
            val l = LocalDateTime.now()
            var r = d.toLocalDateTime.withDayOfYear(l.getDayOfYear).withYear(l.getYear)
            diffMin = Instant.now().until(r.toInstant(ZoneOffset.ofHours(0)), ChronoUnit.MINUTES).minutes
            if(diffMin + serverTimeOffset.minutes < 0.minutes) {
              r = r.plus(1, ChronoUnit.DAYS);
              diffMin = Instant.now().until(r.toInstant(ZoneOffset.UTC), ChronoUnit.MINUTES).minutes
            }
          }
          diffMin += serverTimeOffset.minutes

          if(diffMin._1 >= 0 && diffMin <= maxMinutesSchedule.minutes) {
            log.debug(s"Scheduling reminder for todo ${todo.id} in ${diffMin._1} minutes")
            actorSystem.scheduler.scheduleOnce(diffMin) {
              checkAndNotifyTodo(todo)
            }
          }
        }
        case None =>
      }
    }
  }

  private def checkAndNotifyTodo(todo: Todo): Unit = {
    db.run(TodoTable.todo.filter(_.id === todo.id).result).zip(getToken(todo.loginFk)).foreach{ case (todoDb,token) =>
      if(todoDb.length > 0 && todo.equals(todoDb(0))) {
        log.debug(s"Sending notification for todo ${todo.id}")
        todoNotification(todo, Some(token)).foreach(payload => {
          log.debug(payload.toString)
          sendToUser(payload, todo.loginFk)
        })

        actorSystem.scheduler.scheduleOnce(2.minutes) {
          notifyTodo(todoDb(0))
        }
      }
    }
  }

  private def sendToUser(payload: PushPayload, userId: Int): Unit = {
    db.run(SubscriptionTable.subscriptions.filter(_.userFk === userId).result).foreach { subs =>
      subs.foreach(sub => sendMessage(sub.toSubscription, payload))
    }
  }

  private def todoNotification(todo: Todo, token: Option[String]): Future[PushPayload] = {
    val notification = insertAndReturn[Notification, NotificationTable](NotificationTable.notifications, Notification(None, todo.loginFk))

    val actions = List("done", "remind+1h")

    val payload = notification.map(notification =>
      PushPayload(notification.getId, todo.name,
        "Your todo item '" + todo.name + "' is due today",
        actions, todo.id,
        token))
    db.run(payload)
  }

  private def newVersionNotification(subscription: Subscription, userFk: Int): Future[PushPayload] = {
    val notification = insertAndReturn[Notification, NotificationTable](NotificationTable.notifications, Notification(None, userFk))

    db.run(notification).zip(getToken(userFk)).map { case(notification,token) =>
      PushPayload(notification.getId, "Todo App updated",
        "New version available. Open the app to get it.",
        List(), "",
        Some(token))
    }
  }

  private def notifyNewVersion(sub: SubscriptionUser) = {
    log.debug("Notifying user for new subscription")
    newVersionNotification(sub.toSubscription, sub.userFk)
      .foreach(payload => sendMessage(sub.toSubscription, payload))
  }

  override def initialize: Unit = {
    val currentVersion = config.get[String]("application.currentVersion")
    log.debug("Initializing push service")
    log.debug(s"Current server version: ${currentVersion}")
    db.run(TodoTable.todo.result).foreach { todos =>
      todos.foreach(todo => notifyTodo(todo))
    }

    db.run(LoginTable.login.result).foreach { logins =>
      logins.foreach(login => notifyUser(login))
    }

    db.run(SubscriptionTable.subscriptions.filter(x => x.version =!= currentVersion || x.version.isEmpty).result).foreach { subs =>
      subs.foreach(notifyNewVersion(_))
    }
  }

  def getToken(id: Int): Future[String] = {
    for {
      login <- db.run(login.filter(_.id === id).result)
      loginInfo = LoginInfo(CredentialsProvider.ID, login(0).email)
      authenticator <- silhouette.env.authenticatorService.create(loginInfo)(null)
      token <- silhouette.env.authenticatorService.init(authenticator)(null)
    } yield token
  }
}
