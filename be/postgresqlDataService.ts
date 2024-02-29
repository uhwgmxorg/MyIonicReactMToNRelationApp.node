// postgresqlDataService.js
import { PrismaClient, Student, Course, StudentCourseMapping } from '@prisma/client';
import { NewStudentData, NewCourseData, NewStudentCourseMapping } from './api-types';

const prisma = new PrismaClient()
/****** student start ******/
async function postgresqlGetAllStudent(): Promise<Student[]> {
    const student = await prisma.student.findMany({
        orderBy: {
            id: 'asc', // or 'desc'
        },
    });
    return student;
}

async function postgresqlGetAllStudentsWithCourses(): Promise<Student[]> {
    const studentsWithCourses = await prisma.student.findMany({
        include: {
            studentCourseMappings: {
                select: {
                    course: {
                        select: {
                            id: true,
                            subject: true,
                            name: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            id: 'asc', // oder 'desc'
        },
    });
    return studentsWithCourses;
}

async function postgresqlCreateNewStudent(newStudentData: NewStudentData) {
    console.log("Creating new student:", newStudentData);
    try {
        const createdStudent = await prisma.student.create({
            data: newStudentData
        });
        console.log("New student created:", createdStudent);
        return createdStudent;
    } catch (error) {
        console.error("Error creating new student:", error);
        throw error;
    }
}

async function postgresqlUpdateStudent(id: number, updatedStudentData: NewStudentData) {
    console.log("Updating student with id:", id, "Data:", updatedStudentData);
    try {
        const updatedStudent = await prisma.student.update({
            where: {
                id: id
            },
            data: updatedStudentData
        });
        console.log("Student updated:", updatedStudent);
        return updatedStudent;
    } catch (error) {
        console.error("Error updating student:", error);
        throw error;
    }
}

async function postgresqlDeleteStudent(id: number) {
    console.log("Delete student id:", id);

    try {
        const deletedStudent = await prisma.student.delete({
            where: {
                id: id
            }
        });
        //console.log("Student deleted:", deletedStudent);
        return deletedStudent;
    } catch (error) {
        console.error("Error deleting student:", error);
        throw error;
    }
}
/****** student  end  ******/

/****** course start ******/
async function postgresqlGetCourse(): Promise<Course[]> {
    const student = await prisma.course.findMany({
        orderBy: {
            id: 'asc', // or 'desc'
        },
    });
    return student;
}

async function postgresqlGetCoursesWithStudents(): Promise<Course[]> {
    const coursesWithStudents = await prisma.course.findMany({
        include: {
            studentCourseMappings: {
                select: {
                    student: {
                        select: {
                            id: true,
                            firstName: true,
                            surName: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            id: 'asc', // oder 'desc'
        },
    });
    return coursesWithStudents;
}

async function postgresqlCreateNewCourse(newCourseData: NewCourseData) {
    console.log("Creating new course:", newCourseData);
    try {
        const createdCourse = await prisma.course.create({
            data: newCourseData
        });
        console.log("New course created:", createdCourse);
        return createdCourse;
    } catch (error) {
        console.error("Error creating new course:", error);
        throw error;
    }
}

async function postgresqlUpdateCourse(id: number, updatedCourseData: NewCourseData) {
    console.log("Updating course with id:", id, "Data:", updatedCourseData);
    try {
        const updatedCourse = await prisma.course.update({
            where: {
                id: id
            },
            data: updatedCourseData
        });
        console.log("Course updated:", updatedCourse);
        return updatedCourse;
    } catch (error) {
        console.error("Error updating course:", error);
        throw error;
    }
}

async function postgresqlDeleteCourse(id: number) {
    console.log("Deleting course with id:", id);

    try {
        const deletedCourse = await prisma.course.delete({
            where: {
                id: id
            }
        });
        console.log("Course deleted:", deletedCourse);
        return deletedCourse;
    } catch (error) {
        console.error("Error deleting course:", error);
        throw error;
    }
}
/****** course  end  ******/

/****** student_course_mappings start ******/
async function postgresqlGetAllStudentCourseMappings(): Promise<StudentCourseMapping[]> {
    const studentCourseMappings = await prisma.studentCourseMapping.findMany({
        orderBy: {
            id: 'asc', // or 'desc'
        },
    });
    return studentCourseMappings;
}

async function postgresqlCreateStudentCourseMapping(newStudentCourseMapping: NewStudentCourseMapping) {
    console.log("Creating new StudentCourseMapping:", newStudentCourseMapping);
    try {
        const createdStudentCourseMapping = await prisma.studentCourseMapping.create({
            data: newStudentCourseMapping
        });
        console.log("New student created:", createdStudentCourseMapping);
        return createdStudentCourseMapping;
    } catch (error) {
        console.error("Error creating new student:", error);
        throw error;
    }
}

async function postgresqlDeleteStudentCourseMapping(mapping: NewStudentCourseMapping) {
    console.log("Deleting StudentCourseMapping for studentId:", mapping.studentId, "and courseId:", mapping.courseId);
    try {
        const result = await prisma.studentCourseMapping.deleteMany({
            where: {
                studentId: mapping.studentId,
                courseId: mapping.courseId
            }
        });
        console.log("StudentCourseMapping deleted, count:", result.count);
        return result;
    } catch (error) {
        console.error("Error deleting StudentCourseMapping:", error);
        throw error;
    }
}
/****** student_course_mappings  end  ******/

export {
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
};