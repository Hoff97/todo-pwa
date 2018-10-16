package em.model.forms

import play.api.data.Form
import play.api.data.Forms._
import play.api.data.validation.{Constraint, Invalid, Valid}
import play.api.libs.json.Json

/**
  * The form which handles the sign up process.
  */
object SignUpForm {

  val repeatedPasswordConstraint: Constraint[Data] = Constraint("repeatedPassword")({
    data =>
      if (data.password.equals(data.repeatedPassword)){
        Valid
      } else {
        Invalid("repeatedPassword")
      }
  })


  /**
    * A play framework form.
    */
  val form = Form(
    mapping(
      "email" -> email,
      "password" -> nonEmptyText.verifying("too short", x => x.length>7),
      "repeatedPassword" -> text
    )(Data.apply)(Data.unapply) verifying(repeatedPasswordConstraint)
  )

  /**
    * The form data.
    *
    * @param firstName The first name of a user.
    * @param lastName The last name of a user.
    * @param email The email of the user.
    * @param password The password of the user.
    * @param repeatedPassword The password the user repeats to check if he entered it correct.
    * @param acceptedTerms If the user accepted terms of conditions.
    */
  case class Data(
    email: String,
    password: String,
    repeatedPassword: String)

  /**
    * The companion object.
    */
  object Data {

    /**
      * Converts the [Date] object to Json and vice versa.
      */
    implicit val jsonFormat = Json.format[Data]
  }
}
