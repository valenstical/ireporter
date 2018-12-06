import chai from 'chai';

import config from '../app/utils/config';

import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));

describe('API endpoints for delete request of specific incident', () => {


  it('should delete red-flag record with valid id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/8')
      .then((res) => {
        expect(res).to.have.status(config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(8);
        expect(res.body.data[0].message).to.equal('red-flag record has been deleted');
      });
  });


  it('should send error message when no incident has the specified id', () => {
    chai.request(app)
      .delete('/api/v1/red-flags/-1')
      .then((res) => {
        expect(res).to.have.status(config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(config.STATUS_NOT_FOUND);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal('There is no red-flag record with that id. Please check the id then try again');
      });
  });
});
