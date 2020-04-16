import React, { useContext, useState, useEffect } from 'react';
import { IonSlides, IonSlide, IonFab, IonFabButton, IonIcon, IonItem, IonButton, IonLabel } from '@ionic/react';
import { wifi } from 'ionicons/icons';
import { lightService } from './../services/light-service';

import LightController, { InterfaceLamp } from './LightController';
import { add } from 'ionicons/icons';
import './DevicesContainer.css';
import { AppContext } from './../AppContextProvider';

interface ContainerProps {
  name: string;
}





const DevicesContainer: React.FC<ContainerProps> = ({ name }) => {
  const { state, dispatch } = useContext(AppContext);
  const [isFetchingData, setFetchingData] = useState(false);
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  const slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoHeight: true,
    // direction: 'vertical',
    centeredSlides: true,
    observer: true,
    on: {
      observerUpdate: (e: any) => {
        // if(e.target && e.target.length) {
        //   e.target.length().then((length: number) => {
        //     e.target.slideTo(length)
        //   });
        // }
      }
    }
  };

  const jumpToSlide = (e: any) => {
    console.log(e)
    if (e.target && e.target.length) {
      e.target.length().then((length: number) => {
        e.target.slideTo(length)
      });
    }
  }


  const updateDevices = async () => {
    lightService.getLightStatus(state.api).then((res) => {
      console.log(res);
    })
  }

  useEffect(() => {
    updateDevices();
  },
    [isFetchingData]
  );

  const noDevices = (
    <h2>
      No devices have been added yet.
    </h2>
  )

  // const _slidesRef = React.createRef<any>();

  return (
    <div className="c-devices">
      {/* <strong>{name}</strong>
      <p>{state.count}</p> */}
      <IonFab vertical="top" horizontal="end" slot="fixed">
        <IonFabButton onClick={() => {

          const lamp: InterfaceLamp = {
            brightness: 0,
            turnedOn: false,
          }
          let devices = state.devices;
          devices.push(lamp)
          dispatch({
            key: 'devices',
            data: devices,
          })
        }}>
          <IonIcon icon={add} />
        </IonFabButton>
      </IonFab>
      {state.devices.length ?
        <IonSlides
          onIonSlidesDidLoad={(e) => {
            console.log('did load')
          }}
          onIonSlideDidChange={(e) => {
            // jumpToSlide(e)
          }}
          pager={true} options={slideOpts}>
          {state.devices.map((device, index) => {
            return <IonSlide key={index}>
              <LightController {...device} id={index} />
            </IonSlide>
          })}
        </IonSlides>
        : noDevices}

      <IonItem>
        <IonButton expand="full" onClick={() => setFetchingData(true)}>
          <IonLabel>Connect</IonLabel>
          <IonIcon icon={wifi}></IonIcon>
        </IonButton>
      </IonItem>

    </div>
  );
};

export default DevicesContainer;
