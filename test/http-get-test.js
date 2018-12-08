import chai from 'chai';

import config from '../app/utils/config';

import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));


describe('API endpoints for get requests', () => {
  it('should get list of all incidents as an array with a 200 status code', () => {
    chai.request(app)
      .get('/api/v1/red-flags')
      .then((res) => {
        expect(res).to.have.status(config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
      });
  });

  it('should get a specific incident with id 9', () => {
    chai.request(app)
      .get('/api/v1/red-flags/9')
      .then((res) => {
        expect(res).to.have.status(config.STATUS_OK);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
      });
  });

  it('should return 404 not found error for invalid incident id', () => {
    chai.request(app)
      .get('/api/v1/red-flags/INVALID_ID')
      .then((res) => {
        expect(res).to.have.status(config.STATUS_UNPROCESSED);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(config.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.an('string');
      });
  });
});
