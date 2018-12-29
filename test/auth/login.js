/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Constants from '../../app/utils/constants';
import app from '../../app/server';
import Database from '../../app/utils/database';

const { expect } = chai;

chai.use(chaiHttp);


const credentials = Object.assign({}, Constants.TEST_DUMMY_USER);
const route = '/api/v1/auth/login';

describe('Login authentication API', () => {
  before((done) => {
    Database.refreshDatabase(() => {
      Database.createUser(credentials, () => {
        done();
      });
    });
  });

  it('should successfully login user with correct credentials', (done) => {
    chai.request(app)
      .post(route)
      .send(credentials)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_OK);
        expect(res.body).to.have.property('data').to.be.an('array').to.have.length(1);
        expect(res.body.data[0]).to.be.an('object').to.not.be.empty;
        expect(res.body.data[0]).to.have.property('token').to.be.a('string');
        expect(res.body.data[0]).to.have.property('user').to.be.an('object').to.not.be.empty;
        done(err);
      });
  });
  it('should return error message if username is not provided', (done) => {
    chai.request(app)
      .post(route)
      .send({ username: '', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_USERNAME);
        done(err);
      });
  });
  it('should return error message if password is not provided', (done) => {
    chai.request(app)
      .post(route)
      .send({ username: 'demo@ireporter.com', password: '' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_PASSWORD);
        done(err);
      });
  });
  it('should return error message if username and password are not provided', (done) => {
    chai.request(app)
      .post(route)
      .send({ username: '', password: '' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(2);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_NO_PASSWORD);
        expect(res.body.error[1]).to.equal(Constants.MESSAGE_NO_USERNAME);
        done(err);
      });
  });
  it('should return error message if user does not exists', (done) => {
    chai.request(app)
      .post(route)
      .send({ username: 'INVALID_USERNAME', password: '123' })
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.be.an('object');
        expect(res.body).have.property('status').to.equal(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_INVALID_LOGIN);
        done(err);
      });
  });
});
