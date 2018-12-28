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
let comment;
let route;
const baseRoute = '/api/v1/interventions/';
let token;

describe('Patch intervention record comment', () => {
  beforeEach((done) => {
    comment = Object.assign({}, Constants.TEST_DUMMY_COMMENT);
    done();
  });
  before((done) => {
    route = `${baseRoute}/${incident.id}/comment`;
    incident.type = Constants.INCIDENT_TYPE_INTERVENTION;
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        Database.createIncident(incident, () => {
          done();
        });
      });
    });
  });
  it('should update comment of intervention record with the specified id', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
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
      .send(comment)
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
      .send(comment)
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
      .patch(route)
      .send(comment)
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
  it('should return error if intervention id is not a number', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/NOT_A_NUMBER/comment`)
      .send(comment)
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
  it('should return error if intervention id is not 9 digts long', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/1234567899/comment`)
      .send(comment)
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
  it('should return error if there is no intervention record with the specified id', (done) => {
    chai.request(app)
      .patch(`${baseRoute}/000000000/comment`)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_NOT_FOUND);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('You do not have any intervention record with that id');
        done(err);
      });
  });
  it('should return error if comment is not provided', (done) => {
    comment.comment = '';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
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
    comment.comment = Constants.TEXT_LONG;
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_LONG_COMMENT);
        done(err);
      });
  });
  it('should return error if title is not provided', (done) => {
    comment.title = '';
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
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
    comment.title = Constants.TEXT_LONG;
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal(Constants.MESSAGE_LONG_TITLE);
        done(err);
      });
  });
});

describe('Patch intervention record comment', () => {
  beforeEach((done) => {
    comment = Object.assign({}, Constants.TEST_DUMMY_COMMENT);
    done();
  });
  before((done) => {
    incident.status = 'resolved';
    incident.type = Constants.INCIDENT_TYPE_INTERVENTION;
    route = `${baseRoute}/${incident.id}/comment`;
    Database.refreshDatabase(() => {
      Database.createUser(credentials, (authToken) => {
        token = authToken;
        Database.createIncident(incident, () => {
          done();
        });
      });
    });
  });
  it('should return error if the status of the intervention record is not "draft"', (done) => {
    chai.request(app)
      .patch(route)
      .set('authorization', `Bearer ${token}`)
      .send(comment)
      .end((err, res) => {
        expect(res).to.have.status(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status').to.equal(Constants.STATUS_FORBIDDEN);
        expect(res.body).to.have.property('error').to.be.an('array').to.have.length(1);
        expect(res.body.error[0]).to.equal('You can no longer alter this intervention record because it is no longer in draft mode.');
        done(err);
      });
  });
});
