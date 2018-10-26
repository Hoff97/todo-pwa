package em.service

import em.model.{Login, PushPayload, Todo}
import em.model.forms.Subscription

import scala.concurrent.Future
import play.api.libs.ws.WSResponse

trait PushService {
  def sendMessage(subscription: Subscription, payload: PushPayload, ttl: Int = 30000)

  def notifyTodo(todo: Todo)

  def notifyUser(login: Login)

  def initialize
}
