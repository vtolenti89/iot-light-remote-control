import React, { useContext, useState, useEffect } from 'react';
import { IonToggle, IonItem, IonLabel, IonRange, IonIcon, IonGrid, IonRow, IonCol, IonContent } from '@ionic/react';
import { moon, sunny } from 'ionicons/icons';
import { useIsMount } from './useIsMount';
import { lightService } from './../services/light-service';
import ToggleButton from './shared/ToggleButton';
import Loader from './loader';




import useLongPress from './useLongPress';
import useDebounce from './useDebounce';

import './LightController.css';
import { AppContext } from './../AppContextProvider';

export interface InterfaceLamp {
  id: string,
  color: string,
  brightness: number,
  turnedOn: boolean
}

interface LightControllerInterface {
  devices: Array<InterfaceLamp>,
}


const LightController: React.FC<LightControllerInterface> = ({ devices }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isUpdating, setUpdating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isRangeActive, setRange] = useState(false);
  const isMount = useIsMount();

  const handleUpdateToggle = async (isToggled: boolean) => {
    console.log('...updating toggle:', isToggled)
    lightService.toggleLight(
      state.api, 
      devices[activeIndex].id, 
      isToggled, 
      state.auth.username, 
      state.auth.password)
      .then((res) => {
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
    lightService.dimLight(
      state.api, 
      devices[activeIndex].id, 
      brightness, 
      state.auth.username, 
      state.auth.password)
      .then((res) => {
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
        console.log(devices);
        dispatch({
          key: 'devices',
          data: devices,
        })
        setUpdating(false);

      }
    })
  }

  const handleBrightness = (brightness: number) => {
    if(isRangeActive) {
      setUpdating(true);
      handleUpdateBrightness(brightness);
    }
  }

  const handleToggle = (isToggled: boolean) => {
    console.log(isToggled)
    setUpdating(true);
    handleUpdateToggle(isToggled);
  }

  return (
    <div className="c-light">
      <Loader isLoading={isUpdating} message={".Updating devices"} onClose={() => { }} />
      {devices.length ? <div className="c-light__lamps">
        {devices.map((device, index) => {
          return <div className={`c-light__lamp ${activeIndex === index ? 'active' : ''}`} key={index} onClick={e => setActiveIndex(index)}>
            <span style={{  background: device.turnedOn ? device.color : 'transparent'}}></span>
            <span style={{ border: `${device.color} solid 3px`, background: device.turnedOn ? `${device.turnedOn ? `rgba(255,255,255, ${1.0 - (1.0 - 0.0) / 100 * device.brightness})` : 'transparent'  }` : 'transparent'}}></span>
          </div>
        })}
      </div> : null}


      <div className="c-light__controls">
        <div className="c-light__range">
          <IonItem lines={"none"}>
            <IonRange value={devices[activeIndex].brightness} 
                      max={100} 
                      min={0} 
                      debounce={750} 
                      snaps={true} 
                      step={10} 
                      ticks={true} 
                      onIonChange={(e: CustomEvent) => handleBrightness(e.detail.value)}
                      onIonBlur={(e: CustomEvent) => setRange(false)}
                      onIonFocus={(e: CustomEvent) => setRange(true)}
                      >
              <IonIcon slot="start" size="small" icon={sunny} ></IonIcon>
              <IonIcon slot="end" size="large" icon={sunny}></IonIcon>
            </IonRange>
          </IonItem>
        </div>
        <div className="c-light__toggle">
          <IonItem lines={"none"}>
            <ToggleButton checked={devices[activeIndex].turnedOn} onToggle={handleToggle} />
          </IonItem>
        </div>
      </div>

    </div>
  );
};

export default LightController;
