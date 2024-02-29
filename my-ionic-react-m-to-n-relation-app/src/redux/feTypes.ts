// feTypes.ts
export interface Student {
  id: number;
  firstName: string;
  surName: string;
  studentCourseMappings: StudentCourseMapping[];
}
export type NewStudent = Omit<Student, "id" | "studentCourseMappings">;
export type UpdateStudent = Omit<Student, "studentCourseMappings">;

export interface Course {
  id: number;
  subject: string;
  name: string;
  studentCourseMappings?: StudentCourseMapping[];
}
export type NewCourse = Omit<Course, "id" | "studentCourseMappings">;
export type UpdateCourse = Omit<Course, "studentCourseMappings">;

export interface StudentCourseMapping {
  id: number;
  studentId: number;
  courseId: number;
  student?: Student;
  course?: Course;
}
export type NewStudentCourseMapping = Omit<StudentCourseMapping, "id" | "student" | "course">;
