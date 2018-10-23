# --- !Ups

ALTER TABLE todo
  ADD COLUMN server_timestamp TIMESTAMP DEFAULT null;

UPDATE todo SET server_timestamp = timestamp;

# --- !Downs

ALTER TABLE todo
  DROP COLUMN server_timestamp;