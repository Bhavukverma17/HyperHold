import * as SQLite from 'expo-sqlite';
import { extractDomain, getFaviconUrl, generateId } from './helpers';

let db = null;

const initDatabaseConnection = async () => {
  try {
    console.log('initDatabaseConnection called, db is:', !!db);
    if (!db) {
      console.log('Opening database connection...');
      db = await SQLite.openDatabaseAsync('hyperhold.db');
      console.log('Database connection established:', !!db);
    }
    return db;
  } catch (error) {
    console.error('Failed to open database:', error);
    // Reset the database connection on error
    db = null;
    throw error;
  }
};

export const initDatabase = async () => {
  try {
    console.log('initDatabase called');
    const database = await initDatabaseConnection();
    
    if (!database) {
      throw new Error('Failed to get database connection');
    }
    
    console.log('Creating tables...');
    
    // Create links table using prepared statement
    const createLinksTable = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS links (
        id TEXT PRIMARY KEY,
        url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        domain TEXT NOT NULL,
        favicon TEXT,
        category TEXT NOT NULL,
        createdAt INTEGER NOT NULL,
        updatedAt INTEGER NOT NULL
      )
    `);
    await createLinksTable.executeAsync();
    await createLinksTable.finalizeAsync();
    console.log('Links table created');

    // Create categories table using prepared statement
    const createCategoriesTable = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        color TEXT NOT NULL,
        isDefault INTEGER NOT NULL
      )
    `);
    await createCategoriesTable.executeAsync();
    await createCategoriesTable.finalizeAsync();
    console.log('Categories table created');

    // Create settings table using prepared statement
    const createSettingsTable = await database.prepareAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
    await createSettingsTable.executeAsync();
    await createSettingsTable.finalizeAsync();
    console.log('Settings table created');

    // Insert default categories
    const defaultCategories = [
      { id: 'all', name: 'All', color: '#007AFF', isDefault: true },
      { id: 'development', name: 'Development', color: '#FF9500', isDefault: true },
      { id: 'news', name: 'News', color: '#FF3B30', isDefault: true },
      { id: 'tutorials', name: 'Tutorials', color: '#34C759', isDefault: true },
      { id: 'design', name: 'Design', color: '#AF52DE', isDefault: true },
    ];

    const insertCategoryStatement = await database.prepareAsync(
      'INSERT OR IGNORE INTO categories (id, name, color, isDefault) VALUES (?, ?, ?, ?)'
    );
    
    for (const category of defaultCategories) {
      await insertCategoryStatement.executeAsync([
        category.id, 
        category.name, 
        category.color, 
        category.isDefault ? 1 : 0
      ]);
    }
    await insertCategoryStatement.finalizeAsync();
    console.log('Default categories inserted');

    // Insert default settings
    const insertSettingsStatement = await database.prepareAsync(
      'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)'
    );
    await insertSettingsStatement.executeAsync(['darkMode', 'system']);
    // <-- FIX: Removed appLock and biometricAuth
    await insertSettingsStatement.finalizeAsync();
    console.log('Default settings inserted');
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    console.error('Error stack:', error.stack);
    // Reset database connection on error
    db = null;
    throw error;
  }
};

export const saveLink = async (link) => {
  try {
    console.log('Starting saveLink with:', link);
    const database = await initDatabaseConnection();
    console.log('Database connection obtained:', !!database);
    
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    console.log('Preparing statement...');
    const statement = await database.prepareAsync(
      `INSERT OR REPLACE INTO links 
       (id, url, title, description, domain, favicon, category, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    console.log('Statement prepared successfully');
    
    const params = [
      link.id,
      link.url,
      link.title,
      link.description || '',
      link.domain,
      link.favicon || '',
      link.category,
      link.createdAt,
      link.updatedAt,
    ];
    console.log('Executing with params:', params);
    
    await statement.executeAsync(params);
    console.log('Statement executed successfully');
    
    await statement.finalizeAsync();
    console.log('Statement finalized successfully');
    console.log('Link saved successfully:', link.id);
  } catch (error) {
    console.error('Save link error:', error);
    console.error('Error stack:', error.stack);
    throw error;
  }
};

export const getLinks = async (category) => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const query = category && category !== 'all'
      ? 'SELECT * FROM links WHERE category = ? ORDER BY updatedAt DESC'
      : 'SELECT * FROM links ORDER BY updatedAt DESC';
    const params = category && category !== 'all' ? [category] : [];

    const statement = await database.prepareAsync(query);
    const result = await statement.executeAsync(params);
    const rows = await result.getAllAsync();
    await statement.finalizeAsync();
    return rows;
  } catch (error) {
    console.error('Get links error:', error);
    throw error;
  }
};

export const searchLinks = async (query) => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync(
      `SELECT * FROM links 
       WHERE title LIKE ? OR domain LIKE ? OR description LIKE ?
       ORDER BY updatedAt DESC`
    );
    const result = await statement.executeAsync([`%${query}%`, `%${query}%`, `%${query}%`]);
    const rows = await result.getAllAsync();
    await statement.finalizeAsync();
    return rows;
  } catch (error) {
    console.error('Search links error:', error);
    throw error;
  }
};

export const deleteLink = async (id) => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync('DELETE FROM links WHERE id = ?');
    await statement.executeAsync([id]);
    await statement.finalizeAsync();
  } catch (error) {
    console.error('Delete link error:', error);
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync('SELECT * FROM categories ORDER BY name');
    const result = await statement.executeAsync();
    const rows = await result.getAllAsync();
    await statement.finalizeAsync();
    return rows.map(row => ({
      ...row,
      isDefault: Boolean(row.isDefault)
    }));
  } catch (error) {
    console.error('Get categories error:', error);
    throw error;
  }
};

export const saveCategory = async (category) => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync(
      'INSERT OR REPLACE INTO categories (id, name, color, isDefault) VALUES (?, ?, ?, ?)'
    );
    await statement.executeAsync([category.id, category.name, category.color, category.isDefault ? 1 : 0]);
    await statement.finalizeAsync();
  } catch (error) {
    console.error('Save category error:', error);
    throw error;
  }
};

export const getSettings = async () => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync('SELECT * FROM settings');
    const result = await statement.executeAsync();
    const rows = await result.getAllAsync();
    await statement.finalizeAsync();
    
    const settings = {
      darkMode: 'system',
      // <-- FIX: Removed appLock and biometricAuth
    };

    rows.forEach((row) => {
      if (row.key === 'darkMode') {
        settings.darkMode = row.value;
      }
      // <-- FIX: Removed appLock and biometricAuth parsing
    });

    return settings;
  } catch (error) {
    console.error('Get settings error:', error);
    throw error;
  }
};

export const updateSetting = async (key, value) => {
  try {
    const database = await initDatabaseConnection();
    if (!database) {
      throw new Error('Database connection not available');
    }
    
    const statement = await database.prepareAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)'
    );
    await statement.executeAsync([key, value]);
    await statement.finalizeAsync();
  } catch (error) {
    console.error('Update setting error:', error);
    throw error;
  }
};