const chai=require('chai');
const expect=require('chai').expect;

const config=require('../app/model/config');

const app=require('../app/server').app;
const stop=require('../app/server').stop;

chai.use(require('chai-http'));

describe('API endpoints for patch request to edit location', () =>{
    after(()=>{
        stop();
    });
    
    it('should edit the latitude and longitude for a particular incident with id =7', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/7/location')
                .send({
                    latitude:'6.4590943',
                    longitude:'3.4590945'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_OK);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.status).to.equal(config.STATUS_OK);
                    expect(res.body.data).to.be.an('array');
                    expect(res.body.data).to.have.lengthOf(1);
                    expect(res.body.data[0]).to.be.an('object'); 
                    expect(res.body.data[0]).to.have.property('id'); 
                    expect(res.body.data[0]).to.have.property('message');
                    expect(res.body.data[0].id).to.equal(7);                     
        });
    });
    
    it('should send error message for empty latitude', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/7/location')
                .send({
                    latitude:'',
                    longitude:'3.4590945'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_BAD_REQUEST);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('error');
                    expect(res.body.status).to.equal(config.STATUS_BAD_REQUEST);
                    expect(res.body.error).to.be.a('string');
                    expect(res.body.error).to.not.be.empty;
        });
    });   
    
    it('should send error message for invalid latitude', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/7/location')
                .send({
                    latitude:'INVALID_LATITUDE',
                    longitude:'3.4590945'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_UNPROCESSED);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('error');
                    expect(res.body.status).to.equal(config.STATUS_UNPROCESSED);
                    expect(res.body.error).to.be.a('string');
                    expect(res.body.error).to.not.be.empty;
        });
    });    
    
    it('should send error message for empty longitude', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/7/location')
                .send({
                    latitude:'6.5678903',
                    longitude:''
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_BAD_REQUEST);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('error');
                    expect(res.body.status).to.equal(config.STATUS_BAD_REQUEST);
                    expect(res.body.error).to.be.a('string');
                    expect(res.body.error).to.not.be.empty;
        });
    });   
    
    it('should send error message for invalid longitude', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/7/location')
                .send({
                    latitude:'6.8934675',
                    longitude:'INVALID_LATITUDE'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_UNPROCESSED);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('error');
                    expect(res.body.status).to.equal(config.STATUS_UNPROCESSED);
                    expect(res.body.error).to.be.a('string');
                    expect(res.body.error).to.not.be.empty;
        });
    });      
    
    it('should send error message when no incidents has the specified id', () =>{
        chai.request(app)
                .patch('/api/v1/red-flags/-1/location')
                .send({
                    latitude:'6.5678903',
                    longitude:'3.5784567'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_NOT_FOUND);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('error');
                    expect(res.body.status).to.equal(config.STATUS_NOT_FOUND);
                    expect(res.body.error).to.be.a('string');
                    expect(res.body.error).to.not.be.empty;
        });
    });     
    
});
