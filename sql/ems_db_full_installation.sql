--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE IF EXISTS event_management_system_db;
--
-- Name: event_management_system_db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE event_management_system_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';


ALTER DATABASE event_management_system_db OWNER TO postgres;

\connect event_management_system_db

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_task(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.update_task()
    LANGUAGE plpgsql
    AS $$
begin
    -- Update all the bookings to absent when the current time passed the event end date
    update bookings b
    set status = 'absent'
    from events e
    where e.id = b.event_id
      and b.status = 'booked'
      and e.end_datetime <= now();

    -- Update all the events' status to past when the current time passed the event end date
    update events
    set status = 'past'
    where status = 'upcoming'
      and end_datetime <= now();

    commit;
end;
$$;


ALTER PROCEDURE public.update_task() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    event_id integer NOT NULL,
    user_id integer NOT NULL,
    booking_datetime timestamp without time zone DEFAULT now() NOT NULL,
    ticket_quantity integer DEFAULT 1 NOT NULL,
    status character varying(20) NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    booking_ref character varying(20) DEFAULT to_char(now(), 'YYYYMMDDHH24MISSMS'::text) NOT NULL,
    remark text
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.bookings_id_seq OWNER TO postgres;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: event_category; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_category (
    id integer NOT NULL,
    category_name character varying(255) NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.event_category OWNER TO postgres;

--
-- Name: event_category_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.event_category_id_seq OWNER TO postgres;

--
-- Name: event_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_category_id_seq OWNED BY public.event_category.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    organizer_id integer,
    category_id integer NOT NULL,
    event_name character varying(255) NOT NULL,
    description text,
    start_datetime timestamp without time zone NOT NULL,
    end_datetime timestamp without time zone NOT NULL,
    location character varying(255) NOT NULL,
    status character varying(20) NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.events OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id integer NOT NULL,
    event_id integer NOT NULL,
    filename character varying(255) NOT NULL,
    ext character varying(10) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.media_id_seq OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: organizers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organizers (
    id integer NOT NULL,
    organizer_name character varying(255) NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true NOT NULL,
    description text
);


ALTER TABLE public.organizers OWNER TO postgres;

--
-- Name: organizers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organizers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.organizers_id_seq OWNER TO postgres;

--
-- Name: organizers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organizers_id_seq OWNED BY public.organizers.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    role_name character varying(255) NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.roles OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.roles_id_seq OWNER TO postgres;

--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: user_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_session (
    id text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.user_session OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    role_id integer NOT NULL,
    username character varying(255) NOT NULL,
    password text NOT NULL,
    email character varying(255) NOT NULL,
    points integer DEFAULT 0 NOT NULL,
    last_updated timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: event_category id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_category ALTER COLUMN id SET DEFAULT nextval('public.event_category_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: organizers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers ALTER COLUMN id SET DEFAULT nextval('public.organizers_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.bookings VALUES (3, 5, 6, '2024-03-07 22:06:58.269305', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403070004', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (25, 5, 11, '2024-03-22 16:03:06.101669', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403220026', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (2, 4, 6, '2024-03-01 09:33:08.48529', 3, 'cancelled', '2024-05-01 16:03:24.182572', '202403010002', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (15, 6, 13, '2024-03-17 17:38:47.836046', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403170016', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (5, 4, 4, '2024-03-07 22:10:01.494335', 2, 'cancelled', '2024-05-01 16:03:24.182572', '202403070006', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (7, 4, 7, '2024-03-13 14:48:00.100294', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403130008', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (1, 4, 7, '2024-02-29 19:17:40.956884', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202402290001', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (9, 7, 1, '2024-03-15 03:34:05.137889', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403150010', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (11, 7, 7, '2024-03-17 17:31:26.223366', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403170012', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (17, 4, 13, '2024-03-17 17:44:09.438317', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403170018', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (19, 7, 12, '2024-03-17 17:46:49.967837', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403170020', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (21, 4, 7, '2024-03-22 15:45:20.842658', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403220022', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (29, 8, 13, '2024-04-10 18:12:50.317428', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202404100029', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (35, 5, 127, '2024-04-01 18:28:13', 1, 'cancelled', '2024-05-01 16:03:24.182572', '20240414172918314', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (49, 9, 127, '2024-05-01 16:02:20.882895', 1, 'cancelled', '2024-05-01 16:03:24.182572', '20240501160220882', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (23, 5, 7, '2024-03-22 15:45:29.353851', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403220024', 'Cancelled by user before 24 hours of event start date');
INSERT INTO public.bookings VALUES (27, 5, 13, '2024-03-22 16:07:40.693449', 1, 'cancelled', '2024-05-01 16:03:24.182572', '202403220028', 'Cancelled by user before 24 hours of event start date');


--
-- Data for Name: event_category; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.event_category VALUES (1, 'Careers and employability', '2024-02-16 09:39:16.989321', true);
INSERT INTO public.event_category VALUES (2, 'University', '2024-02-16 09:39:16.989321', true);
INSERT INTO public.event_category VALUES (3, 'Student Union', '2024-03-27 21:59:16.577246', true);
INSERT INTO public.event_category VALUES (5, 'Sports', '2024-03-28 21:46:09.99546', false);


--
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (5, 1, 2, 'New Test Event', 'Description edited', '2024-03-23 15:00:00', '2024-03-23 17:00:00', 'Somewhere', 'past', '2024-03-22 15:38:29.102606', '2024-03-01 09:31:28.426458');
INSERT INTO public.events VALUES (2, 1, 2, 'New Event', 'test Somewhat new', '2024-02-18 20:00:00', '2024-02-20 20:00:00', 'Somewhere', 'canceled', '2024-03-26 21:32:26.51295', '2024-02-18 20:57:55.494038');
INSERT INTO public.events VALUES (1, 1, 2, 'School Event', 'New school event', '2024-02-16 15:30:00', '2024-02-16 16:30:00', 'asdf', 'past', '2024-02-25 16:56:44.371162', '2024-02-16 09:41:33.084596');
INSERT INTO public.events VALUES (7, 1, 2, 'Student Rep Election', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec viverra risus nec purus auctor, et pharetra dui sodales. Integer rhoncus ante metus, nec convallis ante suscipit nec. Sed vel ornare nulla. Vivamus lacinia pharetra leo non dictum. Nunc porta malesuada dui, eget pulvinar mi consequat et. Ut malesuada imperdiet quam bibendum tincidunt. Quisque fringilla lectus nec diam sollicitudin condimentum. Maecenas augue sapien, lobortis a ligula pellentesque, sagittis tempor ligula. Duis non est eget ligula placerat suscipit. Nullam vitae urna dignissim, elementum massa at, scelerisque neque. Ut dignissim tortor in neque pellentesque, sed mollis metus scelerisque. In tristique dapibus erat, eget egestas turpis faucibus vel.', '2024-04-01 15:00:00', '2024-04-01 20:00:00', 'Student Union', 'past', '2024-03-14 21:54:22.127509', '2024-03-14 21:54:22.127509');
INSERT INTO public.events VALUES (6, 2, 2, 'Career''s Fair', '', '2024-04-01 15:00:00', '2024-04-01 18:00:00', 'Third''s Space', 'past', '2024-03-10 19:32:20.098842', '2024-03-10 19:32:20.098842');
INSERT INTO public.events VALUES (4, 2, 2, 'Employability Fair', 'Hiring fair by many organizations', '2024-04-01 13:00:00', '2024-04-01 17:00:00', 'Third''s Space', 'past', '2024-02-24 19:22:21.170548', '2024-02-24 19:22:21.170548');
INSERT INTO public.events VALUES (8, 1, 2, 'Research Event', '', '2024-04-11 15:00:00', '2024-04-11 17:00:00', 'Atrium', 'past', '2024-04-09 02:34:13.179026', '2024-04-09 02:34:13.179026');
INSERT INTO public.events VALUES (9, 1, 2, 'Test Undefined Event', 'This is for testing', '2050-01-01 12:00:00', '2050-01-01 13:00:00', 'Somewhere', 'upcoming', '2024-04-15 00:35:46.661931', '2024-04-15 00:35:46.661931');


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: organizers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.organizers VALUES (1, 'UoP', '2024-04-05 22:23:11.723807', true, 'University of Portsmouth');
INSERT INTO public.organizers VALUES (2, 'SPEC', '2024-04-17 12:30:36.258557', true, 'Careers and Employability service provided by University of Portsmouth');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.roles VALUES (1, 'User', '2024-02-15 22:02:00.526512');
INSERT INTO public.roles VALUES (2, 'Admin', '2024-02-15 22:02:00.526512');




--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (7, 1, '1251079', '9b3435316772f9900a98f3eab06afcca', 'up1251079@myport.ac.uk', 0, '2024-03-07 22:06:07.664019', '2024-02-22 20:05:36.013716', 'Ni', 'Lar', true);
INSERT INTO public.users VALUES (1, 1, '6069445', '145c1305cda9dcc8a10ee65f0aca31f6', 'up6069445@myport.ac.uk', 0, '2024-02-22 20:05:35.949576', '2024-02-22 20:05:35.949576', 'Joletta', 'Reneke', true);
INSERT INTO public.users VALUES (2, 1, '1917718', '59015b7ec6e34b39b8b9d4814a2a515f', 'up1917718@myport.ac.uk', 0, '2024-02-22 20:05:35.975851', '2024-02-22 20:05:35.975851', 'Matthus', 'Bowhay', true);
INSERT INTO public.users VALUES (3, 1, '7085901', '3fb8f80a7ade235a0e06f7dfd24c52c4', 'up7085901@myport.ac.uk', 0, '2024-02-22 20:05:35.984507', '2024-02-22 20:05:35.984507', 'Natasha', 'Ferrarone', true);
INSERT INTO public.users VALUES (4, 1, '0978195', 'd65cbe5df08ac35d2660a0d5c221ab05', 'up0978195@myport.ac.uk', 0, '2024-02-22 20:05:35.993015', '2024-02-22 20:05:35.993015', 'Antin', 'Slemmonds', true);
INSERT INTO public.users VALUES (5, 1, '1277164', '4574d779d9ccac1691569f3e846da04c', 'up1277164@myport.ac.uk', 0, '2024-02-22 20:05:35.999564', '2024-02-22 20:05:35.999564', 'Sinclair', 'O'' Hanvey', true);
INSERT INTO public.users VALUES (8, 1, '0651314', '0951548fab4e9f660985ce3d559e0aa0', 'up0651314@myport.ac.uk', 0, '2024-02-22 20:05:36.031004', '2024-02-22 20:05:36.031004', 'Benton', 'Koeppke', true);
INSERT INTO public.users VALUES (9, 1, '0304071', 'd7d38de3177cddc5ec03e747a4a9d568', 'up0304071@myport.ac.uk', 0, '2024-02-22 20:05:36.038585', '2024-02-22 20:05:36.038585', 'Alexandros', 'MacGown', true);
INSERT INTO public.users VALUES (10, 1, '9884463', '15648c5cb8a6de8118a977f4814e4900', 'up9884463@myport.ac.uk', 0, '2024-02-22 20:05:36.054615', '2024-02-22 20:05:36.054615', 'Gwennie', 'Dunston', true);
INSERT INTO public.users VALUES (6, 1, '9105813', '31bc8596c69753e3bd5cee7be7ab1848', 'up9105813@myport.ac.uk', 0, '2024-03-01 19:14:04.597756', '2024-02-22 20:05:36.005813', 'Hobie', 'Whopp', true);
INSERT INTO public.users VALUES (11, 1, '123123', '123', 'test@gmail.com', 0, '2024-03-10 18:51:26.120103', '2024-03-10 18:51:26.120103', 'Sint Lwin', 'Htoo', true);
INSERT INTO public.users VALUES (12, 2, 'admin', '8b4d6ad1dcca6cde:78e4915b170149624ff2ca7263f56b928d9f8da0fb489e41bbc584bf2359561a430373bce6b6f939689379a3a58bafbab4553eb6cdacda6ea7171e39c3d690d6', 'admin@gmail.com', 0, '2024-03-13 22:00:02.447356', '2024-03-13 22:00:02.447356', 'Admin', 'Admin', true);
INSERT INTO public.users VALUES (122, 1, '1358715', '$2a$04$WMcw1ksERJ6SIWaRAS8JrefWZ42LtIYN3LXG0XbtyPq1fPzQEqeli', 'bqueripel0@fotki.com', 0, '2024-03-24 15:37:17.160298', '2024-03-24 15:37:17.160298', 'Barthel', 'Queripel', true);
INSERT INTO public.users VALUES (123, 1, '0511185', '$2a$04$a.Q32z.2B6sdgZc7aF7KkeDgkyAbprKposqYT9meRQqu5l1Ouge/K', 'frowcastle1@furl.net', 0, '2024-03-24 15:37:17.165019', '2024-03-24 15:37:17.165019', 'Frances', 'Rowcastle', true);
INSERT INTO public.users VALUES (124, 1, '6236366', '$2a$04$/5xhJIqf/vMSYv7I/ucBpeuTJSyCyBcSMbeDr9BVz1z1u9u5LJiWe', 'ddomanski2@nydailynews.com', 0, '2024-03-24 15:37:17.165494', '2024-03-24 15:37:17.165494', 'Dolli', 'Domanski', true);
INSERT INTO public.users VALUES (125, 1, '7181256', '$2a$04$.w9EImZKO5SbRt9awt0dm.AK6hgc4zhm/QiSyaezYhl60SU.lTW62', 'zscotsbrook3@fotki.com', 0, '2024-03-24 15:37:17.165928', '2024-03-24 15:37:17.165928', 'Zechariah', 'Scotsbrook', true);
INSERT INTO public.users VALUES (126, 1, '7062885', '$2a$04$Im4dUSthXJZeyqvj2RZDt.84Ec.dgRL632O/rlnzFnbwDmTWTaXxS', 'tholwell4@europa.eu', 0, '2024-03-24 15:37:17.166309', '2024-03-24 15:37:17.166309', 'Theda', 'Holwell', true);
INSERT INTO public.users VALUES (13, 2, 'sintlwin', '01b0e2be2751bd64:bdeb3903c393b1cc15d60c8e32ba908b1332f94bbf501b70122563c0b1b293c84ec03ed588f8fefd84f8934d7cb511459c9b56ff55f37563ee07474386e07da5', 'sintlwin@gmail.com', 10, '2024-04-08 01:06:46.709613', '2024-03-15 23:24:29.349455', 'Sint Lwin', 'Htoo', true);
INSERT INTO public.users VALUES (127, 1, 'testuser', 'b3251539aec6b500:a3b241506ec069753b7510ed791ccf8a71441087f3175b9a75001af139302d3671e4b82fc6e12d1e4da848d5cf5e4c34dd1f8b4749fe16eb89128e97b915bb17', 'testuser@gmail.com', 0, '2024-05-01 19:25:32.534751', '2024-04-13 15:46:37.299571', 'TEST', 'USER', true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 49, true);


--
-- Name: event_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_category_id_seq', 5, true);


--
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 9, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_id_seq', 1, false);


--
-- Name: organizers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.organizers_id_seq', 2, true);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 2, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 127, true);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: event_category event_category_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_category
    ADD CONSTRAINT event_category_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: organizers organizers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organizers
    ADD CONSTRAINT organizers_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: bookings unique_booking_ref; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT unique_booking_ref UNIQUE (booking_ref);


--
-- Name: user_session user_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_pkey PRIMARY KEY (id);


--
-- Name: users username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT username_unique UNIQUE (username);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: events fk_category_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES public.event_category(id);


--
-- Name: media fk_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: bookings fk_event_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES public.events(id);


--
-- Name: events fk_organizer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT fk_organizer_id FOREIGN KEY (organizer_id) REFERENCES public.organizers(id);


--
-- Name: users fk_role_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: bookings fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_session user_session_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_session
    ADD CONSTRAINT user_session_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

