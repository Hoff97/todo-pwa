package em.service

import em.model.{File, Todo}

import scala.concurrent.Future

trait FileService {
  def updateAndCreateFiles(files: Seq[File], loginId: Int): Future[_]
}
