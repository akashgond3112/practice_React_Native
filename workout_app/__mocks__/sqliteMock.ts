/**
 * Mock for react-native-sqlite-storage
 */
const openDatabase = jest.fn().mockImplementation(() => {
  return {
    transaction: jest.fn(),
    readTransaction: jest.fn(),
    executeSql: jest.fn(),
    close: jest.fn().mockResolvedValue(true),
  };
});

const SQLite = {
  DEBUG: jest.fn(),
  enablePromise: jest.fn((enabled: boolean) => {}),
  openDatabase: openDatabase,
};

export default SQLite;
