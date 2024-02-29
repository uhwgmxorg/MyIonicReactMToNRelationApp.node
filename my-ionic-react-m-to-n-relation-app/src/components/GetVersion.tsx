import { IonNote } from "@ionic/react";

const appVersion = "1.1.1";

const GetVersion: React.FC = () => {
    return (
        <IonNote>Version {appVersion}</IonNote>
    );
};

export default GetVersion;