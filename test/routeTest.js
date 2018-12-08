import chai from 'chai';

import Config from '../app/utils/config';

import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));


describe('Server', () => {
  it('should send 200 status code with the right type of message for / routes', () => {
    chai.request(app)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(Config.MESSAGE_WELCOME_HOME);
      });
  });

  it('should return 200 status code with a message for api/v1 route', () => {
    chai.request(app)
      .get('/api/v1')
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(Config.MESSAGE_WELCOME_HACKER);
      });
  });

  it('should return 404 and and error message for invalid routes to api route ', () => {
    chai.request(app)
      .post('/api/v1')
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });

  it('should return 404 and and error message for all other invalid routes ', () => {
    chai.request(app)
      .get('/INVALID_ROUTE/')
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });
});
