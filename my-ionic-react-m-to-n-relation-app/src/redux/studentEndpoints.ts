// src/redux/studentEndpoints.ts
import { Student, NewStudent, UpdateStudent } from "./feTypes";
import { baseApi } from "./baseApi";

export const studentEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // (C)REATE Student
    addStudent: builder.mutation<Student, NewStudent>({
      query: (newStudent) => ({
        url: "/crate_new_student",
        method: "POST",
        body: newStudent,
      }),
      invalidatesTags: ["Student", "StudentCourseMapping"],
    }),
    // (R)EAD Students
    getStudents: builder.query<Student[], void>({
      query: () => "/get_all_students_with_courses",
      providesTags: ["Student", "StudentCourseMapping"],
    }),
    // (U)PDATE Student
    updateStudent: builder.mutation<Student, UpdateStudent>({
      query: (student) => ({
        url: `/update_student`,
        method: "PUT",
        body: student,
      }),
      invalidatesTags: ["Student", "StudentCourseMapping"],
    }),
    // (D)ELETE Student
    deleteStudent: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/delete_student_by_id/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Student", "StudentCourseMapping"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useAddStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
} = studentEndpoints;
