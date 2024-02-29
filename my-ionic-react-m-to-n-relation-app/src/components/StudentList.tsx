import React, { useState, useEffect } from "react";
import { useGetStudentsQuery } from "../redux/studentEndpoints";
import { Student, StudentCourseMapping } from "../redux/feTypes";

import "./StudentList.css";

type StudentListProps = {
  onStudentClick: (id: number, firstName: string, surName: string) => void;
  onHighestId: (id: number) => void;
};

const StudentList: React.FC<StudentListProps> = ({
  onStudentClick,
  onHighestId,
}) => {
  const { data: students, isLoading, isError, refetch } = useGetStudentsQuery();
  const [searchText, setSearchText] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (students) {
      if (searchText === '') {
        setFilteredStudents(students);
      } else {
        const searchLower = searchText.toLowerCase();
        const filtered = students.filter(student => {
          if (searchLower.startsWith('#')) {
            const exactId = searchLower.slice(1);
            return student.id.toString() === exactId;
          } else {
            return student.id.toString().includes(searchLower) ||
              student.firstName.toLowerCase().includes(searchLower) ||
              student.surName.toLowerCase().includes(searchLower);
          }
        });
        setFilteredStudents(filtered);
      }
    }
  }, [searchText, students]);

  useEffect(() => {
    if (students && students.length > 0) {
      const highestId = students.reduce(
        (max, student) => (student.id > max ? student.id : max),
        students[0].id
      );
      onHighestId(highestId);
    }
  }, [students, onHighestId]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by ID or Name..."
        value={searchText}
        onChange={handleSearchChange}
        style={{ width: '30%' }}
      />
      <ul>
        {isLoading && <p>Loading...</p>}
        {isError && <p>Error loading students.</p>}
        {filteredStudents.map((student: Student) => (
          <div
            key={student.id}
            className="student-item"
            onClick={() =>
              onStudentClick(student.id, student.firstName, student.surName)
            }
          >
            <h5>
              #{student.id} {student.firstName} {student.surName}
            </h5>
            <ul>
              {student.studentCourseMappings?.map(
                (mapping: StudentCourseMapping) => (
                  <li key={mapping.course?.id}>
                    {mapping.course?.subject} {mapping.course?.name}
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

export default StudentList;
