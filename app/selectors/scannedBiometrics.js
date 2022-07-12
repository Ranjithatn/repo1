import { createSelector } from "reselect";
export const showSelectedBiometricsSelector = createSelector (
    state => state.scannedBiometrics.showBiometrics,
    showBiometrics => showBiometrics
  );
export const showBiometricsMugshot = createSelector (
    state => state.scannedBiometrics.biometricMugshot,
    biometricMugshot => biometricMugshot
  );
  