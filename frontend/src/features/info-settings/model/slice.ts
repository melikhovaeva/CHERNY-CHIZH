import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { INFO_SETTINGS_SECTION, type InfoSettingsSection } from './types';

type InfoSettingsUiState = {
  activeSection: InfoSettingsSection;
};

const initialState: InfoSettingsUiState = {
  activeSection: INFO_SETTINGS_SECTION.INFO,
};

export const infoSettingsUiSlice = createSlice({
  name: 'infoSettingsUi',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<InfoSettingsSection>) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection } = infoSettingsUiSlice.actions;

export const selectInfoSettingsActiveSection = (state: {
  infoSettingsUi: InfoSettingsUiState;
}) => state.infoSettingsUi.activeSection;
