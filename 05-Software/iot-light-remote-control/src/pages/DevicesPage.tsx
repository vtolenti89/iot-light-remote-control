import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import DevicesContainer from '../components/DevicesContainer';
import './DevicesPage.css';

const DevicesPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Devices</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Devices</IonTitle>
          </IonToolbar>
        </IonHeader>


        <DevicesContainer name="Tab 1 page" />



      </IonContent>
    </IonPage>
  );
};

export default DevicesPage;
