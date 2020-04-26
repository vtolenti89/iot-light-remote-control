import { LED, ACTION } from './variables.json';

export const parseLed = (led: string, action: number) => {
    switch(led) {
        case LED.BLUE: {
            if(action === ACTION.BRIGHTNESS)
                return "blbri";
            else if(action == ACTION.TOGGLE)
                return "blon";
        }
        break;
        case LED.RED: {
            if(action === ACTION.BRIGHTNESS)
                return "rlbri";
            else if(action == ACTION.TOGGLE)
                return "rlon";
        }
        break;
        case LED.YELLOW: {
            if(action === ACTION.BRIGHTNESS)
                return "ylbri";
            else if(action == ACTION.TOGGLE)
                return "ylon";
        }
        break;
    }
}

export const ledUtils = {
    parseLed
}