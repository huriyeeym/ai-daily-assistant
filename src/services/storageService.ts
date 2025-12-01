import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryEntry } from '../models';
import { STORAGE_KEYS } from '../constants';

class StorageService {
  async saveEntries(entries: DiaryEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving entries:', error);
      throw new Error('Failed to save entries');
    }
  }

  async getEntries(): Promise<DiaryEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading entries:', error);
      return [];
    }
  }

  async addEntry(entry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      entries.unshift(entry);
      await this.saveEntries(entries);
    } catch (error) {
      console.error('Error adding entry:', error);
      throw new Error('Failed to add entry');
    }
  }

  async deleteEntry(id: string): Promise<void> {
    try {
      const entries = await this.getEntries();
      const filtered = entries.filter(entry => entry.id !== id);
      await this.saveEntries(filtered);
    } catch (error) {
      console.error('Error deleting entry:', error);
      throw new Error('Failed to delete entry');
    }
  }

  async updateEntry(updatedEntry: DiaryEntry): Promise<void> {
    try {
      const entries = await this.getEntries();
      const index = entries.findIndex(entry => entry.id === updatedEntry.id);
      if (index !== -1) {
        entries[index] = updatedEntry;
        await this.saveEntries(entries);
      }
    } catch (error) {
      console.error('Error updating entry:', error);
      throw new Error('Failed to update entry');
    }
  }

  async clearAllEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.ENTRIES);
    } catch (error) {
      console.error('Error clearing entries:', error);
      throw new Error('Failed to clear entries');
    }
  }

  async saveThemePreference(isDark: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  }

  async getThemePreference(): Promise<boolean> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      return data ? JSON.parse(data) : false;
    } catch (error) {
      console.error('Error loading theme preference:', error);
      return false;
    }
  }
}

export default new StorageService();
