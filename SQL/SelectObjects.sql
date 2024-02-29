SELECT * FROM m_to_n_dev.student ORDER BY id;
SELECT * FROM m_to_n_dev.course ORDER BY id;
SELECT * FROM m_to_n_dev.student_course_mappings ORDER BY id;

-- get all course for a student
SELECT s.first_name, s.sur_name, c.id AS course_id, c.subject, c.name AS course_name
FROM m_to_n_dev.student s
JOIN m_to_n_dev.student_course_mappings scm ON s.id = scm.student_id
JOIN m_to_n_dev.course c ON scm.course_id = c.id
WHERE s.id = 2;

-- get all students of a course
SELECT c.subject, c.name AS course_name, s.id AS student_id, s.first_name, s.sur_name
FROM m_to_n_dev.course c
JOIN m_to_n_dev.student_course_mappings scm ON c.id = scm.course_id
JOIN m_to_n_dev.student s ON scm.student_id = s.id
WHERE c.id = 1;

