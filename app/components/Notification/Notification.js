import React from "react";

// const Notification = ({ message, type, id, onClick, timeOutInMillis }) => {

//   return (
//     <div className={"notification " + type} onClick={() => onClick(id)}>
//       <button className="delete" />
//       {message}
//     </div>
//   );
// };

export class Notification extends React.PureComponent {
  componentDidMount() {
    const { id, timeOutInMillis, onClick } = this.props;

    if (timeOutInMillis) {
      setTimeout(() => {
        onClick(id); //calls requestRemoveNotification
      }, timeOutInMillis);
    }
  }

  render() {
    const { id, message, type, onClick } = this.props;
    // console.log("Notification::this.props",this.props);

    if ( typeof message === 'string' || message instanceof String ) {
      return (
        <div className={"notification " + type} onClick={() => onClick(id)}>
          <button className="delete" />
          {message}
        </div>
      );
    }
    else {
      if ( message && message.Message ) { return null; }
      return (
        <div className={"notification " + type} onClick={() => onClick(id)}>
          <button className="delete" />
          { JSON.stringify(message) }
        </div>
      );
    }

  }
}

export default Notification;
