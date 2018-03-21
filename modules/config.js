module.exports = {
  storage: {
    host: 'localhost',
    port: 3306,
    name: 'demo-panel',
    user: 'user',
    pass: 'pass'
  },
  httpApi: {
    port: 8080
  },
  salt: 'LKJHkjahki89712gyia',
  tokenSecret: 'KLJakj88912uiiuas781g324as',
  messages: {
    errors: {
      parse: {
        INVALID_JSON: 'Invalid JSON',
        INVALID_TOKEN: 'Invalid token'
      },
      validate: {
        EMPTY_USER_NAME: 'Empty user name',
        EMPTY_USER_PASSWORD: 'Empty user password',
        EMPTY_TASK_TITLE: 'Empty task title',
        EMPTY_TASK_BODY: 'Empty task body',
        INVALID_ALLOWED_USER_IDS_LIST: 'Invalid list of allowed user ids',
        UNKNOWN_KEY: 'Unknown key',
        INVALID_TASK_ID: 'Invalid task id'
      },
      storage: {
        DB_ERROR: 'Internal server error',
        USER_ALREADY_EXISTS: 'User already exists',
        USER_NOT_FOUND: 'User not found',
        WRONG_PASSWORD: 'Wrong password',
        TASK_NOT_FOUND: 'Task not found',
        ACCESS_DENIED: 'Access denied'
      }
    }
  }
};
