import React, { useState, useEffect } from "react";
import { useGetCorsesQuery } from "../redux/courseEndpoints";
import { Course, StudentCourseMapping } from "../redux/feTypes";

import "./CourseList.css";

type CourseListProps = {
  onCourseClick: (id: number, subject: string, name: string) => void;
  onHighestId: (id: number) => void;
};

const CourseList: React.FC<CourseListProps> = ({
  onCourseClick,
  onHighestId,
}) => {
  const { data: courses, isLoading, isError, refetch } = useGetCorsesQuery();
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (courses) {
      if (searchText === '') {
        setFilteredCourses(courses);
      } else {
        const searchLower = searchText.toLowerCase();
        const filtered = courses.filter(course => {
          if (searchLower.startsWith('#')) {
            const exactId = searchLower.slice(1);
            return course.id.toString() === exactId;
          } else {
            return course.id.toString().includes(searchLower) ||
              course.subject.toLowerCase().includes(searchLower) ||
              course.name.toLowerCase().includes(searchLower);
          }
        });
        setFilteredCourses(filtered);
      }
    }
  }, [searchText, courses]);

  useEffect(() => {
    if (courses && courses.length > 0) {
      const highestId = courses.reduce(
        (max, course) => (course.id > max ? course.id : max),
        courses[0].id
      );
      onHighestId(highestId);
    }
  }, [courses, onHighestId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by ID, Subject, or Name..."
        value={searchText}
        onChange={handleSearchChange}
        style={{ width: '40%' }}
      />
      <ul>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading courses.</p>}
        {filteredCourses.map((course: Course) => (
          <div
            key={course.id}
            className="course-item"
            onClick={() =>
              onCourseClick(course.id, course.subject, course.name)
            }
          >
            <h5>
              #{course.id} {course.subject} {course.name}
            </h5>
            <ul>
              {course.studentCourseMappings?.map(
                (mapping: StudentCourseMapping) => (
                  <li key={mapping.student?.id}>
                    {mapping.student?.firstName} {mapping.student?.surName}
                  </li>
                )
              )}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default CourseList;
