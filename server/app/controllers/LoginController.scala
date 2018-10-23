package controllers

import java.sql.{Time, Timestamp}
import java.time.LocalTime
import java.time.format.DateTimeFormatter
import java.util.Date

import scala.concurrent.Future
import scala.concurrent.duration._
import com.mohiva.play.silhouette.api._
import com.mohiva.play.silhouette.api.services._
import com.mohiva.play.silhouette.api.Authenticator.Implicits._
import com.mohiva.play.silhouette.api.exceptions.ProviderException
import com.mohiva.play.silhouette.api.repositories.AuthInfoRepository
import com.mohiva.play.silhouette.api.util.{Clock, Credentials, PasswordHasher}
import com.mohiva.play.silhouette.impl.providers._
import com.mohiva.play.silhouette.impl.providers.state._
import com.mohiva.play.silhouette.impl.exceptions._
import javax.inject._
import play.api.{Configuration, Logger}
import play.api.cache.AsyncCacheApi
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import play.api.libs.concurrent.Execution.Implicits._
import play.api.libs.json._
import play.api.mvc._
import slick.jdbc.JdbcProfile
import em.auth._
import em.model._
import em.model.forms._
import em.service._
import em.db._
import slick.jdbc.JdbcProfile
import slick.jdbc.PostgresProfile.api._
import em.db.Util._
import em.util.FormErrorJson._


class LoginController@Inject() (
  val silhouette: Silhouette[AuthEnv],
  loginService: LoginService,
  authInfoRepository: AuthInfoRepository,
  credentialsProvider: CredentialsProvider,
  configuration: Configuration,
  clock: Clock,
  cc: ControllerComponents,
  cache: AsyncCacheApi,
  passwordHasher: PasswordHasher,
  protected val dbConfigProvider: DatabaseConfigProvider,
  avatarService: AvatarService,
  pushService: PushService)
    extends AbstractController(cc) with HasDatabaseConfigProvider[JdbcProfile] {

  val log = Logger("api.login")

  /**
   * Handles the submitted signup json.
   */
  def signUp = Action.async(parse.json) { implicit request =>
    SignUpForm.form.bindFromRequest.fold(
      form => {
        Future.successful(BadRequest(Json.toJson(form.errors)))
      },
      data => {
        log.debug(s"Request to sign up with mail ${data.email}")
        val loginInfo = LoginInfo(CredentialsProvider.ID, data.email)
        loginService.retrieveAll(loginInfo).flatMap {
          case Some(login) =>
            Future.successful(BadRequest(Json.obj("message" -> "user.exists")))
          case None =>
            val authInfo = passwordHasher.hash(data.password)
            val login = Login(None, data.email, None, None, None, loginInfo.providerID, loginInfo.providerKey,
              new Timestamp(new Date().getTime), Some(new Time(10,0,0)))
            for {
              login <- loginService.save(login)
              authInfo <- authInfoRepository.add(loginInfo, authInfo)
              authenticator <- silhouette.env.authenticatorService.create(loginInfo)
              token <- silhouette.env.authenticatorService.init(authenticator)
              avatar <- avatarService.retrieveURL(data.email)
            } yield {
              silhouette.env.eventBus.publish(SignUpEvent(login, request))
              silhouette.env.eventBus.publish(LoginEvent(login, request))
              Ok(Json.obj("token" -> token))
            }
        }
      })
  }
  
  /**
    * Handles a login request with the login data in the request body.
    *
    * @return The answer: 200 on success, 401 on wrong credentials
    */
  def login = Action.async(parse.json) { implicit request =>
    request.body.validate[SignInForm].map { data =>
      log.debug(s"Request to login with ${data.email}")
      credentialsProvider.authenticate(Credentials(data.email, data.password)).flatMap { loginInfo =>
        loginService.retrieve(loginInfo).flatMap {
          case Some(login) => silhouette.env.authenticatorService.create(loginInfo).map {
            case authenticator if data.rememberMe =>
              val c = configuration.underlying
              authenticator.copy(
                expirationDateTime = clock.now + FiniteDuration(c.getLong("silhouette.authenticator.rememberMe.authenticatorExpiry"),"ms"),
                idleTimeout = Some(FiniteDuration(c.getLong("silhouette.authenticator.rememberMe.authenticatorIdleTimeout"),"ms"))
              )
            case authenticator => authenticator
          }.flatMap { authenticator =>
            silhouette.env.eventBus.publish(LoginEvent(login, request))
            silhouette.env.authenticatorService.init(authenticator).map { token =>
              Ok(Json.obj("token" -> token))
            }
          }
          case None => Future.failed(new IdentityNotFoundException("Couldn't find user"))
        }
      }.recover {
        case e: ProviderException =>
          Unauthorized(Json.obj("message" -> "unauthorized"))
      }
    }.recoverTotal {
      case error =>
        Future.successful(Unauthorized(Json.obj("message" -> "invalid credentials")))
    }
  }

  /**
    * Manages the sign out action.
    * Since we are using JWT wich are stateless this has no effect.
    */
  def signOut = silhouette.SecuredAction.async { implicit request =>
    silhouette.env.eventBus.publish(LogoutEvent(request.identity, request))
    silhouette.env.authenticatorService.discard(request.authenticator, Ok)
  }

  def updateDailyReminder = silhouette.SecuredAction.async(parse.text) { implicit request =>
    log.debug(s"Request to update daily reminder")
    val time =
      if(request.body.equals("")) None
      else Some(LocalTime.parse(request.body, DateTimeFormatter.ofPattern("HH:mm")))

    val update = request.identity.copy(dailyReminder = time.map(x => new Time(x.getHour, x.getMinute, 0)),
      timestamp = new Timestamp(new Date().getTime))
    pushService.notifyUser(update)
    db.run(LoginTable.login.insertOrUpdate(update)).map(x => Ok)
  }
}
