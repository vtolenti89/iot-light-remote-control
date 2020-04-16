import React, { useContext } from 'react';
import { IonToggle, IonItem, IonLabel } from '@ionic/react';

import useLongPress from './useLongPress';
import useDebounce from './useDebounce';

import './LightController.css';
import { AppContext } from './../AppContextProvider';

export interface InterfaceLamp {
  id?: number,
  brightness: number,
  turnedOn: boolean,
}


const LightController: React.FC<InterfaceLamp> = (props) => {
  const { state, dispatch } = useContext(AppContext);
  const meterWrapper = React.createRef<any>();
  const meter = React.createRef<any>();
  const getPercentage = (ev: any) => {

    let el = meterWrapper.current;

    if (el) {
      let mouseYPos = ev.changedTouches[0].clientY - el.getBoundingClientRect().top;
      let height = Math.round(mouseYPos / (el.getBoundingClientRect().height) * 100);
      if (height >= 0 && height <= 100) {

        let devices = state.devices;
        console.log(devices[props.id || 0].brightness, (100 - height));
        // Check if the difference is big enough 
        if (Math.abs(devices[props.id || 0].brightness + height - 100) > 2) {
          devices[props.id || 0].brightness = (100 - height);
          dispatch({
            key: 'devices',
            data: devices
          })
        }
      }
    }
  }

  // const backspaceLongPress = useDebounce(getPercentage, 100);

  // const [interval, confInterval] = useState();

  const noDevices = (
    <h2>
      No devices have been added yet.
    </h2>
  )



  // const backspaceLongPress = useLongPress(getPercentage, 500);
  return (
    <div className="c-light">
      <p>brightness</p>
      <div ref={meterWrapper} className="c-light__meter__wrapper"
        // {...backspaceLongPress}
        onTouchStart={(e: any) => { e.persist(); getPercentage(e) }}
        onTouchMove={(e: any) => { e.persist(); getPercentage(e) }}
        onTouchEnd={(e: any) => { e.persist(); getPercentage(e) }}
      >
        <div ref={meter} className="c-light__meter" style={{ height: (100 - props.brightness) + '%' }}>
        </div>
        <div className="c-light__meter__value">
          {props.brightness + '%'}
        </div>
      </div>
      <IonItem>
        <IonLabel>ON</IonLabel>
        <IonToggle checked={props.turnedOn} onIonChange={(e) => {
          // setChecked(e.detail.checked)} 
          let devices = state.devices;
          devices[props.id || 0].turnedOn = e.detail.checked;
          dispatch({
            key: 'devices',
            data: devices
          })
        }}
        />
      </IonItem>

      
    </div>
  );
};

export default LightController;
