import React, { useContext, useState, useEffect } from 'react';
import { IonSlides, IonSlide, IonFab, IonFabButton, IonIcon, IonItem, IonButton, IonLabel } from '@ionic/react';
import { wifi } from 'ionicons/icons';
import { lightService } from './../services/light-service';
import { useIsMount } from './useIsMount';

import LightController, { InterfaceLamp } from './LightController';
import Loader from './loader';
import { add } from 'ionicons/icons';
import './DevicesContainer.css';
import { AppContext } from './../AppContextProvider';

interface ContainerProps {
  name: string;
}



const DevicesContainer: React.FC<ContainerProps> = ({ name }) => {
  const { state, dispatch } = useContext(AppContext);
  const [{ fetchData, isFetchingData }, setFetchingData] = useState({ fetchData: false, isFetchingData: false });
  const isMount = useIsMount();
  // Optional parameters to pass to the swiper instance. See http://idangero.us/swiper/api/ for valid options.
  const slideOpts = {
    initialSlide: 1,
    speed: 400,
    autoHeight: true,
    direction: 'vertical',
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
      setFetchingData({ fetchData, isFetchingData: false });
    })
  }

  useEffect(() => {
    if (!isMount) {
      setFetchingData({ fetchData, isFetchingData: true });
      updateDevices();
    }
  },
    [fetchData]
  );

  const noDevices = (
    <h2>
      There are no devices yet.
    </h2>
  )

  // const _slidesRef = React.createRef<any>();

  return (
    <div className="c-devices">
      <Loader isLoading={isFetchingData} message={"Updating devices"} onClose={(e) => {}} />
      <div className="c-devices__slide">
        {state.devices.length ?
          <IonSlides
            onIonSlidesDidLoad={(e) => {}}
            onIonSlideDidChange={(e) => {
              // jumpToSlide(e)
            }}
            pager={true} options={slideOpts}>
            {state.devices.map((device, index) => {
              return <IonSlide key={index}>
                <LightController {...device} />
              </IonSlide>
            })}
          </IonSlides>
          : noDevices}
      </div>
      <div className="c-devices__btn">
        <IonItem lines={"none"}>
          <IonButton expand="full" onClick={() => setFetchingData({ fetchData: !fetchData, isFetchingData })}>
            <IonLabel>Refresh</IonLabel>
            <IonIcon icon={wifi}></IonIcon>
          </IonButton>
        </IonItem>
      </div>

    </div>
  );
};

export default DevicesContainer;
