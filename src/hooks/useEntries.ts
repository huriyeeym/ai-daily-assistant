import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addEntry, setEntries, deleteEntry as deleteEntryAction, setLoading } from '../store/slices/entriesSlice';
import storageService from '../services/storageService';
import { DiaryEntry } from '../models';

export const useEntries = () => {
  const dispatch = useAppDispatch();
  const { entries, loading } = useAppSelector(state => state.entries);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    dispatch(setLoading(true));
    try {
      const loadedEntries = await storageService.getEntries();
      dispatch(setEntries(loadedEntries));
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const saveEntry = async (entry: DiaryEntry) => {
    try {
      await storageService.addEntry(entry);
      dispatch(addEntry(entry));
    } catch (error) {
      console.error('Error saving entry:', error);
      throw error;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      await storageService.deleteEntry(id);
      dispatch(deleteEntryAction(id));
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw error;
    }
  };

  return {
    entries,
    loading,
    saveEntry,
    deleteEntry,
    refreshEntries: loadEntries,
  };
};
