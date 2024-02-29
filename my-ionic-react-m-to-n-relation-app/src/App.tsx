import {
  IonApp,
  IonRouterOutlet,
  IonSplitPane,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/Menu";
import ReadmePage from "./pages/ReadmePage";
import StudentsPage from "./pages/StudentPage";
import CoursePage from "./pages/CoursePage";
import Page01Page from "./pages/Page01Page";
import ChangeLogPage from "./pages/ChangeLogPage";

import { Provider } from "react-redux";
import { store } from "./redux/store";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import "./App.css";

setupIonicReact();

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu />
            <IonRouterOutlet id="main">
              <Redirect from="/" to="/page/ReadmePage" exact />
              <Route path="/page/ReadmePage" component={ReadmePage} />
              <Route path="/page/StudentsPage" component={StudentsPage} />
              <Route path="/page/CoursesPage" component={CoursePage} />
              <Route path="/page/Page01Page" component={Page01Page} />
              <Route path="/page/ChangeLogPage" component={ChangeLogPage} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </Provider>
  );
};

export default App;
