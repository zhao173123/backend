-- Table: public.users

DROP TABLE public.t_users;

CREATE TABLE public.t_users
(
  userid      SERIAL       NOT NULL PRIMARY KEY,
  username    TEXT,
  nickname    TEXT,
  email       TEXT,
  password    TEXT,
  title       INTEGER               DEFAULT 0,
  update_time TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  create_time TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
)
WITH (
OIDS = FALSE
);

COMMENT ON TABLE public.t_users IS '系统用户';
COMMENT ON COLUMN t_users.username IS '用户名';
COMMENT ON COLUMN t_users.nickname IS '显示名';
COMMENT ON COLUMN t_users.title IS '用户头衔：总监1 主管2 专员4';

ALTER TABLE public.t_users
  OWNER TO postgres;

INSERT INTO public.t_users
(
  username,
  nickname,
  email,
  password,
  title,
  update_time,
  create_time)
VALUES
  (
    'leo',
    '资良',
    'leo@vipabc.com',
    'leo',
    1,
    (now() - '1 year ' :: INTERVAL),
    (now() - '1 year ' :: INTERVAL)
  );

INSERT INTO public.t_users
(
  username,
  nickname,
  email,
  password,
  title,
  update_time,
  create_time)
VALUES
  (
    'june',
    'jj',
    'june@vipabc.com',
    'june',
    2,
    (now() - '1 year ' :: INTERVAL),
    (now() - '1 year ' :: INTERVAL)
  );

INSERT INTO public.t_users
(
  username,
  nickname,
  email,
  password,
  title,
  update_time,
  create_time)
VALUES
  (
    'agent1',
    'agent1',
    'june@vipabc.com',
    '1',
    4,
    (now() - '1 year ' :: INTERVAL),
    (now() - '1 year ' :: INTERVAL)
  );