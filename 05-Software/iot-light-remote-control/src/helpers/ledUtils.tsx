import { LED, ACTION } from './variables.json';

/**
 * Parse different commands 
 * @param led 
 * @param action 
 */
const parseLed = (led: string, action: number) => {
    switch(led) {
        case LED.BLUE: 
            if(action === ACTION.BRIGHTNESS)
                return "blbri";
            else if(action === ACTION.TOGGLE)
                return "blon";
        break;
        case LED.RED:
            if(action === ACTION.BRIGHTNESS)
                return "rlbri";
            else if(action === ACTION.TOGGLE)
                return "rlon";
        break;
        case LED.YELLOW:
            if(action === ACTION.BRIGHTNESS)
                return "ylbri";
            else if(action === ACTION.TOGGLE)
                return "ylon";
        break;
    }
}

/**
 * Handle the response obtained after updating a LED
 * @param res 
 * @param dispatch 
 */
const handleResponse = (res: any, dispatch: any) => {
    // Check whether the response is error free
    if (!res.error) {

        // Get the id of each lamp object
        const lampsArray: Array<string> = Object.keys(res);

        // Parses response
        const devices: Array<any> = lampsArray.map((lamp: keyof typeof res) => {
          return {
            id: lamp,
            color: res[lamp].color,
            brightness: res[lamp].brightness,
            turnedOn: res[lamp].isOn
          }
        })

        // Updating the store
        dispatch({
          key: 'devices',
          data: devices,
        })
      }
}

export const ledUtils = {
    parseLed,
    handleResponse
}