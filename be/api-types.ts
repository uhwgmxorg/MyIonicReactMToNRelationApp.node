import { Student, Course, StudentCourseMapping } from '@prisma/client';

export type NewStudentData = Omit<Student, 'id'>;
export type NewCourseData = Omit<Course, 'id'>;
export type NewStudentCourseMapping = Omit<StudentCourseMapping, 'id'>;