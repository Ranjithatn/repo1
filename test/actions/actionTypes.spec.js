import {
  REQUEST_NFIQ_QUALITY_THRESHOLD,
  LIVE_SCAN_WORKFLOW,
  MODAL_CHECKBOX,
  PALM_SCAN_WORKFLOW,
  RECEIVE_INPUT_FIELD_CHANGED,
  RECEIVE_INPUT_FIELD_CHANGED_FAILED,
  RECEIVE_TABLE_ROW_CLICKED,
  RECEIVED_BIOMETRICS_MUGSHOT,
  RECIEVE_NOTE_STORE,
  RECIVED_MATCHED_PERSON_CHANGED,
  RECIVED_MODAL_DATA,
  REQUEST_ACTION_HISTORY,
  REQUEST_ACTION_HISTORY_FAILED,
  REQUEST_ACTION_HISTORY_SUCCESS,
  REQUEST_ACTION_SUCCESS,
  REQUEST_ACTIVE_JOBS,
  REQUEST_ACTIVE_JOBS_FAILED,
  REQUEST_ACTIVE_JOBS_SUCCESS,
  REQUEST_ANNOTATION_FINGER_SAVE,
  REQUEST_ANNOTATION_NOTES_CHANGED,
  REQUEST_ANNOTATION_SELECT_CHANGED,
  REQUEST_ASC_SORT,
  REQUEST_AUDITLOG_PAGES,
  REQUEST_BIOMETRICS_MUGSHOT,
  REQUEST_CAPTURE_DATA,
  REQUEST_CAPTURE_DATA_CANON,
  REQUEST_CLEAR_LATENT_EDITOR_DATA,
  REQUEST_CLEAR_LIVESCAN_DATA,
  REQUEST_CLOSE_ACTION_FILTER,
  REQUEST_CLOSE_ACTION_FILTER_SUCCESS,
  REQUEST_CLOSE_FILTER,
  REQUEST_CLOSE_FILTER_SUCCESS,
  REQUEST_CREATE_JOB,
  REQUEST_CREATE_JOB_FAILED,
  REQUEST_CREATE_JOB_SUCCESS,
  REQUEST_DELETE_NEW_CRIME_DATA,
  REQUEST_FETCH_SCAN_SOURCES,
  REQUEST_FETCH_SCAN_SOURCES_FAILED,
  REQUEST_FETCH_SCAN_SOURCES_SUCCESS,
  REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS,
  REQUEST_GET_JOB_SEARCH_TEXT,
  REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS,
  REQUEST_HIDE_ADJUDICATOR,
  REQUEST_HIDE_MODAL,
  REQUEST_HISTORY_SORT,
  REQUEST_IMPORT_IMAGE,
  REQUEST_INPUT_FIELD_CHANGED,
  REQUEST_INPUT_FIELD_CHANGED_FAILED,
  REQUEST_JOB_AUDIT_LOGS,
  REQUEST_JOB_AUDIT_LOGS_SUCESS,
  REQUEST_LOAD_LIVESCAN,
  REQUEST_LOGIN,
  REQUEST_LOGIN_FAILED,
  REQUEST_LOGIN_SUCCESS,
  REQUEST_LOGOUT,
  REQUEST_LOGOUT_FAILED,
  REQUEST_LOGOUT_SUCCESS,
  REQUEST_MATCHED_PERSON_CHANGED,
  REQUEST_MODAL_DATA,
  REQUEST_MUGSHOT_DATA,
  REQUEST_NEW_ACTION,
  REQUEST_NEW_ACTION_FAILED,
  REQUEST_NEW_ACTION_SUCCESS,
  REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS,
  REQUEST_OPEN_JOB,
  REQUEST_PAGE_CHANGED,
  REQUEST_PAGE_CHANGED_FAILED,
  REQUEST_RECEIVED_IMAGE,
  REQUEST_REMOVE_ANNOTATED_FINGERS,
  REQUEST_REMOVE_BIOMETRIC_MUGSHOT,
  REQUEST_REMOVE_CANON_DATA,
  REQUEST_REMOVE_FILTER,
  REQUEST_REMOVE_JOB,
  REQUEST_REMOVE_JOB_FAILED,
  REQUEST_REMOVE_JOB_SUCCESS,
  REQUEST_REMOVE_NOTIFICATION,
  REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_RESET_CUSTOM_SEARCH_DATA,
  REQUEST_SAVE_ANNOTATIONS,
  REQUEST_SAVE_CARD_SCAN_BOXES,
  REQUEST_SAVE_LATENT_EDITED_IMAGE,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE,
  REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS,
  REQUEST_SAVE_SUD,
  REQUEST_SAVE_SUD_SUCCESS,
  REQUEST_SCANNED_IMAGE_MODAL,
  REQUEST_SCANNED_TYPE,
  REQUEST_SEGMENTED_CARD_SCAN,
  REQUEST_SEGMENTED_CARD_SCAN_FAILED,
  REQUEST_SEGMENTED_CARD_SCAN_SUCCESS,
  REQUEST_SELECT_FINGER,
  REQUEST_SELECT_FINGER_SUCCESS,
  REQUEST_SELECTED_BIOMETRICS,
  REQUEST_SELECTED_TENPRINT_TYPE,
  REQUEST_SET_ADD_NEW,
  REQUEST_SET_BIOMETRICS_DETAILS,
  REQUEST_SET_CIVIL_SEARCH,
  REQUEST_SET_CUSTOM_SEARCH_DATABASE,
  REQUEST_SET_CUSTOM_SEARCH_ID,
  REQUEST_SET_DOWNLOAD,
  REQUEST_SET_LOCALE,
  REQUEST_SET_LOCALE_SUCCESS,
  REQUEST_SET_NEW_CRIME_TYPE_SUCCESS,
  REQUEST_SET_NEW_UPDATE,
  REQUEST_SET_PAGE,
  REQUEST_SET_PERSON_DATA,
  REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA,
  REQUEST_SET_TENPRINT_VERIFY,
  REQUEST_SET_TENPRINT_VERIFY_HAND,
  REQUEST_SET_TENPRINT_VERIFY_MATCH,
  REQUEST_SET_TENPRINT_VERIFY_RAW,
  REQUEST_SET_TENPRINT_VERIFY_STORE,
  REQUEST_SHOW_ADJUDICATOR,
  REQUEST_SHOW_ADJUDICATOR_SUCCESS,
  REQUEST_SHOW_AUDITLOG,
  REQUEST_SHOW_AUDITLOG_SUCCESS,
  REQUEST_SHOW_FILTERED_DATA,
  REQUEST_SHOW_JOB_FILTERED_DATA,
  REQUEST_SHOW_MODAL,
  REQUEST_SHOW_NOTIFICATION,
  REQUEST_SHOW_SCANNED_IMAGE,
  REQUEST_SHOW_UPDATE_MESSAGE,
  REQUEST_SPINNER_START,
  REQUEST_SPINNER_STOP,
  REQUEST_START_CANON_LIVE_VIEW,
  REQUEST_START_CARD_SCAN,
  REQUEST_START_CARD_SCAN_FAILED,
  REQUEST_START_CARD_SCAN_SUCCESS,
  REQUEST_START_SCAN,
  REQUEST_START_SCANNER,
  REQUEST_START_SCANNER_FAILED,
  REQUEST_START_SCANNER_SUCCESS,
  REQUEST_STOP_CANON_LIVE_VIEW,
  REQUEST_STOP_SCAN,
  REQUEST_STOP_SCANNER,
  REQUEST_STOP_SCANNER_FAILED,
  REQUEST_STOP_SCANNER_SUCCESS,
  REQUEST_STORE_COMPLETED_DATA,
  REQUEST_STORE_COMPLETED_DATA_SUCCESS,
  REQUEST_STORE_INITIAL_LIVESCAN_DATA,
  REQUEST_SUBMIT_PRINTS,
  REQUEST_SUBMIT_PRINTS_FAILED,
  REQUEST_SUBMIT_PRINTS_SUCCESS,
  REQUEST_TABLE_ROW_CLICKED,
  REQUEST_TABLE_ROW_CLICKED_FAILED,
  REQUEST_TENPRINT_VERIFY,
  REQUEST_UPDATE_JOB,
  REQUEST_UPDATE_JOB_BIOMETRICS,
  REQUEST_UPDATE_JOB_FAILED,
  REQUEST_UPDATE_JOB_SUCCESS,
  REQUEST_UPDATE_SEARCH_TEXT,
  REQUEST_UPDATE_SEARCH_TEXT_SUCCESS,
  RESET_ACTION_TYPE,
  SET_JOB_TYPE_FILTER_APPLIED,
  TOGGLE_PANE_VISIBILITY,
  UPDATE_NFIQ_QUALITY_THRESHOLD,
  UPDATE_SERVER_STATUS
} from '../../app/actions/actionTypes';


