--DROP DATABASE m_to_n_devicesdb;

DELETE FROM m_to_n_dev.student_course_mappings WHERE id > 5;
DELETE FROM m_to_n_dev.student WHERE id > 5;
DELETE FROM m_to_n_dev.course WHERE id > 5;

DELETE FROM m_to_n_dev.student_course_mappings;
DELETE FROM m_to_n_dev.course;
DELETE FROM m_to_n_dev.student;

DROP TABLE IF EXISTS m_to_n_dev.student_course_mappings;
DROP TABLE IF EXISTS m_to_n_dev.course;
DROP TABLE IF EXISTS m_to_n_dev.student;
