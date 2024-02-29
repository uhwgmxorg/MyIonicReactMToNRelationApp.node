// src/redux/studentCourseMappingEndpoints.ts
import { StudentCourseMapping, NewStudentCourseMapping } from "./feTypes";
import { baseApi } from "./baseApi";

export const studentCourseMappingEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // (C)REATE StudentCourseMapping
    addStudentCourseMapping: builder.mutation<StudentCourseMapping, NewStudentCourseMapping>({
      query: (newStudentCourseMapping) => ({
        url: "/crate_student_course_mapping",
        method: "POST",
        body: newStudentCourseMapping,
      }),
      invalidatesTags: ["StudentCourseMapping"],
    }),
    // (R)EAD Students
    getStudentCourseMappings: builder.query<StudentCourseMapping[], void>({
      query: () => "/get_all_student_course_mappings",
      providesTags: ["StudentCourseMapping"],
    }),
    // (D)ELETE StudentCourseMapping
    deleteStudentCourseMapping: builder.mutation<{ message: string, count: number }, NewStudentCourseMapping>({
      query: (mapping) => ({
        url: `/delete_student_course_mapping`,
        method: "DELETE",
        body: mapping,
      }),
      invalidatesTags: ["StudentCourseMapping"],
    }),
  }),
});

export const {
  useAddStudentCourseMappingMutation,
  useGetStudentCourseMappingsQuery,
  useDeleteStudentCourseMappingMutation,
} = studentCourseMappingEndpoints;
