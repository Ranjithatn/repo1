import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import Notification from "./Notification";
import { requestRemoveNotification } from "../../actions/notifications";
const notificationRoot = document.getElementById("notification-root");
import "./NotificationRoot.scss";

export const NotificationRoot = ({ notifications, requestRemoveNotification }) => {
  if (!notifications || notifications.length <= 0) return <span />;
  return ReactDOM.createPortal(
    <Fragment>
      {notifications.map(notification => {
        return (
          <Notification
            key={notification.id}
            id={notification.id}
            message={notification.message}
            type={notification.type}
            timeOutInMillis={notification.timeOutInMillis}
            onClick={requestRemoveNotification}
          />
        );
      })}
    </Fragment>,
    notificationRoot
  );
};

const mapState = state => ({
  notifications: state.notifications
});
export default connect(mapState, { requestRemoveNotification })(
  NotificationRoot
);
