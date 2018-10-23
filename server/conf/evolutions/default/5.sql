# --- !Ups

ALTER TABLE todo
  ADD COLUMN parent_fk VARCHAR DEFAULT null;

ALTER TABLE todo
  ADD CONSTRAINT todo_parent_fk
  	FOREIGN KEY (parent_fk)
  	REFERENCES todo
    ON DELETE CASCADE;

# --- !Downs

ALTER TABLE todo
  DROP CONSTRAINT todo_parent_fk;

ALTER TABLE todo
  DROP COLUMN parent_fk;