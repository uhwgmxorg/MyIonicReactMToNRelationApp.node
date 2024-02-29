--CREATE DATABASE mydb;
--CREATE USER m_to_n_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE mydb TO m_to_n_user;
CREATE SCHEMA IF NOT EXISTS m_to_n_dev;

-- set standard schema for user m_to_n_user:
ALTER USER m_to_n_user SET search_path = m_to_n_dev;
GRANT ALL PRIVILEGES ON DATABASE mydb TO m_to_n_user;
GRANT USAGE ON SCHEMA m_to_n_dev TO m_to_n_user;
GRANT SELECT ON ALL TABLES IN SCHEMA m_to_n_dev TO m_to_n_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA m_to_n_dev GRANT SELECT ON TABLES TO m_to_n_user;
ALTER ROLE m_to_n_user SUPERUSER CREATEDB CREATEROLE REPLICATION;
ALTER ROLE m_to_n_user IN DATABASE mydb SET search_path TO m_to_n_dev;

--DROP TABLE m_to_n_dev.student;
--DROP TABLE IF EXISTS m_to_n_dev.student;
CREATE TABLE m_to_n_dev.student (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  sur_name VARCHAR(50) NOT NULL
);

--DROP TABLE m_to_n_dev.course;
--DROP TABLE IF EXISTS m_to_n_dev.course;
CREATE TABLE m_to_n_dev.course (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(50) NOT NULL,
  name VARCHAR(200) NOT NULL
);

--DROP TABLE m_to_n_dev.student_course_mappings;
--DROP TABLE IF EXISTS m_to_n_dev.student_course_mappings;
CREATE TABLE m_to_n_dev.student_course_mappings (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES m_to_n_dev.student(id),
  FOREIGN KEY (course_id) REFERENCES m_to_n_dev.course(id)
);