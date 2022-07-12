import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
// import { sortFingers } from '../Helper';
import { LeftHand, RightHand, LeftPalm, RightPalm, Mugshot } from "./Icons";

import "./TenprintVerifyLeft.scss";

const getActivePanes = (biometrics, tenprint) => {
  let data = {
    Flat: false,
    Rolled: false,
    Palm: false,
    Mugshot: false
  };

  biometrics.length > 0 &&
    biometrics.map(finger => {
      if (finger.impression === "Flat") {
        data.Flat = true;
      }
      if (finger.impression === "Roll") {
        data.Rolled = true;
      }
      if (finger.type === "Palm") {
        data.Palm = true;
      }
    });

  if (tenprint.probe && tenprint.probe.mugshot) {
    data.Mugshot = true;
  }

  return data;
};

// component starts here
export const TenprintVerifyLeft = props => {
  let {
    formatMessage,
    requestSetTenprintVerifyHand,
    tenprint,
    panes,
    requestTogglePaneVisibility
  } = props;

  console.log("tenprint", tenprint);
  console.log("-- -- panes", panes);

  const activePanes = getActivePanes(
    tenprint.tenprint.probe.biometrics,
    tenprint.tenprint
  );
  console.log("activePanes", activePanes);

  const handleNavClick = (item, data) => {
    console.log("selected item", item);
    requestSetTenprintVerifyHand({
      position: item,
      fingers: data || []
    });
  };

  // this contains all the navigation options we see in the left sidebar
  const navigation = [
    {
      title: "Flat Prints",
      id: "Flat",
      active: activePanes.Flat,
      items: [
        {
          title: "Left Hand",
          icon: LeftHand,
          id: "LeftHandFlat",
          onClick: () => {
            handleNavClick("LeftHandFlat", []);
          }
        },
        {
          title: "Right Hand",
          icon: RightHand,
          id: "RightHandFlat",
          onClick: () => {
            handleNavClick("RightHandFlat", []);
          }
        }
      ]
    },
    {
      title: "Rolled Prints",
      id: "Rolled",
      active: activePanes.Rolled,
      items: [
        {
          title: "Left Hand",
          icon: LeftHand,
          id: "LeftHandRolled",
          onClick: () => {
            handleNavClick("LeftHandRolled");
          }
        },
        {
          title: "Right Hand",
          icon: RightHand,
          id: "RightHandRolled",
          onClick: () => {
            handleNavClick("RightHandRolled");
          }
        }
      ]
    },
    {
      title: "Palm Prints",
      id: "Palm",
      active: activePanes.Palm,
      items: [
        {
          title: "Left Hand",
          icon: LeftPalm,
          id: "LeftPalm",
          onClick: () => {
            handleNavClick("LeftPalm");
          }
        },
        {
          title: "Right Hand",
          icon: RightPalm,
          id: "RightPalm",
          onClick: () => {
            handleNavClick("RightPalm");
          }
        }
      ]
    },
    {
      title: "Mugshot",
      id: "Mugshot",
      active: activePanes.Mugshot,
      single: true,
      items: [
        {
          icon: Mugshot,
          id: "Mugshot",
          onClick: () => {
            handleNavClick("Mugshot");
          }
        }
      ]
    }
  ];

  const isActive = id => {
    if (tenprint.selected === id) {
      return true;
    }

    // remove later
    if (tenprint.selected === "Left" && id === "LeftHandFlat") {
      return true;
    }
    if (tenprint.selected === "Right" && id === "RightHandFlat") {
      return true;
    }
    return false;
  };

  const isActiveTab = id => {
    if (id === "Flat") {
      if (
        tenprint.selected === "LeftHandFlat" ||
        tenprint.selected === "RightHandFlat" ||
        tenprint.selected === "Left" ||
        tenprint.selected === "Right"
      ) {
        return true;
      }
    }

    if (id === "Rolled") {
      if (
        tenprint.selected === "LeftHandRolled" ||
        tenprint.selected === "RightHandRolled"
      ) {
        return true;
      }
    }

    if (id === "Palm") {
      if (
        tenprint.selected === "LeftPalm" ||
        tenprint.selected === "RightPalm"
      ) {
        return true;
      }
    }
    if (id === "Mugshot") {
      if (tenprint.selected === "Mugshot") {
        return true;
      }
    }

    return false;
  };

  // let sidebarClass = 'visible';
  // if ( ! panes.sidebar ) {
  //   sidebarClass = 'hidden';
  // }
  //  ${sidebarClass}

  return (
    <div className={`probe-screen`}>
      <div className="heading">{formatMessage({ id: "probeData" })}</div>

      <nav>
        {navigation.map(data => {
          const isEnabled = data.active ? "enabled" : "disabled";
          const isActiveSection = isActiveTab(data.id)
            ? "active"
            : "not-active";
          return (
            <div key={data.title} className={`${isEnabled} ${isActiveSection}`}>
              <div className="nav-title">
                {formatMessage({ id: data.title })}
              </div>
              <div className="items">
                {data.items &&
                  data.items.length > 0 &&
                  data.items.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className={`item ${isActive(item.id) ? "active" : ""} ${
                          data.single ? "single" : ""
                        }`}
                        onClick={item.onClick}
                      >
                        {item.icon && (
                          <div className="nav-item-icon">{item.icon()}</div>
                        )}
                        {item.title && (
                          <div className="nav-item-title">
                            {formatMessage({ id: item.title })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
// component ends here

// lets export it default with `withRouter` Higher Order Component.
export default withRouter(TenprintVerifyLeft);
