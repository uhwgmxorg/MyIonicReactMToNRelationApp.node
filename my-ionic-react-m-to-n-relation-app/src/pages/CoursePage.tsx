import { IonCheckbox, IonButton, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToast, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import GetVersion from "../components/GetVersion";
import CourseList from "../components/CourseList";
import StudentsModal from "../components/StudentsModal";
import { UpdateCourse } from "../redux/feTypes";

import { useGetCorsesQuery, useAddCourseMutation, useUpdateCourseMutation, useDeleteCourseMutation } from "../redux/courseEndpoints";

import React, { useState } from "react";

import "./CoursePage.css";

var toastMessage: string = "An error occurred";

function randomSubject(): string {
  const subject = ["Chemical Engineering", "Electrical Engineering", "Medicine", "Literature", "Biology", "Mechanical Engineering", "Electrical Engineering", "Physics", "Electrical Engineering", "Medicine",];
  return subject[Math.floor(Math.random() * subject.length)];
}

function randomName(): string {
  const names = ["Process operations – reactors, separators, biotechnology", "Principles of Chemical Engineering", "The Future of Electrical Engineering", "The Essence of Medicine", "Applications of Literature", "Advanced Biology", "The World of Mechanical Engineering", "Fundamentals of Electrical Engineering", "Introduction to Physics", "Introduction to Electrical Engineering",];
  return names[Math.floor(Math.random() * names.length)];
}

const CoursePage: React.FC = () => {
  const [id, setId] = useState(0);
  const [highestId, setHighestId] = useState(0);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");

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

  const [showModalStudents, setShowModalStudents] = useState(false);
  const [course, setCourse] = useState<UpdateCourse | null>(null);
  
  // CRUD Functions
  // (C)REATE Course
  const [addCourse, { isLoading: isAdding, error: addError }] = useAddCourseMutation();
  const handleCreateCourse = async () => {
    if (subject === "" || name === "") {
      toastMessage = "An error occurred creating a student. First Subject and Name must be filled out";
      setShowToastInsertCriticalError(true);
      return;
    }
    console.log("handleCreateStudent subject: ", subject);
    console.log("handleCreateStudent name: ", name);
    try {
      const response = await addCourse({
        subject: subject,
        name: name,
      }).unwrap();
      toastMessage = "Courses created successfully";
      setShowToastInsertSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred creating a courses";
      setShowToastInsertError(true);
      console.log(toastMessage, error);
    }
  };

  // (R)EAD Courses
  const { refetch } = useGetCorsesQuery();
  const reloadCourseList = () => {
    refetch();
  };

  // (U)PDATE Course
  const [updateCourse, { isLoading: isUpdating, error: updateError }] = useUpdateCourseMutation();
  const handleUpdateCourse = async () => {
    if (id === 0) {
      toastMessage = "An error occurred while updating a student. id must be greater than 0";
      setShowToastUpdateCriticalError(true);
      return;
    }
    console.log("handleUpdateCourse id: ", id);
    console.log("handleUpdateCourse subject: ", subject);
    console.log("handleUpdateCourse name: ", name);
    try {
      const response = await updateCourse({
        id: id,
        subject: subject,
        name: name,
      }).unwrap();
      toastMessage = "Course updated successfully";
      setShowToastUpdateSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while updating a course";
      setShowToastUpdateError(true);
      console.log(toastMessage, error);
    }
  };

  // (D)ELETE Course
  const [deleteCourse, { isLoading: isDeleting, error: deleteError }] = useDeleteCourseMutation();
  const handleDeleteCourse = async () => {
    if (id === 0) {
      toastMessage = "An error occurred while deleting a course. id must be greater than 0";
      setShowToastDeleteCriticalError(true);
      return;
    }
    console.log("handleDeleteCourse id: ", id);
    try {
      const response = await deleteCourse({ id: id }).unwrap();
      toastMessage = "Course deleted successfully";
      setShowToastDeleteSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while deleting a course";
      setShowToastDeleteError(true);
      console.log(toastMessage, error);
    }
  };
  const handleDeleteLatestCourse = async () => {
    console.log("handleDeleteLatestCourse id: ", highestId);
    try {
      const response = await deleteCourse({ id: highestId }).unwrap();
      toastMessage = "Latest course deleted successfully";
      setShowToastDeleteSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred while deleting the latest course";
      setShowToastDeleteError(true);
      console.log(toastMessage, error);
    }
  };

  // Helper Functions
  const handleCreateRandomCourse = async () => {
    console.log("handleCreateRandomCourse");
    try {
      const response = await addCourse({
        subject: randomSubject(),
        name: randomName(),
      }).unwrap();
      toastMessage = "Random course created successfully";
      setShowToastInsertSuccess(true);
      console.log(toastMessage, response);
    } catch (error) {
      toastMessage = "An error occurred creating a random course";
      setShowToastInsertError(true);
      console.log(toastMessage, error);
    }
  };

  const handleCoursesClick = (id: number, subject: string, name: string) => {
    setId(id);
    setSubject(subject);
    setName(name);
  };

  const handleHighestId = (id: number) => {
    setHighestId(id);
  };


  const handleAssignStudent = () => {
    if (id === 0) {
      toastMessage = "An error occurred assign a student. id must be greater than 0";
      setShowToastInsertCriticalError(true);
      return;
    }
    setCourse({ id: id, subject: subject, name: name });
    setShowModalStudents(true);
  };

  function handleCloseStudentsModal(): void {
    setShowModalStudents(false);
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
            {showButtons && <IonButton onClick={handleCreateRandomCourse}>Add Random Course</IonButton>}
            {showButtons && <IonButton onClick={handleDeleteLatestCourse}>Delete Latest Course</IonButton>}
            <IonButton onClick={reloadCourseList}>Reload</IonButton>
            <div className="checkbox-flex-container">
              <IonCheckbox className="checkbox" checked={showButtons} onIonChange={(e) => setShowButtons(e.detail.checked)} />
              <label className="checkbox-label">Buttons on/off</label>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <div>
        <h6 className="my-text-headline-style">Courses</h6>
      </div>
      <div className="input-group">
        <div>
          <div className="label-input">
            <label htmlFor="id">Id</label>
            <input style={{ width: '70px' }} className="input-field-number" type="number" id="id" value={id} onChange={(e) => setId(Number(e.target.value))} placeholder="id" />
          </div>
          <div className="label-input">
            <label htmlFor="subject">Subject</label>
            <input className="input-field-text" type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          </div>
          <div className="label-input">
            <label htmlFor="name">Name</label>
            <input className="input-field-text" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          </div>
        </div>
        <div>
          <div>
            <IonButton disabled={false} className="my-button-style" onClick={handleCreateCourse}>
              Create Course
            </IonButton>
            <IonButton disabled={false} className="my-button-style" onClick={handleUpdateCourse}>
              Update Course
            </IonButton>
          </div>
          <div>
            <IonButton disabled={false} className="my-button-style" onClick={handleDeleteCourse}>
              Delete
            </IonButton>
            <IonButton disabled={false} className="my-button-style" onClick={handleAssignStudent}>
              Assign Student
            </IonButton>
            {showModalStudents && course && (
              <StudentsModal showModalStudents={showModalStudents} course={course} handleCloseStudentsModal={handleCloseStudentsModal} reloadCourseList={reloadCourseList} />
            )}
          </div>
        </div>
      </div>
      <hr className="custom-divider" />

      <IonContent className="ion-padding">
        <div>
          <CourseList onCourseClick={handleCoursesClick} onHighestId={handleHighestId} />
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

export default CoursePage;
