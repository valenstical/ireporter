/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Constants from '../../app/utils/constants';
import app from '../../app/server';
import Database from '../../app/utils/database';

const { expect } = chai;

chai.use(chaiHttp);


const credentials = Object.assign({}, Constants.TEST_DUMMY_USER);
let incident;
const route = '/api/v1/interventions';
let token;

describe('Create intervention record API', () => {
  beforeEach((done) => {
    incident = Object.assign({}, {
      longitude: '6.0987456',
      latitude: '3.2098456',
      Images: '',
      Videos: '',
      comment: 'This is the comment',
      title: 'This is the title',
      id: 123456789,
      createdBy: 123456789,
      type: 'intervention',
    });
    done();
  });
  before((done) => {
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        done();
      });
    });
  });
  it('should create a new intervention record with complete input', (done) => {
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_CREATED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_CREATED);
        expect(res.body).to.have.property('data').to.be.an('array').to.have.length(1);
        expect(res.body.data[0]).to.be.an('object').to.not.be.empty;
        expect(res.body.data[0]).to.have.property('id').to.be.a('number');
        expect(res.body.data[0]).to.have.property('message').to.equal('Created intervention record');
        incident.id = res.body.data[0].id;
        done(err);
      });
  });
  it('should return error if no authorization token is provided', (done) => {
    chai.request(app)
      .post(route)
      .send(incident)
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
      .post(route)
      .set('authorization', 'Bearer INVALIDE_TOKEN')
      .send(incident)
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
      .post(route)
      .set('authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjI3MDc1NDI5MywiaWF0IjoxNTQ2NTM0Njg0LCJleHAiOjE1NDcxMzk0ODR9.WiWQw1_OC0niM-NxSvFv5gaIP73nbJ3Cqco1fZTYOHY')
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_UNATHORIZED);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_UNATHORIZED);
        done(err);
      });
  });
  it('should return error if title is not provided', (done) => {
    incident.title = '';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_TITLE);
        done(err);
      });
  });
  it('should return error if title is greater than 100 characters', (done) => {
    incident.title = Constants.TEXT_LONG;
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_LONG_TITLE);
        done(err);
      });
  });
  it('should return error if comment is not provided', (done) => {
    incident.comment = '';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_BAD_COMMENT);
        done(err);
      });
  });
  it('should return error if comment is greater than 1000 characters', (done) => {
    incident.comment = Constants.TEXT_LONG;
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_LONG_COMMENT);
        done(err);
      });
  });
  it('should return error if longitude is not provided', (done) => {
    incident.longitude = '';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
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
    incident.longitude = 'INVALILD_LONGITUDE';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
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
    incident.latitude = '';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
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
    incident.latitude = 'INVALILD_LATITUDE';
    chai.request(app)
      .post(route)
      .set('authorization', `Bearer ${token}`)
      .send(incident)
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
