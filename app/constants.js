// export const API_ORIGIN_URL = "http://192.168.1.26/api";
import { settings } from './utils/electron';
const _settings = settings();

console.log("_settings",_settings);

let ipAddress = "";
let protocol ="http";

if ( _settings && _settings.ipAddress ) { ipAddress = _settings.ipAddress; }
if ( _settings && _settings.protocol ) { protocol = _settings.protocol; }

const url = `${protocol}://${ipAddress}/services-gateway-ucw/api`;

export default {
  API_ORIGIN_URL: url
}
