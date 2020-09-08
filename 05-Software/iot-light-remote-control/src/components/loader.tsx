import React, {useContext} from 'react';
import { IonLoading } from '@ionic/react';
import { AppContext } from './../AppContextProvider';
import './Loader.css';

export interface InterfaceLoader {
}

const Loader: React.FC<InterfaceLoader> = () => {
  const { state, dispatch } = useContext(AppContext);

  return (
    <div className="c-loader">
      <IonLoading
        spinner={"bubbles"}
        isOpen={state.isLoading}
        // onDidDismiss={onClose}
        message={"Updating"}
        backdropDismiss={true}
        duration={10000}
      />
    </div>
  );
};

export default Loader;
