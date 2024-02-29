import React from 'react';
import { useIonViewDidEnter, IonCard, IonList, IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import GetVersion from "../components/GetVersion";
import './ReadmePage.css';

const ReadmePage: React.FC = () => {

    const { name } = useParams<{ name: string; }>();

    const handleViewDidEnter = () => {
        //console.log('ReadmePage: ionViewDidEnter');
    };
    useIonViewDidEnter(handleViewDidEnter);

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
                <div >
                    <h6 className='my-text-headline-style'>ReadmePage</h6>
                </div>
                <div>
                    <IonCard>
                        <IonList>
                            <p className='my-text-style'>
                                <span style={{ fontWeight: 'bold' }}>MyIonicReactMToNRelation App</span> is an example for an m to n relation between students and courses.
                                Based on Redux and RTK Toolkit.
                            </p>
                            <p className='my-text-style'>
                                You  find the source code on <a href='https://github.com'>github.com</a>.
                            </p>
                        </IonList>
                    </IonCard>
                </div>                
            </IonContent>

        </IonPage>
    );
};

export default ReadmePage;