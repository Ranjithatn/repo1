import React from 'react';
import ReactDOM from 'react-dom';
import Button from '../Button/Button';

import { store } from '../../index';
import { requestLogout } from "../../actions/auth";
import { push } from 'react-router-redux';
import { translate } from '../../utils/intl';

import LoginPopup from '../LoginForm/LoginPopup';

const PortalNotification = (props) => {

  // console.log("PortalNotification:::props", props);

  const resetNotification = () => {
    return ReactDOM.render(
      null,
      document.getElementById('react-portal-container'),
    );
  }

  if ( ! props.popup ) {
    setTimeout( function() {
  		resetNotification();
    }, props.timeout || 3000);
  }
  // }, 50000);


  let style = {
    background: 'rgba(255,0,0,0.7)',
    padding: 20,
    fontsize: 16,
    position: 'absolute',
    top: '10px',
    right: '10px',
    minwidth: '200px',
    textAlign: 'center',
    zIndex: 50,
    color: '#FFF',
    display: 'flex',
    flexDirection: 'row',
    // left: '50%',
  };

  if ( props.popup ) {
    style.padding = 0;
    style.background="transparent";
  }



  if ( props.style ) { style = {...style, ...props.style} };

  const handleClick = () => {
    resetNotification();
    store.dispatch({ type: 'REQUEST_LOGOUT_SUCCESS' });
    store.dispatch({ type: 'RESET_ENTIRE_STORE' });
    store.dispatch( push('/') );
  }

  const showLoginPopup = () => {
    // resetNotification();
    return ReactDOM.render(
     <PortalNotification message={<LoginPopup />} timeout={9999999*99999999} popup={true} style={{ maxWidth: 400 }} />,
      document.getElementById('react-portal-container'),
    );
  }




  const closeThisNotification = () => {
    resetNotification();
  }

  return (
    <div style={ style }>
      { props.message || 'Some Error Occoured.' }
      { props.redirect && <div style={{ margintop: 10, marginLeft: 20 }}><Button id="jwt-failed" type="submit" className="is-info" onClick={ showLoginPopup } text={ translate("reAuthenticate") } /></div> }
      { ! props.popup &&
        <span onClick={ closeThisNotification }><button className="delete" /></span>
      }
    </div>
  )

}

export const displayError = (message) => {
  return ReactDOM.render(
   <PortalNotification message={message || 'Error Occurred'} timeout={ 7000 } style={{ maxWidth: 400 }} />,
    document.getElementById('react-portal-container'),
  );
}


export const hideError = () => {
  return ReactDOM.render(
    null,
    document.getElementById('react-portal-container'),
  );
}


export const displayLoginPopup = (message) => {
  // console.log("displayLoginPopup called", message);
  // hideError();
  return ReactDOM.render(
   <PortalNotification message={<LoginPopup message={message} />} timeout={9999999*99999999} popup={true} style={{ maxWidth: 400 }} />,
    document.getElementById('react-portal-container'),
  );
}



export default PortalNotification;
