# --- !Ups

ALTER TABLE todo
  ADD COLUMN created TIMESTAMP DEFAULT current_timestamp;

UPDATE todo SET created = timestamp;

# --- !Downs

ALTER TABLE todo
  DROP COLUMN created;