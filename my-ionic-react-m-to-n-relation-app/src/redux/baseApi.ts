// src/backend-api/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Make sure you start the environment variable with `REACT_APP_`.
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Student", "Course", "StudentCourseMapping"],
  endpoints: (builder) => ({}),
});

// Extract the type of `builder`
export type BuilderType = typeof baseApi.endpoints extends (builder: infer B) => any ? B : never;