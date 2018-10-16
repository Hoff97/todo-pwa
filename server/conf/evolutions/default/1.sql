# --- !Ups

CREATE TABLE login (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR,
    pwHash VARCHAR,
    pwSalt VARCHAR,
    pwHasher VARCHAR,
    provider_id VARCHAR,
    provider_key VARCHAR
);

CREATE TABLE todo (
    id VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    login_fk BIGINT NOT NULL,
    date TIMESTAMP,
    priority int,
    done BOOLEAN NOT NULL DEFAULT false,
    category VARCHAR,
    timestamp TIMESTAMP NOT NULL
);

# --- !Downs

DROP TABLE IF EXISTS todo;

DROP TABLE IF EXISTS login;
