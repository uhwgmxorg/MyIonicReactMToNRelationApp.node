import React from "react";
import { IonItem, IonList, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useParams } from "react-router";
import GetVersion from "../components/GetVersion";
import "./ChangeLogPage.css";

const ChangeLogPage: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <GetVersion />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div>
          <h6 className="my-text-headline-style">ChangeLog</h6>
        </div>
        <div>
          <IonList>
            <IonItem>
              <ul className="my-text-style">
                <span style={{ fontWeight: "bold" }}>Version 1.1.1</span>
                <li>providesTags and invalidatesTags newly and differently set</li>
              </ul>
            </IonItem>
            <IonItem>
              <ul className="my-text-style">
                <span style={{ fontWeight: "bold" }}>Version 1.1.0</span>
                <li>Search function on Students and Courses Page</li>
                <li>Search function in the Modal Windows for assigning Students and Courses</li>
                <li>Bug fixes on Course Page (spelling)</li>
                <li>Some layout fixes</li>
              </ul>
            </IonItem>
            <IonItem>
              <ul className="my-text-style">
                <span style={{ fontWeight: "bold" }}>Version 1.0.1</span>
                <li>Fix layout bug in Courses</li>
              </ul>
            </IonItem>
            <IonItem>
              <ul className="my-text-style">
                <span style={{ fontWeight: "bold" }}>Version 1.0.0</span>
                <li>A version with the most important functions</li>
                <li>Students and courses are displayed with their assignments</li>
                <li>Students can be assigned courses</li>
                <li>Courses can be assigned to students</li>
                <li>and in the modal windows all can be selected and deselected</li>
              </ul>
            </IonItem>
            <IonItem>
              <ul className="my-text-style">
                <span style={{ fontWeight: "bold" }}>Version 0.0.0</span>
                <li>Start version</li>
              </ul>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChangeLogPage;
