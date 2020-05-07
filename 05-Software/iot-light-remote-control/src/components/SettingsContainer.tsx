import React, { useContext } from 'react';
import { AppContext } from './../AppContextProvider';
import { IonListHeader, IonToggle, IonList, IonItem, IonInput, IonItemGroup, IonLabel, IonIcon } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';

import './DevicesContainer.css';

interface SettingsContainerProps {
  name: string;
}

const SettingsContainer: React.FC<SettingsContainerProps> = (props) => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className="c-settings">
      <IonList>
        <IonItemGroup>
          <IonListHeader>
            Customization
          </IonListHeader>
          <IonItem lines="full" class="c-ionitem">
            <IonIcon slot="start" icon={state.theme === 'dark' ? moon : sunny}></IonIcon>
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              onIonChange={(e) => {
                console.log(e);
                dispatch({
                  key: 'theme',
                  data: e.detail.checked ? "dark" : "light"
                })
              }}
              slot="end"
              checked={state.theme === 'dark'}
            ></IonToggle>
          </IonItem>
        </IonItemGroup>

        <IonItemGroup>
          <IonListHeader>
            Network
          </IonListHeader>
          <IonItem>
            <IonLabel>Ip Address</IonLabel>
            {/* TODO add validators with dots */}
            <IonInput
              value={state.api}
              placeholder="Enter API IP Adrress"
              onIonChange={(e) =>
                dispatch({
                  key: 'api',
                  data: e.detail.value
                })}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Username</IonLabel>
            <IonInput
              value={state.auth.username}
              placeholder="Enter the API username"
              onIonChange={(e) =>
                dispatch({
                  key: 'auth',
                  data: Object.assign(state.auth, { username: e.detail.value })
                })}></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel>Password</IonLabel>
            {/* TODO add show/hide stars */}
            <IonInput
              value={state.auth.password}
              placeholder="Enter the API password"
              type="password"
              onIonChange={(e) =>
                dispatch({
                  key: 'auth',
                  data: Object.assign(state.auth, { password: e.detail.value })
                })}></IonInput>
          </IonItem>

        </IonItemGroup>
      </IonList>
    </div>
  );
};

export default SettingsContainer;
