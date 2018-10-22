# --- !Ups

ALTER TABLE todo
  ADD COLUMN reminder TIMESTAMP DEFAULT null;

# --- !Downs

ALTER TABLE todo
  DROP COLUMN reminder;
