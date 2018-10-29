package em.util

object Util {
  val colorMap = Map(5 -> "#F00", 4 -> "rgb(255, 123, 0)",
    3 -> "rgb(192, 168, 29)", 2 -> "rgb(143, 204, 0)", 1 -> "rgb(69, 187, 0)")

  def colorForPrio(prio: Int): String = colorMap(prio)
}
