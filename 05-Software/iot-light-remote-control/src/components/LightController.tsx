import React, { useContext, useState } from 'react';
import { IonItem, IonRange, IonIcon } from '@ionic/react';
import { sunny } from 'ionicons/icons';
import { lightService } from './../services/light-service';
import ToggleButton from './shared/ToggleButton';
import Loader from './loader';
import { AppContext } from './../AppContextProvider';
import './LightController.css';

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
  const [isLoading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleUpdateToggle = async (isOn: boolean) => {
    lightService.toggleLight(
      state.api,
      devices[activeIndex].id,
      isOn,
      state.auth.username,
      state.auth.password)
      .then((res) => {
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
        setLoading(false);
      })
    resetLoading();

  }

  const handleUpdateBrightness = async (brightness: number) => {

    lightService.dimLight(
      state.api,
      devices[activeIndex].id,
      brightness,
      state.auth.username,
      state.auth.password)
      .then((res) => {
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
        setLoading(false);
      })
    resetLoading();
  }

  const resetLoading = () => {
    setTimeout(() => {
      setLoading(false);
    }, 5000)
  }

  const handleBrightness = (brightness: number) => {
    if (brightness !== devices[activeIndex].brightness) {
      setLoading(true);
      handleUpdateBrightness(brightness);
    }
  }

  const handleToggle = (isToggled: boolean) => {
    setLoading(true);
    handleUpdateToggle(isToggled);
  }

  return (
    <div className="c-light">
      <Loader isLoading={isLoading} message={".Updating devices"} onClose={() => { }} />
      {devices.length ? <div className="c-light__lamps">
        {devices.map((device, index) => {
          return <div className={`c-light__lamp ${activeIndex === index ? 'active' : ''}`} key={index} onClick={e => setActiveIndex(index)}>
            <span style={{ background: device.turnedOn ? device.color : 'transparent' }}></span>
            <span style={{
              border: `${device.color} solid 3px`,
              background: device.turnedOn ? `rgba(255,255,255, ${1.0 - (1.0 - 0.0) / 100 * device.brightness})` : 'transparent'
            }}></span>
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
              disabled={!devices[activeIndex].turnedOn}
              className={"c-range"}
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
