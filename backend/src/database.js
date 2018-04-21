const Sequelize = require('sequelize');
const config = require('../src/config')[process.env.NODE_ENV];

/** INIT DATABASE * */

const sequelize = (config.use_env_variable)
  ? new Sequelize(config.use_env_variable, config)
  : new Sequelize(config);

const Greeting = sequelize.define('greetings', {
  message: Sequelize.TEXT,
}, {
  timestamps: true,
  instanceMethods: {
    async toJSON() {
      return {
        // Id and timestamps are generated automatically
        id: this.id,
        createdAt: this.createdAt,

        // Message was added on the POST request
        message: this.message,
      };
    },
  },
});

exports.sync = options => sequelize.sync(options);

exports.Greeting = Greeting;
