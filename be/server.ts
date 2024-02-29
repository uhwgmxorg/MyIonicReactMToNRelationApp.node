// npx prisma db pull
// npx prisma generate
import { PrismaClient, Student, Course } from '@prisma/client';
import { NewStudentData, NewCourseData, NewStudentCourseMapping } from './api-types';

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Request, Response } from "express";

import config from "./config";

const PORT = config.port || 3000;
const server = express();
server.use(bodyParser.json());

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

import {
    postgresqlGetAllStudent,
    postgresqlGetAllStudentsWithCourses,
    postgresqlCreateNewStudent,
    postgresqlUpdateStudent,
    postgresqlDeleteStudent,
    postgresqlGetCourse,
    postgresqlGetCoursesWithStudents,
    postgresqlCreateNewCourse,
    postgresqlUpdateCourse,
    postgresqlDeleteCourse,
    postgresqlGetAllStudentCourseMappings,
    postgresqlCreateStudentCourseMapping,
    postgresqlDeleteStudentCourseMapping,
} from "./postgresqlDataService";

let dataSource = config.dataSource;

const prisma = new PrismaClient();

/*******************************************************************************/
/*** Important note on Windows use curl command in CMD NOT in the PowerShell ***/
/*******************************************************************************/
/*********************/
/****** Student ******/
/*********************/
// GET: Get all students
// curl -X GET -H "Content-Type: application/json" -d "" http://localhost:3000/api/get_all_students
server.get('/api/get_all_students', async (req: Request, res: Response) => {
    try {
        var students: Student[];
        students = await postgresqlGetAllStudent();
        res.json(students);
        //console.log("get get_all_student was called ", students);
        console.log("get get_all_student was called ");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// GET: Get all students with courses
// curl -X GET -H "Content-Type: application/json" -d "" http://localhost:3000/api/get_all_students_with_courses
server.get('/api/get_all_students_with_courses', async (req: Request, res: Response) => {
    try {
        var students;
        students = await postgresqlGetAllStudentsWithCourses();
        res.json(students);
        //console.log("get get_all_student_with_courses was called ", students);
        console.log("get get_all_student_with_courses was called ");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// POST: crate a new student 
// curl -X POST -H "Content-Type: application/json" -d "{\"firstName\": \"new student firstName\", \"surName\": \"new student surName\"}" http://localhost:3000/api/crate_new_student
server.post('/api/crate_new_student', async (req: Request, res: Response) => {
    try {
        const { firstName, surName } = req.body;
        const newStudent: NewStudentData = {
            firstName,
            surName
        };
        console.log("crate_new_student was called", newStudent);
        await postgresqlCreateNewStudent(newStudent);
        res.status(201).json({ message: 'New student created', student: newStudent });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// PUT: Update an existing student
// curl example:
// curl -X PUT -H "Content-Type: application/json" -d "{\"id\": 1, \"firstName\": \"updated firstName\", \"surName\": \"updated surName\"}" http://localhost:3000/api/update_student
server.put('/api/update_student', async (req: Request, res: Response) => {
    try {
        const { id, firstName, surName } = req.body;
        if (!id) {
            res.status(400).json({ message: 'Student ID is required' });
            return;
        }
        const updatedStudentData: NewStudentData = {
            firstName,
            surName
        };
        console.log("update_student was called", { id, ...updatedStudentData });
        const updatedStudent = await postgresqlUpdateStudent(id, updatedStudentData);
        if (updatedStudent) {
            res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
        } else {
            res.status(404).json({ message: 'No student found with the given ID' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// DELETE: Delete existing student by id
// curl -X DELETE http://localhost:3000/api/delete_student_by_id/1
server.delete('/api/delete_student_by_id/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await postgresqlDeleteStudent(id);
        console.log("dielete_student_by_id was called", id);
        res.status(200).json({ message: 'Student successfully deleted' });
    } catch (error) {
        if (error instanceof Error) {
            // Check for foreign key violation
            if (error.message.includes('Foreign key constraint failed')) {
                res.status(400).json({ message: 'Cannot delete student due to foreign key constraint' });
            }
            // Check whether the record to be deleted does not exist
            else if (error.message.includes('Record to delete does not exist')) {
                res.status(404).json({ message: 'Student not found' });
            }
            else {
                console.error('An unknown error has occurred:', error);
                res.status(500).json({ message: 'An unknown error has occurred' });
            }
        } else {
            console.error('A non-standard error has occurred:', error);
            res.status(500).json({ message: 'A non-standard error has occurred' });
        }
    }
});
/*********************/
/****** Student ******/
/*********************/

/*********************/
/****** Course  ******/
/*********************/
// GET: Get all course
// curl -X GET -H "Content-Type: application/json" -d "" http://localhost:3000/api/get_all_courses
server.get('/api/get_all_courses', async (req: Request, res: Response) => {
    try {
        var courses;
        courses = await postgresqlGetCourse();
        res.json(courses);
        //console.log("get_all_course was called ", courses);
        console.log("get_all_course was called ");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// GET: Get all course with students
// curl -X GET -H "Content-Type: application/json" -d "" http://localhost:3000/api/get_all_courses_with_students
server.get('/api/get_all_courses_with_students', async (req: Request, res: Response) => {
    try {
        var courses;
        courses = await postgresqlGetCoursesWithStudents();
        res.json(courses);
        //console.log("get_all_courses_with_students was called ", courses);
        console.log("get_all_courses_with_students was called ");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// POST: Create a new course
// curl -X POST -H "Content-Type: application/json" -d "{\"subject\": \"Course Subject\", \"name\": \"Course Name\"}" http://localhost:3000/api/create_new_course
server.post('/api/create_new_course', async (req: Request, res: Response) => {
    try {
        const { subject, name } = req.body;
        const newCourse: NewCourseData = {
            subject,
            name
        };
        console.log("create_new_course was called", newCourse);
        await postgresqlCreateNewCourse(newCourse);
        res.status(201).json({ message: 'New course created', course: newCourse });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// PUT: Update an existing course
// curl example:
// curl -X PUT -H "Content-Type: application/json" -d "{\"id\": 1, \"subject\": \"Updated Subject\", \"name\": \"Updated Name\"}" http://localhost:3000/api/update_course
server.put('/api/update_course', async (req: Request, res: Response) => {
    try {
        const { id, subject, name } = req.body;
        if (!id) {
            res.status(400).json({ message: 'Course ID is required' });
            return;
        }
        const updatedCourseData: NewCourseData = {
            subject,
            name
        };
        const updatedCourse = await postgresqlUpdateCourse(id, updatedCourseData);
        console.log("update_course was called", { id, ...updatedCourseData });
        if (updatedCourse) {
            res.status(200).json({ message: 'Student updated successfully', student: updatedCourse });
        } else {
            res.status(404).json({ message: 'No student found with the given ID' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// DELETE: Delete existing course by id
// curl -X DELETE http://localhost:3000/api/delete_course_by_id/1
server.delete('/api/delete_course_by_id/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await postgresqlDeleteCourse(id);
        console.log("delete_course_by_id was called", id);
        res.status(200).json({ message: 'Course successfully deleted' });
    } catch (error) {
        if (error instanceof Error) {
            // Check for foreign key violation
            if (error.message.includes('Foreign key constraint failed')) {
                res.status(400).json({ message: 'Cannot delete course due to foreign key constraint' });
            }
            // Check whether the record to be deleted does not exist
            else if (error.message.includes('Record to delete does not exist')) {
                res.status(404).json({ message: 'Course not found' });
            }
            else {
                console.error('An unknown error has occurred:', error);
                res.status(500).json({ message: 'An unknown error has occurred' });
            }
        } else {
            console.error('A non-standard error has occurred:', error);
            res.status(500).json({ message: 'A non-standard error has occurred' });
        }
    }
});
/*********************/
/****** Course  ******/
/*********************/

/***********************************/
/****** StudentCourseMapping  ******/
/***********************************/
// GET: Get all Student Course Mappings
// curl -X GET -H "Content-Type: application/json" -d "" http://localhost:3000/api/get_all_student_course_mappings
server.get('/api/get_all_student_course_mappings', async (req: Request, res: Response) => {
    try {
        var studentCourseMappings;
        studentCourseMappings = await postgresqlGetAllStudentCourseMappings();
        res.json(studentCourseMappings);
        //console.log("get_all_student_course_mappings was called", studentCourseMappings);
        console.log("get_all_student_course_mappings was called");
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// POST: Create Student Course Mapping
// curl example:
// curl -X POST -H "Content-Type: application/json" -d "{\"studentId\": 1, \"courseId\": 5}" http://localhost:3000/api/crate_student_course_mapping
server.post('/api/crate_student_course_mapping', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const newStudentCourseMapping: NewStudentCourseMapping = {
            studentId,
            courseId
        };
        console.log("crate_student_course_mapping was called ", newStudentCourseMapping);
        await postgresqlCreateStudentCourseMapping(newStudentCourseMapping);
        res.status(201).json({ message: 'New student course mapping created', mapping: newStudentCourseMapping });
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});

// DELETE: Delete Student Course Mapping
// curl example:
// curl -X DELETE -H "Content-Type: application/json" -d "{\"studentId\": 1, \"courseId\": 5}" http://localhost:3000/api/delete_student_course_mapping
server.delete('/api/delete_student_course_mapping', async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const mappingToDelete: NewStudentCourseMapping = {
            studentId,
            courseId
        };
        console.log("delete_student_course_mapping was called ", mappingToDelete);
        const result = await postgresqlDeleteStudentCourseMapping(mappingToDelete);
        if (result.count > 0) {
            res.status(200).json({ message: 'Student course mapping deleted', count: result.count });
        } else {
            res.status(404).json({ message: 'No student course mapping found to delete' });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: 'Internal server error', error: error.message });
        } else {
            console.error('An unknown error has occurred');
            res.status(500).json({ message: 'An unknown error has occurred' });
        }
    }
});
/***********************************/
/****** StudentCourseMapping  ******/
/***********************************/

server.listen(PORT, () => console.log(`Student Course Backend version 0.0.0 listening on port ${PORT} with postgresql data source`));

