import chai from 'chai';
import Config from '../app/utils/config';
import app from '../app/server';

const { expect } = chai;

chai.use(require('chai-http'));

describe('API endpoints for patch request to edit red-flag location', () => {
  it('should edit the latitude and longitude for a particular incident with id =4', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/location')
      .send({
        latitude: '6.4590943',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(4);
        expect(res.body.data[0].message).to.equal('Updated red-flag location');
      });
  });

  it('should send error message for empty latitude', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/location')
      .send({
        latitude: '',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid latitude', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/location')
      .send({
        latitude: 'INVALID_LATITUDE',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_UNPROCESSED);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty longitude', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/location')
      .send({
        latitude: '6.5678903',
        longitude: '',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid longitude', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/location')
      .send({
        latitude: '6.8934675',
        longitude: 'INVALID_LATITUDE',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_UNPROCESSED);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message when no red-flag has the specified id', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/-1/location')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_DATA_NOT_FOUND);
      });
  });
});

describe('API endpoints for patch request to edit red-flag comment', () => {
  it('should edit the comment for a particular incident with id =4', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/4/comment')
      .send({
        comment: 'Power failure in my area has now extended to over 6 months now.',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(4);
        expect(res.body.data[0].message).to.equal('Updated red-flag comment');
      });
  });

  it('should send error message for empty comment', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/7/comment')
      .send({
        comment: '',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_COMMENT);
      });
  });

  it('should send error message when no red-flag has the specified id', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/-1/comment')
      .send({
        comment: 'Power failure in my area has now extended to over 6 months now.',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Config.MESSAGE_DATA_NOT_FOUND);
      });
  });
});

describe('API endpoints for patch request to edit intervention location', () => {
  it('should edit the latitude and longitude for a particular incident with id =2', () => {
    chai.request(app)
      .patch('/api/v1/interventions/2/location')
      .send({
        latitude: '6.4590943',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(2);
        expect(res.body.data[0].message).to.equal('Updated intervention location');
      });
  });

  it('should send error message for empty latitude', () => {
    chai.request(app)
      .patch('/api/v1/interventions/1/location')
      .send({
        latitude: '',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid latitude', () => {
    chai.request(app)
      .patch('/api/v1/interventions/1/location')
      .send({
        latitude: 'INVALID_LATITUDE',
        longitude: '3.4590945',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_UNPROCESSED);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for empty longitude', () => {
    chai.request(app)
      .patch('/api/v1/interventions/1/location')
      .send({
        latitude: '6.5678903',
        longitude: '',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message for invalid longitude', () => {
    chai.request(app)
      .patch('/api/v1/interventions/1/location')
      .send({
        latitude: '6.8934675',
        longitude: 'INVALID_LATITUDE',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_UNPROCESSED);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_UNPROCESSED);
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_LOCATION);
      });
  });

  it('should send error message when no intervention has the specified id', () => {
    chai.request(app)
      .patch('/api/v1/interventions/-1/location')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_DATA_NOT_FOUND);
      });
  });
});

describe('API endpoints for patch request to edit intervention comment', () => {
  it('should edit the comment for a particular intervention with id =2', () => {
    chai.request(app)
      .patch('/api/v1/interventions/2/comment')
      .send({
        comment: 'Power failure in my area has now extended to over 6 months now.',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_OK);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('data');
        expect(res.body.status).to.equal(Config.STATUS_OK);
        expect(res.body.data).to.be.an('array');
        expect(res.body.data).to.have.lengthOf(1);
        expect(res.body.data[0]).to.be.an('object');
        expect(res.body.data[0]).to.have.property('id');
        expect(res.body.data[0]).to.have.property('message');
        expect(res.body.data[0].id).to.equal(2);
        expect(res.body.data[0].message).to.equal('Updated intervention comment');
      });
  });

  it('should send error message for empty comment', () => {
    chai.request(app)
      .patch('/api/v1/interventions/1/comment')
      .send({
        comment: '',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_BAD_REQUEST);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_BAD_REQUEST);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Config.MESSAGE_BAD_COMMENT);
      });
  });

  it('should send error message when no intervention has the specified id', () => {
    chai.request(app)
      .patch('/api/v1/interventions/-1/comment')
      .send({
        comment: 'Power failure in my area has now extended to over 6 months now.',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.be.a('string');
        expect(res.body.error).to.equal(Config.MESSAGE_DATA_NOT_FOUND);
      });
  });

  it('should send error message for invalid patch route to edit intervention', () => {
    chai.request(app)
      .patch('/api/v1/interventions/-1/INVALID_ROUTE')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });

  it('should send error message for invalid patch route to edit red-flag', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/-1/INVALID_ROUTE')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });
});

describe('API endpoints for patch request for invalid route to edit intervention or comment', () => {
  it('should send error message for invalid patch route to edit intervention', () => {
    chai.request(app)
      .patch('/api/v1/interventions/-1/INVALID_ROUTE')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });

  it('should send error message for invalid patch route to edit red-flag', () => {
    chai.request(app)
      .patch('/api/v1/red-flags/-1/INVALID_ROUTE')
      .send({
        latitude: '6.5678903',
        longitude: '3.5784567',
      })
      .then((res) => {
        expect(res).to.have.status(Config.STATUS_NOT_FOUND);
        expect(res.body).to.be.an('object');
        expect(res).to.be.json;
        expect(res.body).to.have.property('status');
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.equal(Config.STATUS_NOT_FOUND);
        expect(res.body.error).to.equal(Config.MESSAGE_NOT_FOUND);
      });
  });
});
