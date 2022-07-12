import React from "react";

const Modal = ({ title, content, buttons, requestHideModal, className }) => {
  return (
    <div className={"modal is-active" + (className ? " " + className : "")} style={{"zIndex":"50"}}>
      <div className="modal-background" />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{title}</p>
          <button
            className="delete is-large"
            aria-label="close"
            name="btn-modal-close"
            onClick={requestHideModal}
          />
        </header>
        <section className="modal-card-body">{content}</section>
        <footer className="modal-card-foot">{buttons}</footer>
      </div>
    </div>
  );
};

export default Modal;
