/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Constants from '../../app/utils/constants';
import app from '../../app/server';
import Database from '../../app/utils/database';

const { expect } = chai;

chai.use(chaiHttp);
let credentials;
const route = '/api/v1/auth/signup';

describe('Signup API', () => {
  beforeEach((done) => {
    credentials = Object.assign({}, Constants.TEST_DUMMY_USER);
    done();
  });
  before((done) => {
    Database.refreshDatabase(() => {
      done();
    });
  });
  it('should successfully create a new user with complete credentials', (done) => {
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_CREATED);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_CREATED);
        expect(res.body).to.have.property('data').to.be.an('array').to.have.length(1);
        expect(res.body.data[0]).to.be.an('object').to.not.be.empty;
        expect(res.body.data[0]).to.have.property('token').to.be.a('string');
        expect(res.body.data[0]).to.have.property('user').to.be.an('object').to.not.be.empty;
        done(err);
      });
  });
  it('should return error message if first name is not provided', (done) => {
    credentials.firstname = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_FIRST_NAME);
        done(err);
      });
  });
  it('should return error message if last name is not provided', (done) => {
    credentials.lastname = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_LAST_NAME);
        done(err);
      });
  });
  it('should return error message if username is not provided', (done) => {
    credentials.username = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_SIGNUP_USERNAME);
        done(err);
      });
  });
  it('should return error message if password is not provided', (done) => {
    credentials.password = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_PASSWORD);
        done(err);
      });
  });
  it('should return error message if email is not provided', (done) => {
    credentials.email = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_EMAIL_ADDRESS);
        done(err);
      });
  });
  it('should return error message if email is invalid', (done) => {
    credentials.email = 'INVALID_EMAIL';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_EMAIL_ADDRESS);
        done(err);
      });
  });
  it('should return error message if phone is not provided', (done) => {
    credentials.phoneNumber = '';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_PHONE_NUMBER);
        done(err);
      });
  });
  it('should return error message if phone is not valid', (done) => {
    credentials.phoneNumber = 'INVALID_PHONE';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_PHONE_NUMBER);
        done(err);
      });
  });
  it('should return error message if username already exists', (done) => {
    credentials.email = 'demo@new.email';
    credentials.phoneNumber = '08000000001';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_DUPLICATE_USERNAME);
        done(err);
      });
  });
  it('should return error message if email already exists', (done) => {
    credentials.username = 'demo_not_existing_username';
    credentials.phoneNumber = '08111111111';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_DUPLICATE_EMAIL);
        done(err);
      });
  });
  it('should return error message if phone number already exists', (done) => {
    credentials.email = 'demo@new.email';
    credentials.username = 'demo_not_existing_username';
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_DUPLICATE_PHONE_NUMBER);
        done(err);
      });
  });
});
