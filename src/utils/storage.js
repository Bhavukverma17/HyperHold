import AsyncStorage from '@react-native-async-storage/async-storage';
import { extractDomain, getFaviconUrl, generateId } from './helpers';

const STORAGE_KEYS = {
  LINKS: 'hyperhold_links',
  CATEGORIES: 'hyperhold_categories',
  SETTINGS: 'hyperhold_settings',
};

// Helper functions
const getItem = async (key, defaultValue = null) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key}:`, error);
    return defaultValue;
  }
};

const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting item ${key}:`, error);
    throw error;
  }
};

// Links management
export const saveLink = async (link) => {
  try {
    const links = await getItem(STORAGE_KEYS.LINKS, []);
    const existingIndex = links.findIndex(l => l.id === link.id);
    
    if (existingIndex >= 0) {
      links[existingIndex] = link;
    } else {
      links.unshift(link); // Add to beginning
    }
    
    await setItem(STORAGE_KEYS.LINKS, links);
    console.log('Link saved successfully:', link.id);
  } catch (error) {
    console.error('Save link error:', error);
    throw error;
  }
};

export const getLinks = async (category = null) => {
  try {
    const links = await getItem(STORAGE_KEYS.LINKS, []);
    
    if (category && category !== 'all') {
      return links.filter(link => link.category === category);
    }
    
    return links;
  } catch (error) {
    console.error('Get links error:', error);
    throw error;
  }
};

export const searchLinks = async (query) => {
  try {
    const links = await getItem(STORAGE_KEYS.LINKS, []);
    const searchTerm = query.toLowerCase();
    
    return links.filter(link => 
      link.title.toLowerCase().includes(searchTerm) ||
      link.domain.toLowerCase().includes(searchTerm) ||
      (link.description && link.description.toLowerCase().includes(searchTerm))
    );
  } catch (error) {
    console.error('Search links error:', error);
    throw error;
  }
};

export const deleteLink = async (id) => {
  try {
    const links = await getItem(STORAGE_KEYS.LINKS, []);
    const filteredLinks = links.filter(link => link.id !== id);
    await setItem(STORAGE_KEYS.LINKS, filteredLinks);
  } catch (error) {
    console.error('Delete link error:', error);
    throw error;
  }
};

// Categories management
export const getCategories = async () => {
  try {
    const categories = await getItem(STORAGE_KEYS.CATEGORIES, []);
    
    // Return default categories if none exist
    if (categories.length === 0) {
      const defaultCategories = [
        { id: 'all', name: 'All', color: '#007AFF', isDefault: true },
        { id: 'development', name: 'Development', color: '#FF9500', isDefault: true },
        { id: 'news', name: 'News', color: '#FF3B30', isDefault: true },
        { id: 'tutorials', name: 'Tutorials', color: '#34C759', isDefault: true },
        { id: 'design', name: 'Design', color: '#AF52DE', isDefault: true },
      ];
      await setItem(STORAGE_KEYS.CATEGORIES, defaultCategories);
      return defaultCategories;
    }
    
    return categories;
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

export const saveCategory = async (category) => {
  try {
    const categories = await getItem(STORAGE_KEYS.CATEGORIES, []);
    const existingIndex = categories.findIndex(c => c.id === category.id);
    
    if (existingIndex >= 0) {
      categories[existingIndex] = category;
    } else {
      categories.push(category);
    }
    
    await setItem(STORAGE_KEYS.CATEGORIES, categories);
  } catch (error) {
    console.error('Save category error:', error);
    throw error;
  }
};

// Settings management
export const getSettings = async () => {
  try {
    const settings = await getItem(STORAGE_KEYS.SETTINGS, {
      darkMode: 'system',
      appLock: false,
      biometricAuth: false,
    });
    return settings;
  } catch (error) {
    console.error('Get settings error:', error);
    throw error;
  }
};

export const updateSetting = async (key, value) => {
  try {
    const settings = await getSettings();
    settings[key] = value;
    await setItem(STORAGE_KEYS.SETTINGS, settings);
  } catch (error) {
    console.error('Update setting error:', error);
    throw error;
  }
};

// Initialize storage (optional, for compatibility)
export const initStorage = async () => {
  try {
    console.log('Initializing AsyncStorage...');
    // Ensure default data exists
    await getCategories();
    await getSettings();
    console.log('AsyncStorage initialized successfully');
  } catch (error) {
    console.error('Storage initialization error:', error);
    throw error;
  }
}; 