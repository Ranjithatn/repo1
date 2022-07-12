import React from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import Dropdown from "../../Dropdown/Dropdown";
import DropdownItem from "../../Dropdown/DropdownItem";
import logo from "../../../images/logo-round.png";
import Icon from "../../Icon/Icon";
import Image from "../../Image/Image";
import { requestLogout } from "../../../actions/auth";
import { requestShowAuditLog } from "../../../actions/auditlog";
import { requestSetLocale } from "../../../actions/locale";
import { Link } from "react-router-dom";
import "./AppNavbar.scss";
import Switch from "../../Switch/Switch";
import Lang_English from "../../../images/english.png";
import Lang_Arabic from "../../../images/arabic.png";
import { CONFIRMATION_MODAL, LANGUAGE_CHANGE_CONFIRMATIOM_MODAL } from "../../Modal/ModalRoot";
import { requestShowModal } from "../../../actions/modal";
import { requestCloseLiveScanProgress } from "../../../actions/liveScan";
import cardScan from "../../../reducers/cardScan";
import Permissions from "../../Permissions";






class AppNavbar extends React.Component {

  constructor() {
    super();
    this.state = {
      accountDropdown: false,
      languageDropdown: false,
    }
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }



  toggleAccountDropdown() {
    this.setState({ accountDropdown: ! this.state.accountDropdown });
  }

  toggleDropdown() {
    this.setState({ languageDropdown: ! this.state.languageDropdown });
  }


