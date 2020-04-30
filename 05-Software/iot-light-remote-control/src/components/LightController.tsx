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
  const [isUpdating, setUpdating] = useState(false);
  const isMount = useIsMount();

  const handleUpdateToggle = async (isToggled: boolean) => {
    console.log('...updating toggle:', isToggled)
    lightService.toggleLight(state.api, id, isToggled, state.auth.username, state.auth.password).then((res) => {
      console.log(res);
      if (!res.error) {
        const lampsArray = Object.keys(res);
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
      setUpdating(false);
    })
  }

  const handleUpdateBrightness = async (brightness: number) => {
    console.log('...updating brightness:', brightness)
    lightService.dimLight(state.api, id, brightness, state.auth.username, state.auth.password).then((res) => {
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
        setUpdating(false);
        dispatch({
          key: 'devices',
          data: devices,
        })

      }
    })
  }

  const handleBrightness = (brightness: number) => {
    //setUpdating(true);
    handleUpdateBrightness(brightness);
  }

  const handleToggle = (isToggled: boolean) => {
    setUpdating(true);
    handleUpdateToggle(isToggled);
  }

  return (
    <div className="c-light">
      <Loader isLoading={isUpdating} message={"Updating devices"} onClose={() => { }} />
      <div className="c-light__lamp">
        <span style={{ background: turnedOn ? `radial-gradient(${color} 5%, transparent)` : `radial-gradient(transparent 95%, ${color})` }}>
          <span style={{ border: `${color} solid 3px`, background: turnedOn ? `rgba(255,255,255, ${1.0 - (1.0 - 0.0) / 100 * brightness})` : 'transparent' }}></span>
          <span style={{background: color}}></span>
        </span>

      </div>

      <div className="c-light__controls">

        <div className="c-light__range">
          <IonItem lines={"none"}>
            <IonRange value={brightness} max={100} min={0} debounce={750} snaps={true} step={10} ticks={true} onIonChange={(e: CustomEvent) => handleBrightness(e.detail.value)}>
              <IonIcon slot="start" size="small" icon={sunny} ></IonIcon>
              <IonIcon slot="end" size="large" icon={sunny}></IonIcon>
            </IonRange>
          </IonItem>
        </div>
        <div className="c-light__toggle">
          <IonItem lines={"none"}>
            <IonLabel>ON</IonLabel>
            
            <button onClick={(e)=>handleToggle(!turnedOn)} >toggle</button>
            <IonToggle value="true" checked={turnedOn} onIonChange={(e) => handleToggle(e.detail.checked)}/>
          </IonItem>
        </div>
      </div>



    </div>
  );
};

export default LightController;
