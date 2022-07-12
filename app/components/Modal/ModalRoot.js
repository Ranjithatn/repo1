import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";

import AddJobModal from "./AddJobModal/AddJobModal";
import RemoveJobModal from "./RemoveJobModal/RemoveJobModal";
import NewActionModal from "./NewActionModal/NewActionModal";
import SubmitPrintsModal from "./SubmitPrintsModal/SubmitPrintsModal";
import AddMugshotModal from "./AddMugshotModal/AddMugshotModal";
import ShowLivescanProbeModal from "./ShowLivescanProbeModal/ShowLivescanProbeModal";
import TenprintVerifyConfirmModal from "./TenprintVerifyConfirmModal/TenprintVerifyConfirmModal";
import UpdateCriminalModal from "./UpdateCriminalModal/UpdateCriminalModal";
import CriminalPrintModal from "./CriminalPrintModal/CriminalPrintModal";
import NoteShowModal from "./NoteShowModal/NoteShowModal";
import CustomSearchModal from "./CustomSearchModal/CustomSearchModal";
import JobAuditLogModal from "./JobAudiLogModal/JobAuditLogModal";
import ConfirmationModal from "./ConfirmationModal/ConfirmationModal";

import LinkLatentModal from "./LinkModal/LinkModal";
import DelinkLatentModal from "./LinkModal/DeLinkModal";
import IgnoreLatentModal from "./LinkModal/IgnoreLatentModal";
import UpdateLatentModal from "./UpdateLatentModal/UpdateLatentModal";
import DeleteLatentModal from "./DeleteLatentModal/DeleteLatentModal";
import LanguageChangeConfirmationModal from "./LanguageChangeConfirmationModal/LanguageChangeConfirmationModal";

import { requestHideModal } from "../../actions/modal";

const modalRoot = document.getElementById("modal-root");

// App modal types listed here
export const ADD_JOB = "ADD_JOB";
export const REMOVE_JOB = "REMOVE_JOB";
export const NEW_ACTION = "NEW_ACTION";
export const SUBMIT_PRINTS = "SUBMIT_PRINTS";
export const MUG_SHOT = "MUG_SHOT";
export const LIVESCAN_PROBE = "LIVESCAN_PROBE";
export const TENPRINT_VERIFY_CONFIRM = "TENPRINT_VERIFY_CONFIRM";
export const UPDATE_CRIMINAL = "UPDATE_CRIMINAL";
export const CRIMINAL_PRINT = "CRIMINAL_PRINT";
export const NOTE_SHOW_MODAL = "NOTE_SHOW_MODAL";
export const CUSTOM_SEARCH_MODAL = "CUSTOM_SEARCH_MODAL";
export const JOB_AUDITLOG_MODAL = "JOB_AUDITLOG_MODAL";
export const CONFIRMATION_MODAL = "CONFIRMATION_MODAL";
export const LINK_LATENT_MODAL = "LINK_LATENT_MODAL";
export const DELINK_LATENT_MODAL = "DELINK_LATENT_MODAL";
export const IGNORE_LATENT_MODAL = "IGNORE_LATENT_MODAL";
export const UPDATE_LATENT_MODAL = "UPDATE_LATENT_MODAL";
export const DELETE_LATENT_MODAL = "DELETE_LATENT_MODAL";
export const LANGUAGE_CHANGE_CONFIRMATIOM_MODAL = "LANGUAGE_CHANGE_CONFIRMATIOM_MODAL";

const MODAL_COMPONENTS = {
  ADD_JOB: AddJobModal,
  REMOVE_JOB: RemoveJobModal,
  NEW_ACTION: NewActionModal,
  MUG_SHOT: AddMugshotModal,
  SUBMIT_PRINTS: SubmitPrintsModal,
  LIVESCAN_PROBE: ShowLivescanProbeModal,
  TENPRINT_VERIFY_CONFIRM: TenprintVerifyConfirmModal,
  UPDATE_CRIMINAL: UpdateCriminalModal,
  CRIMINAL_PRINT: CriminalPrintModal,
  NOTE_SHOW_MODAL: NoteShowModal,
  CUSTOM_SEARCH_MODAL: CustomSearchModal,
  JOB_AUDITLOG_MODAL: JobAuditLogModal,
  CONFIRMATION_MODAL: ConfirmationModal,
  LINK_LATENT_MODAL: LinkLatentModal,
  DELINK_LATENT_MODAL: DelinkLatentModal,
  IGNORE_LATENT_MODAL: IgnoreLatentModal,
  UPDATE_LATENT_MODAL: UpdateLatentModal,
  DELETE_LATENT_MODAL: DeleteLatentModal,
  LANGUAGE_CHANGE_CONFIRMATIOM_MODAL: LanguageChangeConfirmationModal,
};

const ModalRoot = ({ modalType, modalProps, intl }) => {
  if (!modalType) return <span />;
  const SpecificModal = MODAL_COMPONENTS[modalType];
  const { formatMessage } = intl;
  return ReactDOM.createPortal(
    <SpecificModal formatMessage={formatMessage} {...modalProps} />,
    modalRoot
  );
};

const mapState = state => state.modal;

export default connect(mapState, null)(injectIntl(ModalRoot));
