# --- !Ups

ALTER TABLE subscription
  ADD COLUMN timestamp TIMESTAMP DEFAULT current_timestamp;

# --- !Downs

ALTER TABLE subscription
  DROP COLUMN timestamp;