const
  mysql = require('mysql'),
  EventEmitter = require('events').EventEmitter,
  util = require('util')
  ;

const StorageManager = function (system) {
  this.system = system;
  let config = system.config.storage;
  this.pool = mysql.createPool({
    connectionLimit: 50,
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.name,
    port: config.port,
    multipleStatements: true
  });

};

util.inherits(StorageManager, EventEmitter);

/**
 * Signup a user
 * @async
 * @param {string} name
 * @param {string} password
 * @returns {Promise<number>}
 */
StorageManager.prototype.userSignup = function (name, password) {
  return new Promise((resolve, reject) => {
    let query = `
      INSERT INTO
        users
      SET
        name = ${mysql.escape(name)},
        password = MD5(${mysql.escape(password + this.system.config.salt)})
      ;`;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        resolve(rows.insertId);
      } else {
        error = (error.code == 'ER_DUP_ENTRY')
          ? this.system.config.messages.errors.storage.USER_ALREADY_EXISTS
          : this.system.config.messages.errors.storage.DB_ERROR;
        reject(error);
      }
    });
  });
};

/**
 * Signup a user
 * @async
 * @param {string} name
 * @param {string} password
 * @returns {Promise<number>}
 */
StorageManager.prototype.userLogin = function (name, password) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT
        id, password, MD5(${mysql.escape(password + this.system.config.salt)}) AS password2
      FROM
        users
      WHERE
        name = ${mysql.escape(name)}
      ;`;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        if (rows.length === 0) {
          reject(this.system.config.messages.errors.storage.USER_NOT_FOUND);
        } else if (rows[0].password !== rows[0].password2) {
          reject(this.system.config.messages.errors.storage.WRONG_PASSWORD);
        } else {
          resolve(rows[0].id);
        }
      } else {
        reject(this.system.config.messages.errors.storage.DB_ERROR);
      }
    });
  });
};

/**
 * @typedef Task
 * @property {number=} id
 * @property {string} title
 * @property {string} body
 * @property {number=} authorId
 * @property {number[]} allowedUserIds
 */

/**
 * Get tasks avaiable for user
 * @async
 * @param {number} userId
 * @returns {Promise<Task[]>}
 */
StorageManager.prototype.tasksGet = function (userId) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT
        tasks.id, tasks.authorId, tasks.title, tasks.body, GROUP_CONCAT(DISTINCT tasks_permissions.users_id) AS allowedUserIds
      FROM
        tasks LEFT JOIN tasks_permissions ON tasks.id = tasks_permissions.tasks_id
      WHERE
        (tasks.authorId = ${mysql.escape(userId)} || tasks_permissions.users_id = ${mysql.escape(userId)})
      GROUP BY tasks.id;
      ;`;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        for (let i = 0, qty = rows.length; i < qty; i++) {
          rows[i].allowedUserIds = rows[i].allowedUserIds ? rows[i].allowedUserIds.split(',').map((el) => +el) : [];
        }
        resolve(rows);
      } else {
        reject(this.system.config.messages.errors.storage.DB_ERROR);
      }
    });
  });
};

/**
 * Get task by id
 * @async
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise<Task>}
 */
