# --- !Ups

ALTER TABLE todo
  ADD COLUMN reminder TIMESTAMP DEFAULT null;

ALTER TABLE login
  ADD COLUMN timestamp TIMESTAMP NOT NULL DEFAULT current_timestamp;

ALTER TABLE login
  ADD COLUMN daily_reminder time DEFAULT '10:00';

# --- !Downs

ALTER TABLE todo
  DROP COLUMN reminder;

ALTER TABLE login
  DROP COLUMN timestamp;

ALTER TABLE login
  DROP COLUMN daily_reminder;
