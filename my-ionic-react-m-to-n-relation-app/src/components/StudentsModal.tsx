import { useState, useEffect } from "react";
import { IonSearchbar, IonLabel, IonCheckbox, IonGrid, IonRow, IonCol, IonModal, IonButton } from "@ionic/react";
// From
// https://react-icons.github.io/react-icons/icons/fc/
import { FcButtingIn } from "react-icons/fc";
import { useGetStudentsQuery } from "../redux/studentEndpoints";
import { useAddStudentCourseMappingMutation, useGetStudentCourseMappingsQuery, useDeleteStudentCourseMappingMutation } from "../redux/studentCourseMappingEndpoints";
import { UpdateCourse, Student, StudentCourseMapping, NewStudentCourseMapping } from "../redux/feTypes";

import "./StudentsModal.css";

interface StudentsModalProps {
  showModalStudents: boolean;
  course: UpdateCourse;
  handleCloseStudentsModal: () => void;
  reloadCourseList: () => void;
}

const StudentsModal: React.FC<StudentsModalProps> = ({ showModalStudents, handleCloseStudentsModal, course, reloadCourseList }) => {
  const closeAndReload = () => {
    handleCloseStudentsModal();
    reloadCourseList();
  };
  const [selectedStudent, setSelectedStudent] = useState<NewStudentCourseMapping[]>([]);

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) refetchMappings();
  }, [isVisible]);

  // CRUD Functions
  const [addCourseStudentMapping, { isLoading: isAdding, error: addError }] = useAddStudentCourseMappingMutation();
  const handleAddCourseStudentMapping = async (courseId: number, studentId: number) => {
    try {
      const response = await addCourseStudentMapping({ courseId: courseId, studentId: studentId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  const { data: students, error: errorStudents, isLoading: isLoadingStudents } = useGetStudentsQuery();
  const { data: mappings, error: errorMappings, isLoading: isLoadingMappings, refetch: refetchMappings } = useGetStudentCourseMappingsQuery();

  const [deleteCourseStudentMapping, { isLoading: isDeleting, error: deleteError }] = useDeleteStudentCourseMappingMutation();
  const handleDeleteCourseStudentMapping = async (courseId: number, studentId: number) => {
    try {
      const response = await deleteCourseStudentMapping({ courseId: courseId, studentId: studentId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter and Search
  // States for search text and filtered students
  const [searchText, setSearchText] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  // Update the filtered students when the search text changes
  useEffect(() => {
    // Logic for filtering students
    if (searchText === '') {
      setFilteredStudents(students ?? []);
    } else {
      const searchLower = searchText.toLowerCase();
      const newFilteredStudents = (students ?? []).filter(student => {
        // Check if the search starts with "#" for an exact ID match
        if (searchLower.startsWith('#')) {
          const exactId = searchLower.slice(1);
          return student.id.toString() === exactId;
        } else {
          // If the search does not start with "#", check if the ID contains the search string
          // or if the first name or last name includes the search string
          return student.id.toString().includes(searchLower) ||
                 student.firstName.toLowerCase().includes(searchLower) ||
                 student.surName.toLowerCase().includes(searchLower);
        }
      });
      setFilteredStudents(newFilteredStudents);
    }
  }, [searchText, students]);



  async function handleStudentChange(checked: boolean, studentId: number) {
    if (checked) {
      if (course.id && studentId) {
        await handleAddCourseStudentMapping(course.id, studentId);
        refetchMappings();
      }
    } else {
      if (course.id && studentId) {
        await handleDeleteCourseStudentMapping(course.id, studentId);
        refetchMappings();
      }
    }
  }

  async function unselectAllStudents(): Promise<void> {
    console.log("Unselecting all students for course:", course.id);
    // Step 1: Determine the mappings to be deleted
    const courseMappings = mappings?.filter(mapping => mapping.courseId === course.id);
    // Step 2: Delete each mapping in the database
    if (courseMappings && courseMappings.length > 0) {
      try {
        const deletePromises = courseMappings.map(mapping =>
          deleteCourseStudentMapping({ courseId: course.id, studentId: mapping.studentId }).unwrap()
        );
        // Wait for all delete operations to complete
        await Promise.all(deletePromises);
        // Step 3: Update the state, e.g., by refetching the mappings
        refetchMappings();
        console.log("All student mappings for the course were successfully removed.");
      } catch (error) {
        console.error("Error removing student mappings:", error);
      }
    } else {
      console.log("No mappings found to remove.");
    }
  }

  async function selectAllStudents(): Promise<void> {
    console.log("Selecting all students for course:", course.id);
    // Step 1: Determine the students that are not already mapped to the course
    const unmappedStudents = students?.filter(student => !mappings?.some(mapping => mapping.studentId === student.id && mapping.courseId === course.id));
    // Step 2: Add each student to the course in the database
    if (unmappedStudents && unmappedStudents.length > 0) {
      try {
        const addPromises = unmappedStudents.map(student =>
          addCourseStudentMapping({ courseId: course.id, studentId: student.id }).unwrap()
        );
        // Wait for all add operations to complete
        await Promise.all(addPromises);
        // Step 3: Update the state, e.g., by refetching the mappings
        refetchMappings();
        console.log("All students were successfully added to the course.");
      } catch (error) {
        console.error("Error adding students to the course:", error);
      }
    } else {
      console.log("No students found to add.");
    }
  }

  if (isLoadingStudents) {
    return <div>Loading...</div>;
  }

  if (errorStudents) {
    if ("message" in errorStudents) {
      return <div>Error: {errorStudents.message}</div>;
    } else {
      return <div>Error: {JSON.stringify(errorStudents)}</div>;
    }
  }

  return (
    <IonModal className="custom-modal-size" isOpen={showModalStudents} onDidDismiss={closeAndReload}>
      <div style={{ textAlign: "center", fontWeight: "bold", paddingTop: "20px", paddingBottom: "10px" }}>
        Student assignment for Course Id #{course.id} Name: {course.name}
      </div>
      <div style={{ textAlign: "center", marginTop: "-30px" }}>
        <FcButtingIn style={{ paddingTop: "30px", paddingBottom: "30px" }} size={180} />
      </div>

      <div style={{ textAlign: "center", maxHeight: "400px", overflow: "auto", marginTop: "-30px" }}>
        {/* Filter input */}
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => {
            const newSearchText = e.detail.value!;
            setSearchText(newSearchText);
          }}
          onIonClear={() => setSearchText('')}
          placeholder="Search for students"
          style={{ textAlign: 'left' }}
        />

        <IonGrid style={{ textAlign: "center" }} fixed>
          <IonRow className="ion-row">
            {(filteredStudents || []).map((student) => {
              const isAssigned = mappings?.some((mapping) => mapping.courseId === course.id && mapping.studentId === student.id);

              return (
                <div key={student.id}>
                  <IonCol className="ion-col1">
                    <div className="ion-text-nowrap">#{student.id}</div>
                  </IonCol>
                  <IonCol className="ion-col2">
                    <div className="ion-text-nowrap">{student.firstName} {student.surName}</div>
                  </IonCol>
                  <IonCol className="ion-col4">
                    <div className="ion-text-nowrap" style={{ display: "flex", alignItems: "center" }}>
                      <IonCheckbox style={{ height: "20px" }} checked={isAssigned || false} onIonChange={(e) => handleStudentChange(e.detail.checked, student.id)} />
                      <IonLabel style={{ marginLeft: "10px" }}>Select</IonLabel>
                    </div>
                  </IonCol>
                </div>
              );
            })}
          </IonRow>
        </IonGrid>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "1px", paddingBottom: "2px" }}>
        <IonButton color={"dark"} onClick={unselectAllStudents}>
          Unselect All
        </IonButton>
        <IonButton color={"dark"} onClick={selectAllStudents}>
          Select All
        </IonButton>
        <IonButton color={"dark"} onClick={closeAndReload}>
          Close the Student assignment
        </IonButton>
      </div>

    </IonModal>
  );
};

export default StudentsModal;
