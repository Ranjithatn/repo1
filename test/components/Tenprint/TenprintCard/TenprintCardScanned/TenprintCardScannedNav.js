import React, { Fragment } from "react";
import Button from "../../../Button/Button";
import Title from '../../../Title/Title';
import { SUBMIT_PRINTS } from '../../../Modal/ModalRoot';

function TenprintCardScannedNav({
  formatMessage,
  history,
  nextClicked,
  requestClearLatentEditorData,
  toggleAddRegions,
  cardConfig,
  addRegions,
}) {
  return (
    <Fragment>
      <Button
        text={formatMessage({ id: "back" })}
        className="is-primary"
        leftIcon="arrow-left"
        onClick={() => {
          history.push("/authenticated/tenprint/card");
          requestClearLatentEditorData();
        }}
      />

      { cardConfig && cardConfig.name === "custom" &&
      <Button
        text="Add Region"
        className="is-primary"
        onClick={() => {
          toggleAddRegions();
        }}
        disabled={ addRegions }
        style={{ marginLeft: 20 }}
      />
      }

      <Title is="4" text={formatMessage({id: "title.tenprintInput"})} />
      <Button
        text={formatMessage({ id: "next" })}
        className="is-primary"
        rightIcon="arrow-right"
        onClick={nextClicked}
      />
    </Fragment>
  );
}

export default TenprintCardScannedNav;