StorageManager.prototype.taskGet = function (taskId, userId) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT id FROM tasks WHERE id = ${mysql.escape(taskId)};
      SELECT
        tasks.id, tasks.authorId, tasks.title, tasks.body, GROUP_CONCAT(DISTINCT tasks_permissions.users_id) AS allowedUserIds
      FROM
        tasks LEFT JOIN tasks_permissions ON tasks.id = tasks_permissions.tasks_id
      WHERE
        (tasks.id = ${mysql.escape(taskId)}) AND
        (tasks.authorId = ${mysql.escape(userId)} || tasks_permissions.users_id = ${mysql.escape(userId)})
      GROUP BY tasks.id;
      ;`;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        if (rows[0].length === 0) {
          reject(this.system.config.messages.errors.storage.TASK_NOT_FOUND);
        } else if (rows[1].length === 0) {
          reject(this.system.config.messages.errors.storage.ACCESS_DENIED);
        } else {
          rows[1][0].allowedUserIds = rows[1][0].allowedUserIds ? rows[1][0].allowedUserIds.split(',').map((el) => +el) : [];
          resolve(rows[1][0]);
        }
      } else {
        reject(this.system.config.messages.errors.storage.DB_ERROR);
      }
    });
  });
};


/**
 * Update a task
 * @async
 * @param {Task} task
 * @param {number} userId
 * @returns {Promise}
 */
StorageManager.prototype.taskUpdate = function (task, userId) {
  return this._checkTask(task.id, userId)
    .then(() => new Promise((resolve, reject) => {
      let query = `
        START TRANSACTION;
        UPDATE
          tasks
        SET
          ${['title', 'body'].map(name => task[name] ? `${name} = ${mysql.escape(task[name])},` : '').join('')}
          dtUpdate = NOW()
        WHERE
          (tasks.id = ${mysql.escape(task.id)}) AND
          (tasks.authorId = ${mysql.escape(userId)});
        ${task.allowedUserIds ? `DELETE FROM tasks_permissions WHERE tasks_id = ${mysql.escape(task.id)};` : ''}
        ${task.allowedUserIds ? task.allowedUserIds.map(id => `INSERT INTO tasks_permissions SET tasks_id = ${mysql.escape(task.id)}, users_id = ${mysql.escape(id)};`).join('\n') : ''}
        COMMIT;
      ;`;

      this._runQuery(query, (error) => {
        if (!error) {
          resolve();
        } else {
          reject(this.system.config.messages.errors.storage.DB_ERROR);
        }
      });
    }));
};

/**
 * Create a task
 * @async
 * @param {Task} task
 * @param {number} userId
 * @returns {Promise<number>}
 */
StorageManager.prototype.taskCreate = function (task, userId) {
  return new Promise((resolve, reject) => {
    let query = `
        START TRANSACTION;
          INSERT INTO
            tasks
          SET
            title = ${mysql.escape(task.title)},
            body = ${mysql.escape(task.body)},
            authorId = ${mysql.escape(userId)},
            dtCreate = NOW()
          ;
          SET @taskId = LAST_INSERT_ID();
          ${task.allowedUserIds ? task.allowedUserIds.map(id => `INSERT INTO tasks_permissions SET tasks_id = @taskId, users_id = ${mysql.escape(id)};`).join('\n') : ''}
          SELECT @taskId AS taskId;
        COMMIT;
      ;`;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        resolve(rows[rows.length - 2][0].taskId);
      } else {
        reject(this.system.config.messages.errors.storage.DB_ERROR);
      }
    });
  });
};


/**
 * Delete a task
 * @async
 * @param {number} taskId
 * @param {number} userId
 * @returns {Promise}
 */
StorageManager.prototype.taskDelete = function (taskId, userId) {
  return this._checkTask(taskId, userId)
    .then(() => new Promise((resolve, reject) => {
      let query = `
        START TRANSACTION;
          DELETE FROM tasks_permissions WHERE tasks_id = ${mysql.escape(taskId)};
          DELETE FROM tasks WHERE id = ${mysql.escape(taskId)};
        COMMIT;
      `;
      this._runQuery(query, (error) => {
        if (!error) {
          resolve();
        } else {
          reject(this.system.config.messages.errors.storage.DB_ERROR);
        }
      });
    }));
};

/**
 * Check existance and permission for update/delete task
 * @async
 * @param {number} taskId
 * @param {number} userId
 * @private
 * @returns {Promise}
 */
StorageManager.prototype._checkTask = function (taskId, userId) {
  return new Promise((resolve, reject) => {
    let query = `
        SELECT authorId FROM tasks WHERE id = ${mysql.escape(taskId)};
    `;
    this._runQuery(query, (error, rows) => {
      if (!error) {
        if (rows[0].length === 0) {
          reject(this.system.config.messages.errors.storage.TASK_NOT_FOUND);
        } else if (rows[0].authorId !== userId) {
          reject(this.system.config.messages.errors.storage.ACCESS_DENIED);
        } else {
          resolve();
        }
      } else {
        reject(this.system.config.messages.errors.storage.DB_ERROR);
      }
    });
  });
};

/**
 * Close all connections
 */
StorageManager.prototype.stop = function (callback) {
  this.pool.end(callback);
};

/**
 * Emit error event
 */
StorageManager.prototype._emitErrorEvent = function (error, query) {
  this.emit('error', { error: error, query: query });
};

/**
 * Wrapper for connections in pool
 * @param {string} query
 * @param {function} callback
 */
StorageManager.prototype._runQuery = function (query, callback) {
  this.pool.getConnection((error, connection) => {
    if (error) {
      this._emitErrorEvent(error, query);
      if (callback) { callback(error); }
    } else {
      connection.query(query, (error, rows) => {
        connection.release();
        if (error) {
          this._emitErrorEvent(error, query);
        }
        if (callback) { callback(error, rows); }
      }
      );
    }
  });
};

module.exports = StorageManager;
