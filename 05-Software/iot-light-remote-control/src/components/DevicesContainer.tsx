import React, { useContext, useState } from 'react';
import { IonIcon, IonItem, IonButton, IonLabel } from '@ionic/react';
import { wifi } from 'ionicons/icons';
import { lightService } from './../services/light-service';
import LightController from './LightController';
import { ledUtils } from './../helpers/ledUtils';
import { useLoader } from './useLoader';

import { AppContext } from './../AppContextProvider';
import './DevicesContainer.css';

interface ContainerProps {
  name: string;
}

const DevicesContainer: React.FC<ContainerProps> = ({ name }) => {
  const { state, dispatch } = useContext(AppContext);

  const handleRefresh = async () => {
    useLoader.enable(true, dispatch)
    console.log('...retrieving...')
    lightService.getLightStatus(state.api).then((res) => {
      ledUtils.handleResponse(res, dispatch)
      useLoader.enable(false, dispatch)
    })
    useLoader.reset(dispatch);
  }

  const noDevices = (
    <h2>
      There are no devices yet.
    </h2>
  )

  return (
    <div className="c-devices">
      <div className="c-devices__slide">
        {state.devices.length ?
          <LightController devices={state.devices} />
          : noDevices}
      </div>
      <div className="c-devices__btn">
        <IonItem lines={"none"}>
          <IonButton expand="full" shape={"round"} onClick={handleRefresh}>
            <IonLabel>Refresh</IonLabel>
            <IonIcon icon={wifi}></IonIcon>
          </IonButton>
        </IonItem>
      </div>

    </div>
  );
};

export default DevicesContainer;
