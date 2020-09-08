import React, { Dispatch, createContext, useEffect, useReducer } from 'react';
import { InterfaceLamp } from './components/LightController';
import { useLocalStorage } from './useLocalStorage';

interface InterfaceAuth {
    username: string,
    password: string
}

interface ContextStateInterface {
    theme: string,
    count: number,
    devices: Array<InterfaceLamp>,
    auth: InterfaceAuth,
    api: string,
    isLoading: boolean
}

interface ContextActionInterface {
    key: string,
    data: any,
    callback?: () => void
}


interface InterfaceContextProps {
    state: ContextStateInterface;
    dispatch: Dispatch<ContextActionInterface>;
}


export const AppContext = createContext({} as InterfaceContextProps);

const initialState = {
    theme: 'light',
    // puppers: [],
    count: 0,
    devices: [],
    auth: {
        username: '',
        password: ''
    },
    api: '',
    isLoading: false
}

const reducer = (state: ContextStateInterface, action: ContextActionInterface) => {
    if (action.key) {
        return { ...state, ...{ [action.key]: action.data } }
    }
    return state;
}

const AppContextProvider = (props: any) => {
    const [data, setData] = useLocalStorage('data', initialState);

    let [state, dispatch] = useReducer(reducer, data);

    let value = { state, dispatch };

    useEffect(() => {
        setData(state);
    }, [state, setData]);

    useEffect(() => {
        if (state.theme === 'light') {
            document.body.classList.remove('dark');
        } else {
            document.body.classList.add('dark');
        }
    }, [state.theme, dispatch]);


    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

export default AppContextProvider;