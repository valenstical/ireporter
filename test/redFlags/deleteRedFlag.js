/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Constants from '../../app/utils/constants';
import app from '../../app/server';
import Database from '../../app/utils/database';

const { expect } = chai;

chai.use(chaiHttp);


const credentials = Object.assign({}, Constants.TEST_DUMMY_USER);
const incident = Object.assign({}, Constants.TEST_DUMMY_INCIDENT);
let route;
const baseRoute = '/api/v1/red-flags';
let token;

describe('Delete red-flag record API', () => {
  before((done) => {
    route = `${baseRoute}/${incident.id}`;
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        Database.createIncident(incident, () => {
          done();
        });
      });
    });
  });
  it('should delete red-flag record with the specified id', (done) => {
    chai.request(app)
      .delete(route)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_OK);
        expect(res.body).to.have.property('data').to.be.an('array');
        done(err);
      });
  });
  it('should return error if no authorization token is provided', (done) => {
    chai.request(app)
      .delete(route)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_UNATHORIZED);
        done(err);
      });
  });
  it('should return error if authorization token is invalid', (done) => {
    chai.request(app)
      .delete(route)
      .set('authorization', 'Bearer INVALID_TOKEN')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_UNATHORIZED);
        done(err);
      });
  });
  it('should return error if authorization token is valid but user does not exists', (done) => {
    chai.request(app)
      .delete(route)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDU5MDgzOTEsImV4cCI6MTU0NjUxMzE5MX0.SsdCpQAuIUzucULGyxmkHCtwE5XHHoB0mD8GUiBlhkM')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_UNATHORIZED);
        done(err);
      });
  });
  it('should return error if red-flag id is not a number', (done) => {
    chai.request(app)
      .delete(`${baseRoute}/NOT_A_NUMBER`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_INVALID_ID);
        done(err);
      });
  });
  it('should return error if red-flag id is not 9 digts', (done) => {
    chai.request(app)
      .delete(`${baseRoute}/1234567899`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_OUT_OF_RANGE);
        done(err);
      });
  });
  it('should return error if there is no red-flag record with the specified id', (done) => {
    chai.request(app)
      .delete(`${baseRoute}/000000000`)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('You do not have any red-flag record with that id');
        done(err);
      });
  });
});

describe('Delete red-flag record API', () => {
  before((done) => {
    incident.status = 'resolved';
    route = `${baseRoute}/${incident.id}`;
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        Database.createIncident(incident, () => {
          done();
        });
      });
    });
  });
  it('should return error if red-flag status is not in draft mode', (done) => {
    chai.request(app)
      .delete(route)
      .set('authorization', `Bearer ${token}`)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('You can no longer alter this red-flag record because it is no longer in draft mode.');
        done(err);
      });
  });
});
