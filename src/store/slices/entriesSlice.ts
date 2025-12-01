import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DiaryEntry } from '../../models';

interface EntriesState {
  entries: DiaryEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: EntriesState = {
  entries: [],
  loading: false,
  error: null,
};

const entriesSlice = createSlice({
  name: 'entries',
  initialState,
  reducers: {
    addEntry: (state, action: PayloadAction<DiaryEntry>) => {
      state.entries.unshift(action.payload);
    },
    setEntries: (state, action: PayloadAction<DiaryEntry[]>) => {
      state.entries = action.payload;
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter(
        entry => entry.id !== action.payload,
      );
    },
    updateEntry: (state, action: PayloadAction<DiaryEntry>) => {
      const index = state.entries.findIndex(
        entry => entry.id === action.payload.id,
      );
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addEntry,
  setEntries,
  deleteEntry,
  updateEntry,
  setLoading,
  setError,
} = entriesSlice.actions;

export default entriesSlice.reducer;
