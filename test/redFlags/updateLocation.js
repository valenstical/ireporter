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
let location;
let route;
const baseRoute = '/api/v1/red-flags/';
let token;

describe('Patch red-flag record location', () => {
  beforeEach((done) => {
    location = Object.assign({}, Constants.TEST_DUMMY_LOCATION);
    done();
  });
  before((done) => {
    route = `${baseRoute}/${incident.id}/location`;
    Database.createUser(credentials, (authToken) => {
      token = authToken;
      Database.createIncident(incident, () => {
        done();
      });
    });
  });
  after((done) => {
    Database.deleteUser(credentials.email, () => {
      Database.deleteIncident(incident, () => {
        done();
      });
    });
  });
  it('should update location of red-flag record with the specified id', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
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
      .patch(route)
      .send(location)
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
      .patch(route)
      .set('authorization', 'Bearer INVALID_TOKEN')
      .send(location)
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
      .patch(route)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1NDU5MDgzOTEsImV4cCI6MTU0NjUxMzE5MX0.SsdCpQAuIUzucULGyxmkHCtwE5XHHoB0mD8GUiBlhkM')
      .send(location)
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
      .patch(`${baseRoute}/NOT_A_NUMBER/location`)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_INVALID_ID);
        done(err);
      });
  });
  it('should return error if red-flag id is not 9 digts long', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/1234567899/location`)
      .set('authorization', `Bearer ${token}`)
      .send(location)
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
      .patch(`${baseRoute}/000000000/location`)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('You do not have any red-flag record with that id');
        done(err);
      });
  });
  it('should return error if longitude is not provided', (done) => {
    location.longitude = '';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_LONGITUDE);
        done(err);
      });
  });
  it('should return error if longitude is invalid', (done) => {
    location.longitude = 'INVALILD_LONGITUDE';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_LOCATION);
        done(err);
      });
  });
  it('should return error if latitude is not provided', (done) => {
    location.latitude = '';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_LATITUDE);
        done(err);
      });
  });
  it('should return error if latitude is invalid', (done) => {
    location.latitude = 'INVALILD_LATITUDE';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_LOCATION);
        done(err);
      });
  });
});

describe('Patch red-flag record location', () => {
  beforeEach((done) => {
    location = Object.assign({}, Constants.TEST_DUMMY_LOCATION);
    done();
  });
  before((done) => {
    incident.status = 'resolved';
    route = `${baseRoute}/${incident.id}/location`;
    Database.createUser(credentials, (authToken) => {
      token = authToken;
      Database.createIncident(incident, () => {
        done();
      });
    });
  });
  after((done) => {
    Database.deleteUser(credentials.email, () => {
      Database.deleteIncident(incident, () => {
        done();
      });
    });
  });
  it('should return error if the status of the red-flag record is not "draft"', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(location)
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
