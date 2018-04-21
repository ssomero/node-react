/* eslint-disable import/no-extraneous-dependencies, no-proto, consistent-return  */
const methods = require('methods');
const TestAgent = require('supertest').agent;
const app = require('../src/app');

function Agent(application) {
  TestAgent.call(this, application);
  this.token = null;
}

Agent.prototype.__proto__ = TestAgent.prototype;

methods.forEach((method) => {
  Agent.prototype[method] = function doRequest(url, fn) {
    const apiUrl = url;

    const req = TestAgent.prototype[method].call(this, apiUrl, fn);

    if (this.token) {
      req.set('Authorization', `Bearer ${this.token}`);
    }

    return req.expect((res) => {
      if (res.status === 204) { return; }
      if (res.type !== 'application/json') {
        return `All API endpoints must return a valid JSON or 204. Content type: ${res.type}`;
      }
    });
  };
});

Agent.prototype.del = Agent.prototype.delete;

module.exports = () => new Agent(app.listen());
