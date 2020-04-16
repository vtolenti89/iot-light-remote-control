import { apiService } from './api-service';

const checkIp = (ip: string) => {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
    return (true)
  }
  return (false)
}

const getLightStatus = (api: string) => {
  return apiService.get(api + '/light/status');
}

const dimLight = (lightId: string, percentage: number) => {
  return apiService.post('/light/dim', { lightId, percentage });
}

const switchLight = (lightId: string, value: number) => {
  return apiService.post('/light/switch', { lightId, value });
}

export const lightService = {
  getLightStatus,
  dimLight,
  switchLight
};