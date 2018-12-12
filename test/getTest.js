import chai from 'chai';

import Constants from '../app/utils/constants';

import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));


describe('API endpoints for get requests to /red-flags/', () => {
  it('should get list of all red-flag as an array with a 200 status code', () => {
    chai.request(app)
      .get('/api/v1/red-flags')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_OK);
        expect(res.body.data).to.be.an('array');
      });
  });

  it('should get a specific red-flag with id 4', () => {
    chai.request(app)
      .get('/api/v1/red-flags/4')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('createdOn');
        expect(res.body.data[0]).to.have.property('createdBy');
        expect(res.body.data[0]).to.have.property('type');
        expect(res.body.data[0]).to.have.property('status');
        expect(res.body.data[0]).to.have.property('Images');
        expect(res.body.data[0]).to.have.property('Videos');
        expect(res.body.data[0]).to.have.property('comment');
      });
  });

  it('should return 422 error for invalid red-flag id', () => {
    chai.request(app)
      .get('/api/v1/red-flags/INVALID_ID')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.an('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_INVALID_ID);
      });
  });
});

it('should return 404 not found error if red-flag does not exist', () => {
  chai.request(app)
    .get('/api/v1/red-flags/-1')
    .then((res) => {
      expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
      expect(res).to.be.json;
      expect(res.body).to.have.property('status');
      expect(res.body).to.have.property('error');
      expect(res.body.status).to.equal(Constants.STATUS_NOT_FOUND);
      expect(res.body.error).to.be.an('string');
      expect(res.body.error).to.equal(Constants.MESSAGE_NOT_FOUND);
    });
});

describe('API endpoints for get requests to /interventions/', () => {
  it('should get list of all incidents as an array with a 200 status code', () => {
    chai.request(app)
      .get('/api/v1/interventions')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_OK);
        expect(res.body.data).to.be.an('array');
      });
  });

  it('should get a specific intervention with id 2', () => {
    chai.request(app)
      .get('/api/v1/interventions/2')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('createdOn');
        expect(res.body.data[0]).to.have.property('createdBy');
        expect(res.body.data[0]).to.have.property('type');
        expect(res.body.data[0]).to.have.property('status');
        expect(res.body.data[0]).to.have.property('Images');
        expect(res.body.data[0]).to.have.property('Videos');
        expect(res.body.data[0]).to.have.property('comment');
      });
  });

  it('should return 422 not found error for invalid intervention id', () => {
    chai.request(app)
      .get('/api/v1/interventions/INVALID_ID')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.equal(Constants.MESSAGE_INVALID_ID);
      });
  });
  it('should return 404 not found error if intervention record does not exist', () => {
    chai.request(app)
      .get('/api/v1/interventions/-1')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Constants.MESSAGE_NOT_FOUND);
      });
  });
});
