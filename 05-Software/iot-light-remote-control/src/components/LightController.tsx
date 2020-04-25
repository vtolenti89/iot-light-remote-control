import React, { useContext, useState, useEffect } from 'react';
import { IonToggle, IonItem, IonLabel, IonRange, IonIcon, IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import { useIsMount } from './useIsMount';
import { lightService } from './../services/light-service';
import Loader from './loader';




import useLongPress from './useLongPress';
import useDebounce from './useDebounce';

import './LightController.css';
import { AppContext } from './../AppContextProvider';

export interface InterfaceLamp {
  id: string,
  color: string,
  brightness: number,
  turnedOn: boolean,
}


const LightController: React.FC<InterfaceLamp> = ({ id, color, brightness, turnedOn }) => {
  const { state, dispatch } = useContext(AppContext);
  const [{ updateToggle, updateBrightness, isUpdating }, setUpdating] = useState({ updateToggle: false, updateBrightness: 100, isUpdating: false });
  const isMount = useIsMount();


  const handleUpdateToggle = async () => {
    console.log('...updating toggle...')
    lightService.toggleLight(state.api, id, updateToggle, state.auth.username, state.auth.password ).then((res) => {
      console.log(res);
      if (!res.error) {
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
      setUpdating({ updateToggle, updateBrightness, isUpdating: false });
    })
  }


  const handleUpdateBrightness = async () => {
    console.log('...updating brightness...')
    lightService.dimLight(state.api, id, updateBrightness, state.auth.username, state.auth.password ).then((res) => {
      console.log(res);
      if (!res.error) {
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
        console.log(devices);
        dispatch({
          key: 'devices',
          data: devices,
        })

      }
      setUpdating({ updateToggle, updateBrightness, isUpdating: false });
    })
  }


  useEffect(() => {
    console.log('here')
    if (!isMount) {
      handleUpdateToggle();
    }
  },
    [updateToggle]
  );

  useEffect(() => {
    if (!isMount) {
      handleUpdateBrightness();
    }
  },
    [updateBrightness]
  );

  const handleBrightness = (brightness: number) => {
    setUpdating({ updateToggle, updateBrightness: brightness, isUpdating: true });
  }

  const handleToggle = (isOn: boolean) => {
    setUpdating({ updateToggle: isOn, updateBrightness, isUpdating: true });
  }

  return (
    <div className="c-light">
      <Loader isLoading={isUpdating} message={"Updating devices"} onClose={() => {}} />
      <div className="c-light__lamp">
  <h1>{id}</h1>
        <span style={{ background: turnedOn ? `radial-gradient(${color} 5%, transparent)` : `radial-gradient(transparent 95%, ${color})` }}>
          {turnedOn &&
            <span style={{ background: `rgba(0,0,0, ${(100 + 5 - brightness) / 100})` }}></span>
          }
        </span>
      </div>

      <div className="c-light__controls">

        <div className="c-light__range">
          <IonItem lines={"none"}>
            <IonRange value={brightness} max={100} min={0} debounce={250} snaps={true} step={10} ticks={true} onIonChange={(e: CustomEvent) => handleBrightness(e.detail.value)}>
              <IonIcon slot="start" size="small" icon={sunny} ></IonIcon>
              <IonIcon slot="end" size="large" icon={sunny}></IonIcon>
            </IonRange>
          </IonItem>
        </div>
{console.log(id, turnedOn)}
        <div className="c-light__toggle">
          <IonItem lines={"none"}>
            <IonLabel>ON</IonLabel>
            <IonToggle checked={turnedOn} onIonChange={(e) => handleToggle(e.detail.checked)}
            // setChecked(e.detail.checked)} 
            // let devices = state.devices;
            // devices[id || 0].turnedOn = e.detail.checked;
            // dispatch({
            //   key: 'devices',
            //   data: devices
            // })

            />
          </IonItem>
        </div>
      </div>



    </div>
  );
};

export default LightController;
