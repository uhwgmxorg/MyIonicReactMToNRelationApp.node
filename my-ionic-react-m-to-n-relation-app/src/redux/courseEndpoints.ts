// src/redux/courseEndpoints.ts
import { Course, NewCourse, UpdateCourse } from "./feTypes";
import { baseApi } from "./baseApi";

export const courseEndpoints = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // (C)REATE Course
    addCourse: builder.mutation<Course, NewCourse>({
      query: (newCourse) => ({
        url: "/create_new_course",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Course", "StudentCourseMapping"],
    }),
    // (R)EAD Courses
    getCorses: builder.query<Course[], void>({
      query: () => "/get_all_courses_with_students",
      providesTags: ["Course", "StudentCourseMapping"],
    }),
    // (U)PDATE Course
    updateCourse: builder.mutation<Course, UpdateCourse>({
      query: (course) => ({
        url: `/update_course`,
        method: "PUT",
        body: course,
      }),
      invalidatesTags: ["Course", "StudentCourseMapping"],
    }),
    // (D)ELETE Course
    deleteCourse: builder.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/delete_course_by_id/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course", "StudentCourseMapping"],
    }),
  }),
  overrideExisting: false,
});

export const { useAddCourseMutation, useGetCorsesQuery, useUpdateCourseMutation, useDeleteCourseMutation } = courseEndpoints;
