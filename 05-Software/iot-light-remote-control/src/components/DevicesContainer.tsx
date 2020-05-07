import React, { useContext, useState } from 'react';
import { IonIcon, IonItem, IonButton, IonLabel } from '@ionic/react';
import { wifi } from 'ionicons/icons';
import { lightService } from './../services/light-service';
import LightController from './LightController';
import Loader from './loader';
import { AppContext } from './../AppContextProvider';
import './DevicesContainer.css';

interface ContainerProps {
  name: string;
}

const DevicesContainer: React.FC<ContainerProps> = ({ name }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isLoading, setLoading] = useState(false);

  const updateDevices = async () => {
    console.log('...retrieving...')
    lightService.getLightStatus(state.api).then((res) => {
      console.log(res);
      if (res) {
        const lampsArray = Object.keys(res);
        console.log(lampsArray);
        const devices = lampsArray.map((lamp: any, index: number) => {
          return {
            id: lamp,
            color: res[lamp].color,
            brightness: res[lamp].brightness,
            turnedOn: res[lamp].isOn
          }
        })
        dispatch({
          key: 'devices',
          data: devices,
        })
      }
      setLoading(false);
    })
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }


  const handleRefresh = () => {
    setLoading(true);
    updateDevices();
  }

  const noDevices = (
    <h2>
      There are no devices yet.
    </h2>
  )

  return (
    <div className="c-devices">
      <Loader isLoading={isLoading} message={"Updating devices"} onClose={(e) => { }} />
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
