-- Create the Events table
CREATE TABLE events
(
    event_id     SERIAL PRIMARY KEY,
    event_name   VARCHAR(255) NOT NULL,
    description  TEXT,
    start_date   DATE         NOT NULL,
    end_date     DATE         NOT NULL,
    venue        VARCHAR(255) NOT NULL,
    organizer_id INT,
    status       VARCHAR(20)  NOT NULL
);

-- Create the Users table
CREATE TABLE users
(
    user_id   SERIAL PRIMARY KEY,
    username  VARCHAR(255)        NOT NULL,
    password  TEXT                NOT NULL,
    email     VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255)        NOT NULL,
    role      VARCHAR(20)         NOT NULL
);

-- Create the Attendees table
CREATE TABLE attendees
(
    attendee_id SERIAL PRIMARY KEY,
    event_id    INT NOT NULL,
    user_id     INT NOT NULL
);

-- Create the Event_Schedule table
CREATE TABLE event_schedule
(
    schedule_id SERIAL PRIMARY KEY,
    event_id    INT          NOT NULL,
    start_time  TIMESTAMP    NOT NULL,
    end_time    TIMESTAMP    NOT NULL,
    activity    TEXT         NOT NULL,
    location    VARCHAR(255) NOT NULL
);

-- Create the Bookings table
CREATE TABLE bookings
(
    booking_id      SERIAL PRIMARY KEY,
    event_id        INT         NOT NULL,
    user_id         INT         NOT NULL,
    booking_date    TIMESTAMP   NOT NULL,
    ticket_quantity INT         NOT NULL,
    status          VARCHAR(20) NOT NULL
);