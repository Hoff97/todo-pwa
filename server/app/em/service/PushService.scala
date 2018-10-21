package em.service

import em.model.{PushPayload, Todo}
import em.model.forms.Subscription

import scala.concurrent.Future
import play.api.libs.ws.WSResponse

trait PushService {
  def sendMessage(subscription: Subscription, payload: PushPayload, ttl: Int = 30000): Future[WSResponse]

  def notifyTodo(todo: Todo)
}
