# --- !Ups

ALTER TABLE subscription
  ADD COLUMN device_description VARCHAR DEFAULT '';

# --- !Downs

ALTER TABLE subscription
  DROP COLUMN device_description;