import { apiService } from './api-service';
import { ledUtils } from '../helpers/ledUtils';
import { LED, ACTION } from '../helpers/variables.json';



const checkIp = (ip: string) => {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
    return (true)
  }
  return (false)
}

const getLightStatus = (api: string) => {
  return apiService.get(api + '/light/status');
}

const dimLight = (led: number, percentage: number, user: string, pass: string) => {
  return apiService.post('/light/set?' + ledUtils.parseLed(led, ACTION.BRIGHTNESS) + "=" + percentage + "&user=" + user + "&pass=" + pass);
}

const toggleLight = (led: number, isOn: boolean, user: string, pass: string) => {
  return apiService.post('/light/set?' + ledUtils.parseLed(led, ACTION.TOGGLE) + "=" + isOn + "&user=" + user + "&pass=" + pass);
}

export const lightService = {
  getLightStatus,
  dimLight,
  toggleLight
};