package controllers

import javax.inject._
import play.api._
import play.api.mvc._
import scala.concurrent._

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class HomeController @Inject()(cc: ControllerComponents)(implicit context: ExecutionContext) 
 extends AbstractController(cc) {
  def index() = Action { implicit request: Request[AnyContent] =>
    Ok.sendFile(new java.io.File("./public/index.html"))
  }
}
