// Simple local database manager for Smart Business Card & PRM
// Using browser persistent LocalStorage as lightweight client-side DB

const DB_PREFIX = 'sbc_db_';

export const SimpleDB = {
  // Collection operations
  getCollection: (name, defaultData = []) => {
    try {
      const data = localStorage.getItem(`${DB_PREFIX}${name}`);
      if (!data) {
        localStorage.setItem(`${DB_PREFIX}${name}`, JSON.stringify(defaultData));
        return defaultData;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error(`DB Error reading collection ${name}:`, e);
      return defaultData;
    }
  },

  setCollection: (name, data) => {
    try {
      localStorage.setItem(`${DB_PREFIX}${name}`, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error(`DB Error writing collection ${name}:`, e);
      return false;
    }
  },

  // Insert a single record
  insert: (collectionName, item) => {
    const list = SimpleDB.getCollection(collectionName);
    const newRecord = {
      ...item,
      id: item.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.push(newRecord);
    SimpleDB.setCollection(collectionName, list);
    return newRecord;
  },

  // Find records matching predicate
  find: (collectionName, predicate) => {
    const list = SimpleDB.getCollection(collectionName);
    return typeof predicate === 'function' ? list.filter(predicate) : list;
  },

  // Find one record
  findOne: (collectionName, predicate) => {
    const list = SimpleDB.getCollection(collectionName);
    return list.find(predicate) || null;
  },

  // Update a record by ID
  updateById: (collectionName, id, updates) => {
    const list = SimpleDB.getCollection(collectionName);
    const index = list.findIndex(r => r.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    SimpleDB.setCollection(collectionName, list);
    return list[index];
  },

  // Delete a record by ID
  deleteById: (collectionName, id) => {
    const list = SimpleDB.getCollection(collectionName);
    const filtered = list.filter(r => r.id !== id);
    SimpleDB.setCollection(collectionName, filtered);
    return filtered.length < list.length;
  }
};

export default SimpleDB;
