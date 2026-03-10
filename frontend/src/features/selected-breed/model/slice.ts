import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedBreedSlug: '' as string,
};

export const selectedBreedSlice = createSlice({
  name: 'selectedBreed',
  initialState,
  reducers: {
    setSelectedBreed: (state, action: { payload: string }) => {
      state.selectedBreedSlug = action.payload;
    },
  },
});

export const { setSelectedBreed } = selectedBreedSlice.actions;

export const selectSelectedBreedSlug = (state: {
  selectedBreed: { selectedBreedSlug: string };
}) => state.selectedBreed.selectedBreedSlug;

