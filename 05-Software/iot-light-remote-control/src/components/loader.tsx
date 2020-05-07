import React from 'react';
import { IonLoading } from '@ionic/react';

import './Loader.css';
// import { AppContext } from './../AppContextProvider';

export interface InterfaceLoader {
  isLoading: boolean,
  message: string,
  onClose?: (e: Event) => void
}

const Loader: React.FC<InterfaceLoader> = ({ isLoading, onClose, message }) => {

  return (
    <div className="c-loader">
      <IonLoading
        spinner={"bubbles"}
        isOpen={isLoading}
        onDidDismiss={onClose}
        message={message}
        backdropDismiss={true}
        duration={10000}
      />
    </div>
  );
};

export default Loader;
