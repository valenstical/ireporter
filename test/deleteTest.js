import chai from 'chai';

import Constants from '../app/utils/constants';

import app from '../app/server';


const { expect } = chai;

chai.use(require('chai-http'));

describe('API endpoints for delete request of specific red-flag record', () => {
  it('should delete red-flag record with valid id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/8')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_NO_CONTENT);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(8);
        expect(res.body.data[0].message).to.equal('red-flag record has been deleted');
      });
  });

  it('should send error message when no red-flag has the specified id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/-1')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_DATA_NOT_FOUND);
      });
  });

  it('should send error message when no for invalid red-flag record id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/INVALID_ID')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal('The red-flag record could not be deleted. The status may have changed or the record no longer exists.');
      });
  });

  it('should send error message when no for invalid red-flag record id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/INVALID_ID')
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_NOT_FOUND);
      });
  });
});
