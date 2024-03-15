-- Create the Events table
CREATE TABLE event_category
(
    id            SERIAL PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    last_updated  TIMESTAMP    NOT NULL DEFAULT now()
);

INSERT INTO event_category (category_name, last_updated)
VALUES ('Careers and employability', now()),
       ('University', now()),
       ('Student Union', now());

-- Create the Organizers table
CREATE TABLE organizers
(
    id             SERIAL PRIMARY KEY,
    organizer_name VARCHAR(255) NOT NULL,
    last_updated   TIMESTAMP    NOT NULL DEFAULT now()
);

-- Create the Event Category table
CREATE TABLE events
(
    id             SERIAL PRIMARY KEY,
    organizer_id   INT,
    category_id    INT          NOT NULL,
    event_name     VARCHAR(255) NOT NULL,
    description    TEXT,
    start_datetime TIMESTAMP    NOT NULL,
    end_datetime   TIMESTAMP    NOT NULL,
    location       VARCHAR(255) NOT NULL,
    status         VARCHAR(20)  NOT NULL,
    last_updated   TIMESTAMP    NOT NULL DEFAULT now(),
    created_at     TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT fk_organizer_id
        FOREIGN KEY (organizer_id) REFERENCES organizers (id),
    CONSTRAINT fk_category_id
        FOREIGN KEY (category_id) REFERENCES event_category (id)
);

-- Create the Media table
CREATE TABLE media
(
    id           SERIAL PRIMARY KEY,
    event_id     INT          NOT NULL,
    filename     VARCHAR(255) NOT NULL,
    ext          VARCHAR(10)  NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT now(),
    last_updated TIMESTAMP    NOT NULL DEFAULT now(),
    CONSTRAINT fk_event_id
        FOREIGN KEY (event_id) REFERENCES events (id)
);

-- Create the Roles table
CREATE TABLE roles
(
    id           SERIAL PRIMARY KEY,
    role_name    VARCHAR(255) NOT NULL,
    last_updated TIMESTAMP    NOT NULL DEFAULT now()
);

-- Insert Statement for Roles table
INSERT INTO roles (role_name, last_updated)
VALUES ('User', now()),
       ('Admin', now());

-- Create the Users table
CREATE TABLE users
(
    id           SERIAL PRIMARY KEY,
    role_id      INT                 NOT NULL,
    username     VARCHAR(255) UNIQUE NOT NULL,
    password     TEXT                NOT NULL,
    email        VARCHAR(255) UNIQUE NOT NULL,
    first_name   VARCHAR(255)        NOT NULL,
    last_name    VARCHAR(255)        NOT NULL,
    points       INT                 NOT NULL DEFAULT 0,
    last_updated TIMESTAMP           NOT NULL DEFAULT now(),
    created_at   TIMESTAMP           NOT NULL DEFAULT now(),
    CONSTRAINT fk_role_id
        FOREIGN KEY (role_id) REFERENCES roles (id)
);

-- Create the Bookings table
CREATE TABLE bookings
(
    id               SERIAL PRIMARY KEY,
    event_id         INT         NOT NULL,
    user_id          INT         NOT NULL,
    booking_datetime TIMESTAMP   NOT NULL DEFAULT now(),
    booking_ref      VARCHAR(20) NOT NULL DEFAULT TO_CHAR(NOW(), 'YYYYMMDD') ||
                                                  LPAD(NEXTVAL('bookings_id_seq')::TEXT, 4, '0') UNIQUE,
    ticket_quantity  INT         NOT NULL DEFAULT 1,
    status           VARCHAR(20) NOT NULL,
    remark           TEXT,
    last_updated     TIMESTAMP   NOT NULL DEFAULT now(),
    CONSTRAINT fk_event_id
        FOREIGN KEY (event_id) REFERENCES events (id),
    CONSTRAINT fk_user_id
        FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE user_session
(
    id         TEXT PRIMARY KEY,
    expires_at TIMESTAMPTZ NOT NULL,
    user_id    INT         NOT NULL REFERENCES users (id)
);
