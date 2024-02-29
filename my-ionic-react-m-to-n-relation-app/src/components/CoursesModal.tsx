import { useState, useEffect } from "react";
import { IonSearchbar, IonLabel, IonCheckbox, IonGrid, IonRow, IonCol, IonToast, IonButton, IonModal } from "@ionic/react";
// From
// https://react-icons.github.io/react-icons/icons/fc/
import { FcCollaboration } from "react-icons/fc";
import { useGetCorsesQuery } from "../redux/courseEndpoints";
import { useAddStudentCourseMappingMutation, useGetStudentCourseMappingsQuery, useDeleteStudentCourseMappingMutation } from "../redux/studentCourseMappingEndpoints";
import { UpdateStudent, Course, StudentCourseMapping, NewStudentCourseMapping } from "../redux/feTypes";

import "./CoursesModal.css";

interface CoursesModalProps {
  showModalCourses: boolean;
  student: UpdateStudent;
  handleCloseCoursesModal: () => void;
  reloadStudentList: () => void;
}

const CoursesModal: React.FC<CoursesModalProps> = ({ showModalCourses, handleCloseCoursesModal, student, reloadStudentList }) => {
  const closeAndReload = () => {
    handleCloseCoursesModal();
    reloadStudentList();
  };

  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) refetchMappings();
  }, [isVisible]);

  // CRUD Functions
  // (C)REATE StudentCourseMapping
  const [addStudentCourseMapping, { isLoading: isAdding, error: addError }] = useAddStudentCourseMappingMutation();
  const handleAddStudentCourseMapping = async (studentId: number, courseId: number) => {
    console.log("handleAddStudentCourseMapping studentId: ", studentId);
    console.log("handleAddStudentCourseMapping corseId: ", courseId);
    try {
      const response = await addStudentCourseMapping({ studentId: studentId, courseId: courseId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // (R)EAD Courses
  const { data: courses, error: errorCourses, isLoading: isLoadingCourses } = useGetCorsesQuery();
  // (R)EAD StudentCourseMappings
  const { data: mappings, error: errorMappings, isLoading: isLoadingMappings, refetch: refetchMappings } = useGetStudentCourseMappingsQuery();

  // (D)ELETE StudentCourseMapping
  const [deleteStudentCourseMapping, { isLoading: isDeleting, error: deleteError }] = useDeleteStudentCourseMappingMutation();
  const handleDeleteStudentCourseMapping = async (studentId: number, courseId: number) => {
    try {
      const response = await deleteStudentCourseMapping({ studentId: studentId, courseId: courseId }).unwrap();
    } catch (error) {
      console.log(error);
    }
  };

  // Filter and Search
  // States for search text and filtered courses
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  // Update the filtered courses when the search text changes
  useEffect(() => {
    // Logic for filtering courses
    if (searchText === '') {
      setFilteredCourses(courses ?? []);
    } else {
      const searchLower = searchText.toLowerCase();
      const newFilteredCourses = (courses ?? []).filter(course => {
        // Check if the search starts with "#" for an exact ID match
        if (searchLower.startsWith('#')) {
          const exactId = searchLower.slice(1);
          return course.id.toString() === exactId;
        } else {
          // If the search does not start with "#", check if the ID contains the search string
          // or if the course name includes the search string
          return course.id.toString().includes(searchLower) ||
            course.name.toLowerCase().includes(searchLower);
        }
      });
      setFilteredCourses(newFilteredCourses);
    }
  }, [searchText, courses]);


  // Function to handle the change of the checkbox
  async function handleCourseChange(checked: boolean, courseId: number) {
    if (checked) {
      // Code to add the courseId and studentId to the studentCourseMapping table
      if (student.id && courseId) {
        const newStudentCourseMapping: NewStudentCourseMapping = { studentId: student.id, courseId: courseId };
        console.log("handleAddStudent newStudentData: ", newStudentCourseMapping);
        await handleAddStudentCourseMapping(student.id, courseId);
        refetchMappings();
      }
    } else {
      if (student.id && courseId) {
        const newStudentCourseMapping: NewStudentCourseMapping = { studentId: student.id, courseId: courseId };
        console.log("handleAddStudent newStudentData: ", newStudentCourseMapping);
        await handleDeleteStudentCourseMapping(student.id, courseId);
        refetchMappings();
      }
    }
  }

  async function unselectAllCourses(): Promise<void> {
    console.log("Unselecting all courses for student:", student.id);
    // Step 1: Determine the mappings to be deleted
    const studentMappings = mappings?.filter(mapping => mapping.studentId === student.id);
    // Step 2: Delete each mapping in the database
    if (studentMappings && studentMappings.length > 0) {
      try {
        const deletePromises = studentMappings.map(mapping =>
          deleteStudentCourseMapping({ studentId: student.id, courseId: mapping.courseId }).unwrap()
        );
        // Wait for all delete operations to complete
        await Promise.all(deletePromises);
        // Step 3: Update the state, e.g., by refetching the mappings
        refetchMappings();
        console.log("All course mappings for the student were successfully removed.");
      } catch (error) {
        console.error("Error removing course mappings:", error);
      }
    } else {
      console.log("No mappings found to remove.");
    }
  }

  async function selectAllCourses(): Promise<void> {
    console.log("Selecting all courses for student:", student.id);
    // Step 1: Determine the courses that are not already mapped to the student
    const unmappedCourses = courses?.filter(course => !mappings?.some(mapping => mapping.courseId === course.id && mapping.studentId === student.id));
    // Step 2: Add each course to the student in the database
    if (unmappedCourses && unmappedCourses.length > 0) {
      try {
        const addPromises = unmappedCourses.map(course =>
          addStudentCourseMapping({ studentId: student.id, courseId: course.id }).unwrap()
        );
        // Wait for all add operations to complete
        await Promise.all(addPromises);
        // Step 3: Update the state, e.g., by refetching the mappings
        refetchMappings();
        console.log("All courses were successfully added to the student.");
      } catch (error) {
        console.error("Error adding courses to the student:", error);
      }
    } else {
      console.log("No courses found to add.");
    }
  }

  // Error handling
  if (isLoadingCourses) {
    return <div>Loading...</div>;
  }

  if (errorCourses) {
    if ("message" in errorCourses) {
      return <div>Error: {errorCourses.message}</div>;
    } else {
      // handle other types of errors
      return <div>Error: {JSON.stringify(errorCourses)}</div>;
    }
  }

  return (
    <IonModal className="custom-modal-size" isOpen={showModalCourses} onDidDismiss={closeAndReload}>
      <div style={{ textAlign: "center", fontWeight: "bold", paddingTop: "20px", paddingBottom: "10px" }}>
        Courses assignment for Student Id #{student.id} Name: {student.firstName} {student.surName}
      </div>
      <div style={{ textAlign: "center", marginTop: "-30px" }}>
        <FcCollaboration style={{ paddingTop: "30px", paddingBottom: "30px" }} size={180} />
      </div>

      {/* Defining the main container with specific styles for alignment and overflow handling */}
      <div style={{ textAlign: "center", maxHeight: "400px", overflow: "auto", marginTop: "-30px" }}>
        {/* filter input */}
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => {
            const newSearchText = e.detail.value!;
            setSearchText(newSearchText);
          }}
          onIonClear={() => setSearchText('')}
          placeholder="Filter courses"
          style={{ textAlign: 'left' }}
        />
        <IonGrid style={{ textAlign: "center" }} fixed>
          <IonRow className="ion-row">
            {/* Mapping through the courses array and rendering each course. The `|| []` ensures that .map is called on an array even if courses is undefined */}
            {(filteredCourses || []).map((course) => {
              {/* Determine if the current course is assigned to the student */ }
              const isAssigned = mappings?.some((mapping) => mapping.studentId === student.id && mapping.courseId === course.id);

              return (
                // Each course is wrapped in a div with a unique key
                <div key={course.id}>
                  <IonCol className="ion-col1">
                    {/* Displaying the course ID */}
                    <div className="ion-text-nowrap">#{course.id}</div>
                  </IonCol>
                  <IonCol className="ion-col2">
                    {/* Displaying the course name */}
                    <div className="ion-text-nowrap">{course.name}</div>
                  </IonCol>
                  <IonCol className="ion-col4">
                    {/* Displaying a checkbox to select/deselect the course for the student */}
                    <div className="ion-text-nowrap" style={{ display: "flex", alignItems: "center" }}>
                      <IonCheckbox style={{ height: "20px" }} checked={isAssigned || false} onIonChange={(e) => handleCourseChange(e.detail.checked, course.id)} />
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
        <IonButton color={"dark"} onClick={unselectAllCourses}>
          Unselect All
        </IonButton>
        <IonButton color={"dark"} onClick={selectAllCourses}>
          Select All
        </IonButton>
        <IonButton color={"dark"} onClick={closeAndReload}>
          Close the Student assignment
        </IonButton>
      </div>

    </IonModal>
  );
};

export default CoursesModal;
