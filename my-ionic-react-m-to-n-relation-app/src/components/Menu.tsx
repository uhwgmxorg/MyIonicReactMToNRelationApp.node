import React from "react";
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import GetVersion from "../components/GetVersion";

import { useLocation } from "react-router-dom";
// see:
//https://ionic.io/ionicons
import {
  personCircleOutline,
  easelOutline,
  list,
  peopleCircleOutline,
  documentOutline,
  attachOutline,
} from "ionicons/icons";
import "./Menu.css";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: "ReadMe",
    url: "/page/ReadmePage",
    iosIcon: attachOutline,
    mdIcon: attachOutline,
  },
  {
    title: "Students",
    url: "/page/StudentsPage",
    iosIcon: peopleCircleOutline,
    mdIcon: peopleCircleOutline,
  },
  {
    title: "Courses",
    url: "/page/CoursesPage",
    iosIcon: easelOutline,
    mdIcon: easelOutline,
  },
  {
    title: "Page 01",
    url: "/page/Page01Page",
    iosIcon: documentOutline,
    mdIcon: documentOutline,
  },
  {
    title: "ChangeLog",
    url: "/page/ChangeLogPage",
    iosIcon: list,
    mdIcon: list,
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  const isPage01PageEnabled = false;

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="menu-list">
          <IonListHeader className="my-ion-list-header">
            MyIonicReactMToNRelationApp
          </IonListHeader>
          <GetVersion />
          {appPages.map((appPage, index) => {
            if (appPage.title === "Page 01" && !isPage01PageEnabled) {
              return null;
            }
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
