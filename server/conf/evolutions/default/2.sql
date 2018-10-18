# --- !Ups

CREATE TABLE subscription (
    id BIGSERIAL PRIMARY KEY,
    user_fk BIGINT NOT NULL,
    endpoint VARCHAR NOT NULL,
    key_auth VARCHAR NOT NULL,
    key_p256dh VARCHAR NOT NULL
);

# --- !Downs

DROP TABLE IF EXISTS subscription;
