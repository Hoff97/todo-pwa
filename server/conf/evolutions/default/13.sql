# --- !Ups

ALTER TABLE subscription
  ADD COLUMN version VARCHAR DEFAULT NULL;

# --- !Downs

ALTER TABLE subscription
  DROP COLUMN version;