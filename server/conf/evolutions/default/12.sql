# --- !Ups

UPDATE todo SET priority = 1, server_timestamp = CURRENT_TIMESTAMP WHERE priority IS NULL;

# --- !Downs

