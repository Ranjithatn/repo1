import { settings } from './electron';


export const hideGenericErrors = console.error.bind(console);

console.error = (message, ...args) => {
    if (
        typeof message === 'string' &&
        // message.startsWith('[React Intl] Missing message:' || 'POST http://127.0.0.1:189' || 'POST http://127.0.0.1:18622/' )
        message.startsWith('[React Intl] Cannot format message'||'POST http://192.168.1.3/api/systeminfo')
    ) { return; }

    if ( typeof message === 'string' && message.startsWith('[React Intl] Missing message:') ) { return; }

    hideGenericErrors(message, ...args);
};
/*
POST http://127.0.0.1:18622/f/VersionInfo?ts=1523544637782 net::ERR_EMPTY_RESPONSE
*/





export const enableDisableConsole = () => {

  const _settings = settings();
  // console.log("enableDisableConsole::_settings.logging",_settings.logging);

  // hide all console logs.
  if ( _settings.logging && ( _settings.logging === "no" || _settings.logging === "file" ) ) {
    if( ! window.console ) window.console = {};
    const methods = ["log", "debug", "warn", "info"];
    for( let i=0; i < methods.length; i++ ){
      console[methods[i]] = function() { };
    }
  }

}


