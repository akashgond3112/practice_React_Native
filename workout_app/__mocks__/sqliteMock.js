/**
 * Mock for react-native-sqlite-storage
 */
const openDatabase = jest.fn((dbName, version, displayName, size, callback) => {
  return {
    transaction: jest.fn((txFunction, errorCallback, successCallback) => {
      const tx = {
        executeSql: jest.fn((query, args, successCallback, errorCallback) => {
          // Mock default success
          const actualArgs = args || [];
          if (successCallback) {
            successCallback(tx, { rows: { length: 0, item: jest.fn(), _array: [] }, rowsAffected: 0, insertId: 1 });
          }
        }),
      };
      txFunction(tx);
      if (successCallback) {
        successCallback();
      }
    }),
    readTransaction: jest.fn((txFunction, errorCallback, successCallback) => {
      const tx = {
        executeSql: jest.fn((query, args, successCallback, errorCallback) => {
          // Mock default success
          const actualArgs = args || [];
          if (successCallback) {
            successCallback(tx, { rows: { length: 0, item: jest.fn(), _array: [] }, rowsAffected: 0, insertId: 1 });
          }
        }),
      };
      txFunction(tx);
      if (successCallback) {
        successCallback();
      }
    }),
    close: jest.fn((successCallback, errorCallback) => {
      if (successCallback) {
        successCallback();
      }
    }),
  };
});

// Export SQLite module
export default {
  openDatabase,
  DEBUG: false,
  enablePromise: jest.fn(),
};
