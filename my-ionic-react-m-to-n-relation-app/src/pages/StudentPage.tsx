import React, { useState } from "react";
import { IonCheckbox, IonToast, IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import GetVersion from "../components/GetVersion";
import StudentList from "../components/StudentList";
import CoursesModal from "../components/CoursesModal";
import { UpdateStudent } from "../redux/feTypes";

import { useGetStudentsQuery, useAddStudentMutation, useUpdateStudentMutation, useDeleteStudentMutation } from "../redux/studentEndpoints";

import "./StudentPage.css";

var toastMessage: string = "An error occurred";

function randomFirstName(): string {
  const firstNames = ["Liam", "Ella", "Jacob", "Sophie", "Mason", "Mia", "Lucas", "Amelia", "Aiden", "Charlotte"];
  return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function randomSurName(): string {
  const surNames = ["Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez"];
  return surNames[Math.floor(Math.random() * surNames.length)];
}

const StudentPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  const [id, setId] = useState(0);
  const [highestId, setHighestId] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [surName, setSurName] = useState("");

  const [showToastDeleteSuccess, setShowToastDeleteSuccess] = useState(false);
  const [showToastDeleteError, setShowToastDeleteError] = useState(false);
  const [showToastDeleteCriticalError, setShowToastDeleteCriticalError] = useState(false);
  const [showToastUpdateSuccess, setShowToastUpdateSuccess] = useState(false);
  const [showToastUpdateError, setShowToastUpdateError] = useState(false);
  const [showToastUpdateCriticalError, setShowToastUpdateCriticalError] = useState(false);
  const [showToastInsertSuccess, setShowToastInsertSuccess] = useState(false);
  const [showToastInsertError, setShowToastInsertError] = useState(false);
  const [showToastInsertCriticalError, setShowToastInsertCriticalError] = useState(false);

  const [showButtons, setShowButtons] = useState(false);

  const [showModalCourses, setShowModalCourses] = useState(false);
  const [student, setStudent] = useState<UpdateStudent | null>(null);

  // CRUD Functions
  // (C)REATE Student
  const [addStudent, { isLoading: isAdding, error: addError }] = useAddStudentMutation();
  const handleCreateStudent = async () => {
    if (firstName === "" || surName === "") {
      toastMessage = "An error occurred creating a student. First Name and Surname must be filled out";
      setShowToastInsertCriticalError(true);
      return;
    }
    console.log("handleCreateStudent firstName: ", firstName);
    console.log("handleCreateStudent surName: ", surName);
    try {
      const response = await addStudent({
        firstName: firstName,
        surName: surName,
      }).unwrap();
      toastMessage = "Student created successfully";
      setShowToastInsertSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred creating a student";
      setShowToastInsertError(true);
      console.log(toastMessage, error);
    }
  };

  // (R)EAD Students
  const { refetch } = useGetStudentsQuery();
  const reloadStudentList = () => {
    refetch();
  };

  // (U)PDATE Student
  const [updateStudent, { isLoading: isUpdating, error: updateError }] = useUpdateStudentMutation();
  const handleUpdateStudent = async () => {
    if (id === 0) {
      toastMessage = "An error occurred while updating a student. id must be greater than 0";
      setShowToastUpdateCriticalError(true);
      return;
    }
    console.log("handleUpdateStudent id: ", id);
    console.log("handleUpdateStudent firstName: ", firstName);
    console.log("handleUpdateStudent surName: ", surName);
    try {
      const response = await updateStudent({
        id: id,
        firstName: firstName,
        surName: surName,
      }).unwrap();
      toastMessage = "Student updated successfully";
      setShowToastUpdateSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while updating a student";
      setShowToastUpdateError(true);
      console.log(toastMessage, error);
    }
  };

  // (D)ELETE Student
  const [deleteStudent, { isLoading: isDeleting, error: deleteError }] = useDeleteStudentMutation();
  const handleDeleteStudent = async () => {
    if (id === 0) {
      toastMessage = "An error occurred while deleting a student. id must be greater than 0";
      setShowToastDeleteCriticalError(true);
      return;
    }
    console.log("handleDeleteStudent id: ", id);
    try {
      const response = await deleteStudent({ id: id }).unwrap();
      toastMessage = "Student deleted successfully";
      setShowToastDeleteSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while deleting a student";
      setShowToastDeleteError(true);
      console.log(toastMessage, error);
    }
  };
  const handleDeleteLatestStudent = async () => {
    console.log("handleDeleteLatestStudent id: ", highestId);
    try {
      const response = await deleteStudent({ id: highestId }).unwrap();
      toastMessage = "Latest student deleted successfully";
      setShowToastDeleteSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while deleting the latest student";
      setShowToastDeleteError(true);
      console.log(toastMessage, error);
    }
  };

  // Helper Functions
  const handleCreateRandomStudent = async () => {
    console.log("handleCreateRandomStudent");
    try {
      const response = await addStudent({
        firstName: randomFirstName(),
        surName: randomSurName(),
      }).unwrap();
      toastMessage = "Random student created successfully";
      setShowToastInsertSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred creating a random student";
      setShowToastInsertError(true);
      console.log(toastMessage, error);
    }
  };

  const handleStudentClick = (id: number, firstName: string, surName: string) => {
    setId(id);
    setFirstName(firstName);
    setSurName(surName);
  };

  const handleHighestId = (id: number) => {
    setHighestId(id);
  };

  const handleAssignCourse = () => {
    if (id === 0) {
      toastMessage = "An error occurred assign a student. id must be greater than 0";
      setShowToastInsertCriticalError(true);
      return;
    }
    setStudent({ id: id, firstName: firstName, surName: surName });
    setShowModalCourses(true);
  };

  function handleCloseCoursesModal(): void {
    setShowModalCourses(false);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <GetVersion />
          <IonButtons slot="end">
            {showButtons && <IonButton onClick={handleCreateRandomStudent}>Add Random Student</IonButton>}
            {showButtons && <IonButton onClick={handleDeleteLatestStudent}>Delete Latest Student</IonButton>}
            <IonButton onClick={reloadStudentList}>Reload</IonButton>
            <div className="checkbox-flex-container">
              <IonCheckbox className="checkbox" checked={showButtons} onIonChange={(e) => setShowButtons(e.detail.checked)} />
              <label className="checkbox-label">Buttons on/off</label>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <div>
        <h6 className="my-text-headline-style">Students</h6>
      </div>
      <div className="input-group">
        <div>
          <div className="label-input">
            <label htmlFor="id">Id</label>
            <input style={{ width: '70px' }} className="input-field-number" type="number" id="id" value={id} onChange={(e) => setId(Number(e.target.value))} placeholder="id" />
          </div>
          <div className="label-input">
            <label htmlFor="firstName">Name</label>
            <input className="input-field-text" type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
          </div>
          <div className="label-input">
            <label htmlFor="surName">Surname</label>
            <input className="input-field-text" type="text" id="surName" value={surName} onChange={(e) => setSurName(e.target.value)} placeholder="Surname" />
          </div>
        </div>
        <div>
          <div>
            <IonButton disabled={false} className="my-button-style" onClick={handleCreateStudent}>
              Create Student
            </IonButton>
            <IonButton disabled={false} className="my-button-style" onClick={handleUpdateStudent}>
              Update Student
            </IonButton>
          </div>
          <div>
            <IonButton disabled={false} className="my-button-style" onClick={handleDeleteStudent}>
              Delete
            </IonButton>
            <IonButton disabled={false} className="my-button-style" onClick={handleAssignCourse}>
              Assign Course
            </IonButton>
            {showModalCourses && student && (
              <CoursesModal showModalCourses={showModalCourses} student={student} handleCloseCoursesModal={handleCloseCoursesModal} reloadStudentList={reloadStudentList} />
            )}
          </div>
        </div>
      </div>
      <hr className="custom-divider" />

      <IonContent className="ion-padding">
        <div>
          <StudentList onStudentClick={handleStudentClick} onHighestId={handleHighestId} />
        </div>
      </IonContent>

      <IonToast isOpen={showToastInsertSuccess} onDidDismiss={() => setShowToastInsertSuccess(false)} message={toastMessage} duration={3000} color="success" />
      <IonToast isOpen={showToastInsertError} onDidDismiss={() => setShowToastInsertError(false)} message={toastMessage} duration={3000} color="medium" />
      <IonToast isOpen={showToastInsertCriticalError} onDidDismiss={() => setShowToastInsertCriticalError(false)} message={toastMessage} duration={3000} color="danger" />
      <IonToast isOpen={showToastUpdateSuccess} onDidDismiss={() => setShowToastUpdateSuccess(false)} message={toastMessage} duration={3000} color="success" />
      <IonToast isOpen={showToastUpdateError} onDidDismiss={() => setShowToastUpdateError(false)} message={toastMessage} duration={3000} color="medium" />
      <IonToast isOpen={showToastUpdateCriticalError} onDidDismiss={() => setShowToastUpdateCriticalError(false)} message={toastMessage} duration={3000} color="danger" />
      <IonToast isOpen={showToastDeleteSuccess} onDidDismiss={() => setShowToastDeleteSuccess(false)} message={toastMessage} duration={3000} color="success" />
      <IonToast isOpen={showToastDeleteError} onDidDismiss={() => setShowToastDeleteError(false)} message={toastMessage} duration={3000} color="medium" />
      <IonToast isOpen={showToastDeleteCriticalError} onDidDismiss={() => setShowToastDeleteCriticalError(false)} message={toastMessage} duration={3000} color="danger" />
    </IonPage>
  );
};

export default StudentPage;
