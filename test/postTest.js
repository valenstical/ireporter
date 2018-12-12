import chai from 'chai';

import Constants from '../app/utils/constants';

import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));

describe('API endpoints for post requests to red-flags/', () => {
  it('should add a new red-flag report if details are valid', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: '6.4590943',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_CREATED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_CREATED);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.be.a('number');
        expect(res.body.data[0].message).to.equal('Created new red-flag record');
      });
  });

  it('should send error message for empty latitude', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: '',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid latitude', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: 'INVALID_LATITUDE',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty longitude', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: '6.5678903',
        longitude: '',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid longitude', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: '6.8934675',
        longitude: 'INVALID_LATITUDE',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty comment', () => {
    chai.request(app)
      .post('/api/v1/red-flags')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: '',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_COMMENT);
      });
  });
});

describe('API endpoints for post requests to interventions/', () => {
  it('should add a new intervention report if details are valid', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: '6.4590943',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_CREATED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Constants.STATUS_CREATED);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.be.a('number');
        expect(res.body.data[0].message).to.equal('Created new intervention record');
      });
  });

  it('should send error message for empty latitude', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: '',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid latitude', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: 'INVALID_LATITUDE',
        longitude: '3.4590945',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty longitude', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: '6.5678903',
        longitude: '',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid longitude', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: '6.8934675',
        longitude: 'INVALID_LATITUDE',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: 'Bags of Ghana must go with money in my neighbours room',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_UNPROCESSED);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty comment', () => {
    chai.request(app)
      .post('/api/v1/interventions')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
        images: 'image1.jpg,image2.jpg',
        videos: 'video1.mp4',
        comment: '',
        description: 'He his a yahoo yahoo boy',
      })
      .then((res) => {
        expect(res).to.have.status(Constants.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Constants.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Constants.MESSAGE_BAD_COMMENT);
      });
  });
});
