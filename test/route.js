/* eslint-disable no-unused-expressions */
import chai from 'chai';
import chaiHttp from 'chai-http';
import Constants from '../app/utils/constants';
import app from '../app/server';

const { expect } = chai;

chai.use(chaiHttp);


describe('Server', () => {
  it('should return status code of 200 for requests to main entry point /', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_OK);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(Constants.MESSAGE_WELCOME_HOME);
        done(err);
      });
  });
  it('should return status code of 200 for requests to api endpoints api/v1', (done) => {
    chai.request(app)
      .get('/api/v1')
      .end((err, res) => {
        expect(res).have.status(Constants.STATUS_OK);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message').to.equal(Constants.MESSAGE_WELCOME_HACKER);
        done(err);
      });
  });
  it('should return 404 status code for requests to invalid routes through main entry point /', (done) => {
    chai.request(app)
      .get('/INVALID_ROUTE')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(Constants.MESSAGE_NOT_FOUND);
        done(err);
      });
  });
  it('should return 404 status code for requests to invalid routes through api endpoint api/v1', (done) => {
    chai.request(app)
      .get('/api/v1/INVALID_ROUTE')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(Constants.MESSAGE_NOT_FOUND);
        done(err);
      });
  });
  it('should return 404 status code for requests to all other invalid routes ', (done) => {
    chai.request(app)
      .post('/api/v1/INVALID_ROUTE')
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.not.be.empty;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('error').to.equal(Constants.MESSAGE_NOT_FOUND);
        done(err);
      });
  });
});
