package em.model

trait HasID[A, I] extends slick.lifted.AbstractTable[A] {
  def id: slick.lifted.Rep[I]
  
  type TableElementType <: HasCopy[A, I]
}

trait HasCopy[A, I] {
  def cpy(i: Option[I]): A
}