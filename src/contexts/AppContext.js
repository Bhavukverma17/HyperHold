import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Appearance } from 'react-native';
import { initDatabase as initStorage, saveLink, getLinks, searchLinks as storageSearchLinks, deleteLink as storageDeleteLink, getCategories, saveCategory, getSettings, updateSetting as storageUpdateSetting } from '../utils/database';
import { createLinkFromUrl } from '../utils/helpers';

const initialState = {
  links: [],
  allLinks: [], // <-- FIX: Added master list for all links
  categories: [],
  settings: {
    darkMode: 'system',
    appLock: false,
    biometricAuth: false,
  },
  searchFilters: {
    query: '',
    category: 'all',
  },
  isLoading: true,
  isDarkMode: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_LINKS':
      return { ...state, links: action.payload };
    case 'SET_ALL_LINKS': // <-- FIX: New case for master list
      return { ...state, allLinks: action.payload };
    case 'ADD_LINK':
      return { 
        ...state, 
        links: [action.payload, ...state.links],
        allLinks: [action.payload, ...state.allLinks] // <-- FIX: Add to master list
      };
    case 'UPDATE_LINK':
      return {
        ...state,
        links: state.links.map(link =>
          link.id === action.payload.id ? action.payload : link
        ),
        allLinks: state.allLinks.map(link => // <-- FIX: Update in master list
          link.id === action.payload.id ? action.payload : link
        ),
      };
    case 'DELETE_LINK':
      return {
        ...state,
        links: state.links.filter(link => link.id !== action.payload),
        allLinks: state.allLinks.filter(link => link.id !== action.payload), // <-- FIX: Delete from master list
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTING':
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.key]: action.payload.value,
        },
      };
    case 'SET_SEARCH_FILTERS':
      return { ...state, searchFilters: action.payload };
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      // This listener is for system changes.
      // The actual isDarkMode state is set in initializeApp and updateSetting
      // based on the user's *preference* (light, dark, or system).
      if (state.settings.darkMode === 'system') {
        const isDark = colorScheme === 'dark';
        dispatch({ type: 'SET_DARK_MODE', payload: isDark });
      }
    });
    return () => subscription?.remove();
  }, [state.settings.darkMode]);

  const initializeApp = async () => {
    try {
      console.log('Starting app initialization...');
      dispatch({ type: 'SET_LOADING', payload: true });
      
      console.log('Initializing storage...');
      await initStorage();
      console.log('Storage initialized successfully');
      
      console.log('Loading data...');
      const [links, categories, settings] = await Promise.all([
        getLinks(),
        getCategories(),
        getSettings(),
      ]);
      console.log('Data loaded:', { linksCount: links.length, categoriesCount: categories.length });
      
      dispatch({ type: 'SET_LINKS', payload: links });
      dispatch({ type: 'SET_ALL_LINKS', payload: links }); // <-- FIX: Populate master list
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      const isDark = settings.darkMode === 'dark' || (settings.darkMode === 'system' && Appearance.getColorScheme() === 'dark');
      dispatch({ type: 'SET_DARK_MODE', payload: isDark });
      console.log('App initialization completed successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      console.error('Error stack:', error.stack);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addLink = async (url, title, description, category = 'all') => {
    try {
      console.log('addLink called with:', { url, title, description, category });
      const link = createLinkFromUrl(url, title, description, category);
      console.log('Created link object:', link);
      await saveLink(link);
      console.log('Link saved to storage successfully');
      dispatch({ type: 'ADD_LINK', payload: link });
      console.log('Link added to state successfully');
    } catch (error) {
      console.error('Failed to add link:', error);
      console.error('Error stack:', error.stack);
      throw error;
    }
  };

  const updateLink = async (link) => {
    try {
      const updatedLink = { ...link, updatedAt: Date.now() };
      await saveLink(updatedLink);
      dispatch({ type: 'UPDATE_LINK', payload: updatedLink });
    } catch (error) {
      console.error('Failed to update link:', error);
      throw error;
    }
  };

  const deleteLink = async (id) => {
    try {
      await storageDeleteLink(id);
      dispatch({ type: 'DELETE_LINK', payload: id });
    } catch (error) {
      console.error('Failed to delete link:', error);
      throw error;
    }
  };

  const searchLinks = async (query) => {
    try {
      const results = await storageSearchLinks(query);
      dispatch({ type: 'SET_LINKS', payload: results });
    } catch (error) {
      console.error('Failed to search links:', error);
      throw error;
    }
  };

  const loadLinks = async (category) => {
    try {
      const links = await getLinks(category);
      dispatch({ type: 'SET_LINKS', payload: links });
    } catch (error) {
      console.error('Failed to load links:', error);
      throw error;
    }
  };

  const addCategory = async (category) => {
    try {
      await saveCategory(category);
      dispatch({ type: 'ADD_CATEGORY', payload: category });
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateSetting = async (key, value) => {
    try {
      // Convert boolean to string for database
      const valueToStore = typeof value === 'boolean' ? value.toString() : value;
      await storageUpdateSetting(key, valueToStore);
      dispatch({ type: 'UPDATE_SETTING', payload: { key, value } });
      
      // Update dark mode state if darkMode setting is changed
      if (key === 'darkMode') {
        const isDark = value === 'dark' || (value === 'system' && Appearance.getColorScheme() === 'dark');
        dispatch({ type: 'SET_DARK_MODE', payload: isDark });
      }
    } catch (error) {
      console.error('Failed to update setting:', error);
      throw error;
    }
  };

  const setSearchFilters = (filters) => {
    dispatch({ type: 'SET_SEARCH_FILTERS', payload: filters });
  };

  const value = {
    state,
    addLink,
    updateLink,
    deleteLink,
    searchLinks,
    loadLinks,
    addCategory,
    updateSetting,
    setSearchFilters,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};