describe('Action Types', () => {
  it("should create actions type", () => {
    expect(REQUEST_NFIQ_QUALITY_THRESHOLD).toEqual("REQUEST_NFIQ_QUALITY_THRESHOLD");
  });
  it("should create actions type", () => {
    expect(LIVE_SCAN_WORKFLOW).toEqual("LIVE_SCAN_WORKFLOW");
  });
  it("should create actions type", () => {
    expect(MODAL_CHECKBOX).toEqual("MODAL_CHECKBOX");
  });
  it("should create actions type", () => {
    expect(PALM_SCAN_WORKFLOW).toEqual("PALM_SCAN_WORKFLOW");
  });
  it("should create actions type", () => {
    expect(RECEIVE_INPUT_FIELD_CHANGED).toEqual("RECEIVE_INPUT_FIELD_CHANGED");
  });
  it("should create actions type", () => {
    expect(RECEIVE_INPUT_FIELD_CHANGED_FAILED).toEqual("RECEIVE_INPUT_FIELD_CHANGED_FAILED");
  });
  it("should create actions type", () => {
    expect(RECEIVE_TABLE_ROW_CLICKED).toEqual("RECEIVE_TABLE_ROW_CLICKED");
  });
  it("should create actions type", () => {
    expect(RECEIVED_BIOMETRICS_MUGSHOT).toEqual("RECEIVED_BIOMETRICS_MUGSHOT");
  });
  it("should create actions type", () => {
    expect(RECIEVE_NOTE_STORE).toEqual("RECIEVE_NOTE_STORE");
  });
  it("should create actions type", () => {
    expect(RECIVED_MATCHED_PERSON_CHANGED).toEqual("RECIVED_MATCHED_PERSON_CHANGED");
  });
  it("should create actions type", () => {
    expect(RECIVED_MODAL_DATA).toEqual("RECIVED_MODAL_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTION_HISTORY).toEqual("REQUEST_ACTION_HISTORY");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTION_HISTORY_FAILED).toEqual("REQUEST_ACTION_HISTORY_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTION_HISTORY_SUCCESS).toEqual("REQUEST_ACTION_HISTORY_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTION_SUCCESS).toEqual("REQUEST_ACTION_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTIVE_JOBS).toEqual("REQUEST_ACTIVE_JOBS");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTIVE_JOBS_FAILED).toEqual("REQUEST_ACTIVE_JOBS_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_ACTIVE_JOBS_SUCCESS).toEqual("REQUEST_ACTIVE_JOBS_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_ANNOTATION_FINGER_SAVE).toEqual("REQUEST_ANNOTATION_FINGER_SAVE");
  });
  it("should create actions type", () => {
    expect(REQUEST_ANNOTATION_NOTES_CHANGED).toEqual("REQUEST_ANNOTATION_NOTES_CHANGED");
  });
  it("should create actions type", () => {
    expect(REQUEST_ANNOTATION_SELECT_CHANGED).toEqual("REQUEST_ANNOTATION_SELECT_CHANGED");
  });
  it("should create actions type", () => {
    expect(REQUEST_ASC_SORT).toEqual("REQUEST_ASC_SORT");
  });
  it("should create actions type", () => {
    expect(REQUEST_AUDITLOG_PAGES).toEqual("REQUEST_AUDITLOG_PAGES");
  });
  it("should create actions type", () => {
    expect(REQUEST_BIOMETRICS_MUGSHOT).toEqual("REQUEST_BIOMETRICS_MUGSHOT");
  });
  it("should create actions type", () => {
    expect(REQUEST_CAPTURE_DATA).toEqual("REQUEST_CAPTURE_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_CAPTURE_DATA_CANON).toEqual("REQUEST_CAPTURE_DATA_CANON");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLEAR_LATENT_EDITOR_DATA).toEqual("REQUEST_CLEAR_LATENT_EDITOR_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLEAR_LIVESCAN_DATA).toEqual("REQUEST_CLEAR_LIVESCAN_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLOSE_ACTION_FILTER).toEqual("REQUEST_CLOSE_ACTION_FILTER");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLOSE_ACTION_FILTER_SUCCESS).toEqual("REQUEST_CLOSE_ACTION_FILTER_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLOSE_FILTER).toEqual("REQUEST_CLOSE_FILTER");
  });
  it("should create actions type", () => {
    expect(REQUEST_CLOSE_FILTER_SUCCESS).toEqual("REQUEST_CLOSE_FILTER_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_CREATE_JOB).toEqual("REQUEST_CREATE_JOB");
  });
  it("should create actions type", () => {
    expect(REQUEST_CREATE_JOB_FAILED).toEqual("REQUEST_CREATE_JOB_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_CREATE_JOB_SUCCESS).toEqual("REQUEST_CREATE_JOB_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_DELETE_NEW_CRIME_DATA).toEqual("REQUEST_DELETE_NEW_CRIME_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_FETCH_SCAN_SOURCES).toEqual("REQUEST_FETCH_SCAN_SOURCES");
  });
  it("should create actions type", () => {
    expect(UPDATE_SERVER_STATUS).toEqual("UPDATE_SERVER_STATUS");
  });
  it("should create actions type", () => {
    expect(UPDATE_NFIQ_QUALITY_THRESHOLD).toEqual("UPDATE_NFIQ_QUALITY_THRESHOLD");
  });
  it("should create actions type", () => {
    expect(TOGGLE_PANE_VISIBILITY).toEqual("TOGGLE_PANE_VISIBILITY");
  });
  it("should create actions type", () => {
    expect(SET_JOB_TYPE_FILTER_APPLIED).toEqual("SET_JOB_TYPE_FILTER_APPLIED");
  });
  it("should create actions type", () => {
    expect(RESET_ACTION_TYPE).toEqual("RESET_ACTION_TYPE");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_SEARCH_TEXT_SUCCESS).toEqual("REQUEST_UPDATE_SEARCH_TEXT_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_SEARCH_TEXT).toEqual("REQUEST_UPDATE_SEARCH_TEXT");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_JOB_SUCCESS).toEqual("REQUEST_UPDATE_JOB_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_JOB_FAILED).toEqual("REQUEST_UPDATE_JOB_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_JOB_BIOMETRICS).toEqual("REQUEST_UPDATE_JOB_BIOMETRICS");
  });
  it("should create actions type", () => {
    expect(REQUEST_UPDATE_JOB).toEqual("REQUEST_UPDATE_JOB");
  });
  it("should create actions type", () => {
    expect(REQUEST_TENPRINT_VERIFY).toEqual("REQUEST_TENPRINT_VERIFY");
  });
  it("should create actions type", () => {
    expect(REQUEST_TABLE_ROW_CLICKED_FAILED).toEqual("REQUEST_TABLE_ROW_CLICKED_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_TABLE_ROW_CLICKED).toEqual("REQUEST_TABLE_ROW_CLICKED");
  });
  it("should create actions type", () => {
    expect(REQUEST_SUBMIT_PRINTS_SUCCESS).toEqual("REQUEST_SUBMIT_PRINTS_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SUBMIT_PRINTS_FAILED).toEqual("REQUEST_SUBMIT_PRINTS_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_SUBMIT_PRINTS).toEqual("REQUEST_SUBMIT_PRINTS");
  });
  it("should create actions type", () => {
    expect(REQUEST_STORE_INITIAL_LIVESCAN_DATA).toEqual("REQUEST_STORE_INITIAL_LIVESCAN_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_STORE_COMPLETED_DATA_SUCCESS).toEqual("REQUEST_STORE_COMPLETED_DATA_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_STORE_COMPLETED_DATA).toEqual("REQUEST_STORE_COMPLETED_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_STOP_SCANNER_SUCCESS).toEqual("REQUEST_STOP_SCANNER_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_STOP_SCANNER_FAILED).toEqual("REQUEST_STOP_SCANNER_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_FETCH_SCAN_SOURCES_FAILED).toEqual("REQUEST_FETCH_SCAN_SOURCES_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_STOP_SCANNER).toEqual("REQUEST_STOP_SCANNER");
  });
  it("should create actions type", () => {
    expect(REQUEST_STOP_SCAN).toEqual("REQUEST_STOP_SCAN");
  });
  it("should create actions type", () => {
    expect(REQUEST_STOP_CANON_LIVE_VIEW).toEqual("REQUEST_STOP_CANON_LIVE_VIEW");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_SCANNER_SUCCESS).toEqual("REQUEST_START_SCANNER_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_SCANNER_FAILED).toEqual("REQUEST_START_SCANNER_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_SCANNER).toEqual("REQUEST_START_SCANNER");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_SCAN).toEqual("REQUEST_START_SCAN");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_CARD_SCAN_SUCCESS).toEqual("REQUEST_START_CARD_SCAN_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_CARD_SCAN_FAILED).toEqual("REQUEST_START_CARD_SCAN_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_CARD_SCAN).toEqual("REQUEST_START_CARD_SCAN");
  });
  it("should create actions type", () => {
    expect(REQUEST_START_CANON_LIVE_VIEW).toEqual("REQUEST_START_CANON_LIVE_VIEW");
  });
  it("should create actions type", () => {
    expect(REQUEST_SPINNER_STOP).toEqual("REQUEST_SPINNER_STOP");
  });
  it("should create actions type", () => {
    expect(REQUEST_SPINNER_START).toEqual("REQUEST_SPINNER_START");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_UPDATE_MESSAGE).toEqual("REQUEST_SHOW_UPDATE_MESSAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_SCANNED_IMAGE).toEqual("REQUEST_SHOW_SCANNED_IMAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_FETCH_SCAN_SOURCES_SUCCESS).toEqual("REQUEST_FETCH_SCAN_SOURCES_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_NOTIFICATION).toEqual("REQUEST_SHOW_NOTIFICATION");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_MODAL).toEqual("REQUEST_SHOW_MODAL");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_JOB_FILTERED_DATA).toEqual("REQUEST_SHOW_JOB_FILTERED_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_FILTERED_DATA).toEqual("REQUEST_SHOW_FILTERED_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_AUDITLOG_SUCCESS).toEqual("REQUEST_SHOW_AUDITLOG_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_AUDITLOG).toEqual("REQUEST_SHOW_AUDITLOG");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_ADJUDICATOR_SUCCESS).toEqual("REQUEST_SHOW_ADJUDICATOR_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SHOW_ADJUDICATOR).toEqual("REQUEST_SHOW_ADJUDICATOR");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT_VERIFY_STORE).toEqual("REQUEST_SET_TENPRINT_VERIFY_STORE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT_VERIFY_RAW).toEqual("REQUEST_SET_TENPRINT_VERIFY_RAW");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT_VERIFY_MATCH).toEqual("REQUEST_SET_TENPRINT_VERIFY_MATCH");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT_VERIFY_HAND).toEqual("REQUEST_SET_TENPRINT_VERIFY_HAND");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT_VERIFY).toEqual("REQUEST_SET_TENPRINT_VERIFY");
  });
  it("should create actions type", () => {
    expect(REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS).toEqual("REQUEST_FILTERED_ACTIVE_JOBS_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA).toEqual("REQUEST_SET_TENPRINT__VERIFY_MATCHED_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_PERSON_DATA).toEqual("REQUEST_SET_PERSON_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_PAGE).toEqual("REQUEST_SET_PAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_NEW_UPDATE).toEqual("REQUEST_SET_NEW_UPDATE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_NEW_CRIME_TYPE_SUCCESS).toEqual("REQUEST_SET_NEW_CRIME_TYPE_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_LOCALE_SUCCESS).toEqual("REQUEST_SET_LOCALE_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_LOCALE).toEqual("REQUEST_SET_LOCALE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_DOWNLOAD).toEqual("REQUEST_SET_DOWNLOAD");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_CUSTOM_SEARCH_ID).toEqual("REQUEST_SET_CUSTOM_SEARCH_ID");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_CUSTOM_SEARCH_DATABASE).toEqual("REQUEST_SET_CUSTOM_SEARCH_DATABASE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_CIVIL_SEARCH).toEqual("REQUEST_SET_CIVIL_SEARCH");
  });
  it("should create actions type", () => {
    expect(REQUEST_SET_BIOMETRICS_DETAILS).toEqual("REQUEST_SET_BIOMETRICS_DETAILS");
  });
  it("should create actions type", () => {
  expect(REQUEST_SET_ADD_NEW).toEqual("REQUEST_SET_ADD_NEW");
  });
  it("should create actions type", () => {
    expect(REQUEST_SELECTED_TENPRINT_TYPE).toEqual("REQUEST_SELECTED_TENPRINT_TYPE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SELECTED_BIOMETRICS).toEqual("REQUEST_SELECTED_BIOMETRICS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SELECT_FINGER_SUCCESS).toEqual("REQUEST_SELECT_FINGER_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SELECT_FINGER).toEqual("REQUEST_SELECT_FINGER");
  });
  it("should create actions type", () => {
    expect(REQUEST_GET_JOB_SEARCH_TEXT).toEqual("REQUEST_GET_JOB_SEARCH_TEXT");
  });
  it("should create actions type", () => {
    expect(REQUEST_SEGMENTED_CARD_SCAN_SUCCESS).toEqual("REQUEST_SEGMENTED_CARD_SCAN_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SEGMENTED_CARD_SCAN_FAILED).toEqual("REQUEST_SEGMENTED_CARD_SCAN_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_SEGMENTED_CARD_SCAN).toEqual("REQUEST_SEGMENTED_CARD_SCAN");
  });
  it("should create actions type", () => {
    expect(REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS).toEqual("REQUEST_GET_JOB_SEARCH_TEXT_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_HIDE_ADJUDICATOR).toEqual("REQUEST_HIDE_ADJUDICATOR");
  });
  it("should create actions type", () => {
    expect(REQUEST_SCANNED_TYPE).toEqual("REQUEST_SCANNED_TYPE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SCANNED_IMAGE_MODAL).toEqual("REQUEST_SCANNED_IMAGE_MODAL");
  });
  it("should create actions type", () => {
    expect(REQUEST_HIDE_MODAL).toEqual("REQUEST_HIDE_MODAL");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_SUD_SUCCESS).toEqual("REQUEST_SAVE_SUD_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_SUD).toEqual("REQUEST_SAVE_SUD");
  });
  it("should create actions type", () => {
    expect(REQUEST_HISTORY_SORT).toEqual("REQUEST_HISTORY_SORT");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS).toEqual("REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE).toEqual("REQUEST_SAVE_LIVESCAN_FINGERPRINTS_RESUMABLE");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_LIVESCAN_FINGERPRINTS).toEqual("REQUEST_SAVE_LIVESCAN_FINGERPRINTS");
  });
  it("should create actions type", () => {
    expect(REQUEST_IMPORT_IMAGE).toEqual("REQUEST_IMPORT_IMAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_INPUT_FIELD_CHANGED).toEqual("REQUEST_INPUT_FIELD_CHANGED");
  });
  it("should create actions type", () => {
    expect(REQUEST_INPUT_FIELD_CHANGED_FAILED).toEqual("REQUEST_INPUT_FIELD_CHANGED_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_JOB_AUDIT_LOGS).toEqual("REQUEST_JOB_AUDIT_LOGS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_LATENT_EDITED_IMAGE).toEqual("REQUEST_SAVE_LATENT_EDITED_IMAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_JOB_AUDIT_LOGS_SUCESS).toEqual("REQUEST_JOB_AUDIT_LOGS_SUCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_CARD_SCAN_BOXES).toEqual("REQUEST_SAVE_CARD_SCAN_BOXES");
  });
  it("should create actions type", () => {
    expect(REQUEST_SAVE_ANNOTATIONS).toEqual("REQUEST_SAVE_ANNOTATIONS");
  });
  it("should create actions type", () => {
    expect(REQUEST_RESET_CUSTOM_SEARCH_DATA).toEqual("REQUEST_RESET_CUSTOM_SEARCH_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA).toEqual("REQUEST_REMOVE_TENPRINT__VERIFY_MATCHED_DATA");
  });
  REQUEST_REMOVE_NOTIFICATION
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_JOB).toEqual("REQUEST_REMOVE_JOB");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_FILTER).toEqual("REQUEST_REMOVE_FILTER");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_BIOMETRIC_MUGSHOT).toEqual("REQUEST_REMOVE_BIOMETRIC_MUGSHOT");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_CANON_DATA).toEqual("REQUEST_REMOVE_CANON_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_JOB_FAILED).toEqual("REQUEST_REMOVE_JOB_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_JOB_SUCCESS).toEqual("REQUEST_REMOVE_JOB_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOAD_LIVESCAN).toEqual("REQUEST_LOAD_LIVESCAN");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGIN).toEqual("REQUEST_LOGIN");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGIN_FAILED).toEqual("REQUEST_LOGIN_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGIN_SUCCESS).toEqual("REQUEST_LOGIN_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGOUT).toEqual("REQUEST_LOGOUT");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGOUT_FAILED).toEqual("REQUEST_LOGOUT_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_LOGOUT_SUCCESS).toEqual("REQUEST_LOGOUT_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS).toEqual("REQUEST_NFIQ_QUALITY_THRESHOLD_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_OPEN_JOB).toEqual("REQUEST_OPEN_JOB");
  });
  it("should create actions type", () => {
    expect(REQUEST_PAGE_CHANGED).toEqual("REQUEST_PAGE_CHANGED");
  });
  it("should create actions type", () => {
    expect(REQUEST_PAGE_CHANGED_FAILED).toEqual("REQUEST_PAGE_CHANGED_FAILED");
  });
  it("should create actions type", () => {
    expect(REQUEST_RECEIVED_IMAGE).toEqual("REQUEST_RECEIVED_IMAGE");
  });
  it("should create actions type", () => {
    expect(REQUEST_REMOVE_ANNOTATED_FINGERS).toEqual("REQUEST_REMOVE_ANNOTATED_FINGERS");
  });
  it("should create actions type", () => {
    expect(REQUEST_NEW_ACTION_SUCCESS).toEqual("REQUEST_NEW_ACTION_SUCCESS");
  });
  it("should create actions type", () => {
    expect(REQUEST_MATCHED_PERSON_CHANGED).toEqual("REQUEST_MATCHED_PERSON_CHANGED");
  });
  it("should create actions type", () => {
    expect(REQUEST_MODAL_DATA).toEqual("REQUEST_MODAL_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_MUGSHOT_DATA).toEqual("REQUEST_MUGSHOT_DATA");
  });
  it("should create actions type", () => {
    expect(REQUEST_NEW_ACTION).toEqual("REQUEST_NEW_ACTION");
  });
  it("should create actions type", () => {
    expect(REQUEST_NEW_ACTION_FAILED).toEqual("REQUEST_NEW_ACTION_FAILED");
  });
});
