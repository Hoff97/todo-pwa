# --- !Ups

ALTER TABLE login
  ADD COLUMN mail_notifications boolean DEFAULT true;

# --- !Downs

ALTER TABLE login
  DROP COLUMN mail_notifications;