  render() {

    const {
      history,
      requestLogout,
      requestSetLocale,
      username,
      userrole,
      locale,
      intl,
      requestShowAuditLog,
      startScan,
      requestShowModal,
      requestCloseLiveScanProgress,
      cardScanStatus,
      latentScan,
      cardScanWorkflow,
      latent,
      adjudicator,
      userInfo,
    } = this.props;

    // console.log("AppNavbar::this.props", this.props);
    // console.log("AppNavbar::this.props.history.location.pathname", this.props.history.location.pathname);
    // console.log("AppNavbar::latent,adjudicator", latent,adjudicator);


    const { formatMessage } = intl;

    return (
      <nav className="app-navbar">
        <div className="left">
          <Image
            src={logo}
            onClick={() => {
              if (
                !startScan &&
                cardScanWorkflow.cards.length === 0 &&
                !latentScan
                // (
                //   cardScanWorkflow.cards.length === 0 &&
                //   (
                //     cardScanStatus != "CARD_SCAN_IMAGE" ||
                //     cardScanStatus != "SET_CARD_SCAN_CONFIG" ||
                //     cardScanStatus != "CARD_SCAN_DELETE_CARD" ||
                //     cardScanStatus != "RESET" ||
                //     cardScanStatus != "CARD_SCAN_CHANGE_ACTIVE_CARD"
                //   )
                // )
              ) {history.push("/authenticated/jobqueue")
                ;
              } else {
                requestShowModal({
                  modalType: CONFIRMATION_MODAL,
                  modalProps: {
                    action: () => {
                      history.push("/authenticated/jobqueue");
                      requestCloseLiveScanProgress();
                    },
                    message: "homeConfirmation"
                  }
                });
              }
            }}
            alt="logo"
          />
        </div>
        {/* </Link> */}
        <div className="right">
          <Dropdown text={ userInfo.operatorName ? `${userInfo.operatorName} - ${ userInfo.locationName || '' }` :  username} icon="user-circle-o" onClick={ this.toggleAccountDropdown } hover={ this.state.accountDropdown }  >
            {/* <Permissions type="sys.app.audit.viewer"> */}
              <DropdownItem
                text={formatMessage({ id: "AuditLogs" })}
                disabled={ this.props.history.location.pathname === "/authenticated/auditlog/logs" }
             
                // onClick={() => requestShowAuditLog("", "", "", "", 0)}
                onClick={() => {
                  if (
                    !startScan &&
                    cardScanWorkflow.cards.length === 0 &&
                    !latentScan
                  ) {
                    requestShowAuditLog("", "", "", "", 1);
                  } else {
                    requestShowModal({
                      modalType: CONFIRMATION_MODAL,
                      modalProps: {
                        action: () => {
                          requestShowAuditLog("", "", "", "", 1);
                          requestCloseLiveScanProgress();
                        },
                        message: "confirmationMsg"
                      }
                    });
                  }
                }}
              />
            {/* </Permissions> */}

            <DropdownItem
              text={formatMessage({ id: "logout" })}
              // onClick={() => requestLogout(history)}
       
              onClick={() => {
                if (
                  !startScan &&
                  cardScanWorkflow.cards.length === 0 &&
                  !latentScan
                ) {
                  requestLogout(history);
                } else {
                  requestShowModal({
                    modalType: CONFIRMATION_MODAL,
                    modalProps: {
                      action: () => {
                        requestLogout(history);
                      },
                      message: "logoutConfirmation"
                    }
                  });
                }
              }}
            />
          </Dropdown>





          <div
                className="language-selector-switch"
                style={{ marginLeft: "15px" }}
              >
                <div
                  onClick={() =>
                    requestSetLocale({
                      lang: locale === "English" ? "ar" : "en",
                      dir: locale === "English" ? "rtl" : "ltr",
                      displayName: locale === "English" ? "Arabic" : "English"
                    })
                  }
                  style={{ marginTop: "-2px" }}
                >
                  {locale === "English" && (
                    <div style={{ display: "flex" }}>
                    <span style={{ lineHeight: "28px", marginRight: "5px" }}>
                    لغة عربية
                    </span>{" "}
                    <Image src={Lang_Arabic} />
                  </div>
                    
                  )}
                  {locale !== "English" && (
                    <div style={{ display: "flex" }}>
                    <span style={{ lineHeight: "28px", marginLeft: "5px" }}>
                      English
                    </span>
                    <Image src={Lang_English} />{" "}
                  </div>
                  )}
                </div>
              </div>








{/*



          <Dropdown
            text={
              locale !== "English" ? (
                <div style={{ display: "flex" }}>
                  <span style={{ lineHeight: "28px", marginRight: "5px" }}>
                 { formatMessage({ id: "English" })}
                  </span>
                  <Image src={Lang_English} />
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <span style={{ lineHeight: "28px", marginRight: "5px" }}>
                  { formatMessage({ id: "Arabic" })}
                  </span>
                  <Image src={Lang_Arabic} />
                </div>
              )
            }
            hover={ this.state.languageDropdown }
            onClick={ e=> {
              this.toggleDropdown();
            } }
          >
            { locale !== "English" &&
            <DropdownItem
              text="English"
              onClick={() => {
                if ( latent || adjudicator ) {
                  requestShowModal({
                    modalType: LANGUAGE_CHANGE_CONFIRMATIOM_MODAL,
                    modalProps: {
                      action: () => {
                      ({
                          lang: "en",
                          dir: "ltr",
                          displayName: "English"
                        });
                      },
                      message: "changesWillBeLost"
                    }
                  });
                } else {
                  requestSetLocale({
                    lang: "en",
                    dir: "ltr",
                    displayName: "English"
                  });
                }
              }}
              // onClick={() =>
              //   requestSetLocale({
              //     lang: "en",
              //     dir: "ltr",
              //     displayName: "English"
              //   })
              // }
            />
            }
            { locale === "English" &&
            <DropdownItem
              text="Arabic"
              onClick={() => {
                if ( latent || adjudicator ) {
                  requestShowModal({
                    modalType: LANGUAGE_CHANGE_CONFIRMATIOM_MODAL,
                    modalProps: {
                      action: () => {
                        requestSetLocale({
                          lang: "ar",
                          dir: "rtl",
                          displayName: "Arabic"
                        });
                      },
                      message: "changesWillBeLost"
                    }
                  });
                } else {
                  requestSetLocale({
                    lang: "ar",
                    dir: "rtl",
                    displayName: "Arabic"
                  });
                }
              }}
              // onClick={() =>
              //   requestSetLocale({
              //     lang: "ar",
              //     dir: "rtl",
              //     displayName: "Arabic"
              //   })
              // }
            />
            }
          </Dropdown>
      */}






        </div>
      </nav>
    );

  }



}



const mapState = ({ auth, liveScan, cardScan, latent, locale, tenprint }) => ({
  username: auth.username,
  userrole: auth.roles,
  locale: locale.displayName,
  startScan: liveScan.liveScanWorkflow.inProgress,
  cardScanStatus: cardScan.workflow.status,
  latentScan: latent.start,
  cardScanWorkflow: cardScan.workflow,
  latent: latent.start,
  adjudicator: tenprint.ShowAdjudicator,
  userInfo: auth.userInfo || {},
});

export default connect(
  mapState,
  {
    requestLogout,
    requestSetLocale,
    requestShowAuditLog,
    requestShowModal,
    requestCloseLiveScanProgress
  }
)(injectIntl(AppNavbar));
