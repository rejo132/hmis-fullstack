import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import appointmentReducer from './slices/appointmentSlice';
import recordReducer from './slices/recordSlice';
import billReducer from './slices/billingSlice';
import labReducer from './slices/labSlice';
import radiologyReducer from './slices/radiologySlice';
import employeeReducer from './slices/employeeSlice';
import financeReducer from './slices/financeSlice';
import inventoryReducer from './slices/inventorySlice';
import medicationReducer from './slices/medicationSlice';
import sampleReducer from './slices/sampleSlice';
import securityReducer from './slices/securitySlice';
import shiftReducer from './slices/shiftSlice';
import settingsReducer from './slices/settingsSlice';
import userRoleReducer from './slices/userRoleSlice';
import vitalsReducer from './slices/vitalsSlice';
import assetReducer from './slices/assetSlice';
import bedReducer from './slices/bedSlice';
import communicationSettingsReducer from './slices/communicationSettingsSlice';
import themeReducer from './slices/themeSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
    records: recordReducer,
    bills: billReducer,
    labs: labReducer,
    radiology: radiologyReducer,
    employees: employeeReducer,
    finances: financeReducer,
    inventory: inventoryReducer,
    medications: medicationReducer,
    samples: sampleReducer,
    security: securityReducer,
    shifts: shiftReducer,
    settings: settingsReducer,
    userRoles: userRoleReducer,
    vitals: vitalsReducer,
    assets: assetReducer,
    beds: bedReducer,
    communicationSettings: communicationSettingsReducer,
    theme: themeReducer,
  },
});

export default store;