declare module 'react-native-push-notification' {
  export interface PushNotificationObject {
    /* The identifier of the notification */
    id?: string;
    /* The title of the notification */
    title?: string;
    /* The message displayed in the notification */
    message?: string;
    /* A sound to play when the notification is shown */
    soundName?: string;
    /* Channel ID (Android only) */
    channelId?: string;
    /* If true, the notification plays a sound */
    playSound?: boolean;
    /* Date for scheduling a notification */
    date?: Date;
    /* For Android, allow notification when app is in idle state */
    allowWhileIdle?: boolean;
    /* Complete the notification on iOS - only required when receiving notifications */
    finish?: (fetchResult: string) => void;
  }

  export interface LocalNotificationObject {
    /* The identifier of the notification */
    id?: string;
    /* The title of the notification */
    title?: string;
    /* The message displayed in the notification */
    message?: string;
    /* A sound to play when the notification is shown */
    soundName?: string;
    /* Channel ID (Android only) */
    channelId?: string;
    /* If true, the notification plays a sound */
    playSound?: boolean;
    /* For Android, allow notification when app is in idle state */
    allowWhileIdle?: boolean;
  }

  export interface ScheduleNotificationObject extends LocalNotificationObject {
    /* Date for scheduling a notification */
    date: Date;
  }

  export interface ChannelObject {
    /* The ID of the channel */
    channelId: string;
    /* The name of the channel */
    channelName: string;
    /* The description of the channel */
    channelDescription?: string;
    /* If true, the notification plays a sound */
    playSound?: boolean;
    /* A sound to play when the notification is shown */
    soundName?: string;
    /* The importance of the notification */
    importance?: number;
    /* If true, the notification vibrates */
    vibrate?: boolean;
  }

  export interface PushNotificationStatic {
    configure(options: {
      onNotification?: (notification: PushNotificationObject) => void;
      popInitialNotification?: boolean;
      requestPermissions?: boolean;
    }): void;
    
    createChannel(
      channel: ChannelObject,
      callback?: (created: boolean) => void
    ): void;
    
    localNotification(details: LocalNotificationObject): void;
    
    localNotificationSchedule(details: ScheduleNotificationObject): void;
    
    cancelAllLocalNotifications(): void;
  }

  const PushNotification: PushNotificationStatic;
  export default PushNotification;
}

declare module 'react-native-background-timer' {
  export function start(delay?: number): void;
  export function stop(): void;
  export function setTimeout(callback: () => void, timeout: number): number;
  export function clearTimeout(timeoutId: number): void;
  export function setInterval(callback: () => void, timeout: number): number;
  export function clearInterval(intervalId: number): void;
  export function runBackgroundTimer(callback: () => void, delay: number): void;
  export function stopBackgroundTimer(): void;
}

declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(
      statement: string, 
      params?: any[]
    ): Promise<[SQLResultSet]>;
    transaction(
      fn: (tx: SQLTransaction) => void
    ): Promise<void>;
    readTransaction(
      fn: (tx: SQLTransaction) => void
    ): Promise<void>;
    close(): Promise<void>;
  }

  export interface SQLTransaction {
    executeSql(
      statement: string, 
      params?: any[], 
      success?: SQLStatementCallback, 
      error?: SQLStatementErrorCallback
    ): void;
  }

  export interface SQLResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: SQLResultSetRowList;
  }

  export interface SQLResultSetRowList {
    length: number;
    item(index: number): any;
  }

  type SQLStatementCallback = (
    transaction: SQLTransaction, 
    resultSet: SQLResultSet
  ) => void;

  type SQLStatementErrorCallback = (
    transaction: SQLTransaction, 
    error: Error
  ) => boolean;

  export interface SQLiteDBParams {
    name: string;
    location?: string;
    createFromLocation?: number | string;
  }

  const SQLite: {
    openDatabase(
      params: SQLiteDBParams
    ): Promise<SQLiteDatabase>;
    deleteDatabase(
      params: SQLiteDBParams
    ): Promise<void>;
    enablePromise(enabled: boolean): void;
  };

  export default SQLite;
}
