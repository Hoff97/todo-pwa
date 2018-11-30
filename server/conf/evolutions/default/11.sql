# --- !Ups

CREATE TABLE notification (
    id BIGSERIAL PRIMARY KEY,
    login_fk BIGINT NOT NULL
);

# --- !Downs

DROP TABLE notification;