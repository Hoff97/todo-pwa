# --- !Ups

CREATE TABLE file (
    id VARCHAR PRIMARY KEY,
    todo_fk VARCHAR NOT NULL REFERENCES todo (id) ON DELETE CASCADE,
    name VARCHAR NOT NULL,
    data VARCHAR NOT NULL,
    server_timestamp TIMESTAMP DEFAULT null,
    timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp
);

ALTER TABLE todo
  ADD COLUMN comment VARCHAR DEFAULT null;

ALTER TABLE todo
  ADD CONSTRAINT todo_login_fk
  	FOREIGN KEY (login_fk)
  	REFERENCES login
    ON DELETE CASCADE;

# --- !Downs

DROP TABLE file;

ALTER TABLE todo
  DROP COLUMN comment;

ALTER TABLE todo
  DROP CONSTRAINT todo_login_fk;