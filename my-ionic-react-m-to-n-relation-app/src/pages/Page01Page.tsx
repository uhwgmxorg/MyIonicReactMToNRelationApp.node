import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useParams } from "react-router";
import GetVersion from "../components/GetVersion";
import "./Page01Page.css";

const Page01Page: React.FC = () => {
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
        <div className="content-center">
          <h6 className="my-text-headline-style">Page 01</h6>
        </div>
        <div>This is the content of Page 01</div>
      </IonContent>
    </IonPage>
  );
};

export default Page01Page;
