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
const baseRoute = '/api/v1/interventions/';
let token;

describe('Patch intervention record status', () => {
  before((done) => {
    route = `${baseRoute}/${incident.id}/status`;
    incident.type = Constants.INCIDENT_TYPE_INTERVENTION;
    credentials.isAdmin = true;
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        Database.createIncident(incident, () => {
          done();
        });
      });
    });
  });
  it('should update status of intervention record with the specified id', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
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
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
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
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
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
  it('should return error if authorization token is valid but user does not exists or user is not admin', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI3MDc1NDI5MywiaWF0IjoxNTQ2NTM0Njg0LCJleHAiOjE1NDcxMzk0ODR9.WiWQw1_OC0niM-NxSvFv5gaIP73nbJ3Cqco1fZTYOHY')
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_UNATHORIZED);
        done(err);
      });
  });

  it('should return error if intervention id is not a number', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/NOT_A_NUMBER/status`)
      .set('authorization', `Bearer ${token}`)
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_INVALID_ID);
        done(err);
      });
  });
  it('should return error if intervention id is not 9 digts long', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/1234567899/status`)
      .set('authorization', `Bearer ${token}`)
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_OUT_OF_RANGE);
        done(err);
      });
  });
  it('should return error if there is no intervention record with the specified id', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/000000000/status`)
      .set('authorization', `Bearer ${token}`)
      .send({ status: Constants.INCIDENT_STATUS_RESOLVED })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('There is no intervention record with that id');
        done(err);
      });
  });
  it('should return error if status is not provided', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send({ status: '' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_EMPTY_STATUS);
        done(err);
      });
  });
  it('should return error if status is invalid', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send({ status: 'INVALID_STATUS' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_DATA_STATUS);
        done(err);
      });
  });
});
