const assert = require('assert');

const database = require('../src/database');

const agent = require('./agent')();

describe('Greeting', () => {
  before(async () => {
    await database.sync({ force: true });

    await database.Greeting.bulkCreate([{ message: 'test message' }]);
  });

  it('should return greeting information', async () => {
    const response = await agent.get('/api/greetings').expect(200);

    assert.equal(response.body.results.length, 1);
    assert.equal(response.body.results[0].message, 'test message');
  });
});
