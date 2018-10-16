package em.auth

import com.mohiva.play.silhouette.api.Env
import com.mohiva.play.silhouette.impl.authenticators.JWTAuthenticator
import em.model._

trait AuthEnv extends Env {
  type I = Login
  type A = JWTAuthenticator
}
