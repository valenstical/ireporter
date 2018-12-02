const chai=require('chai');
const expect=require('chai').expect;

const config=require('../app/model/config');

const app=require('../app/server').app;
const stop=require('../app/server').stop;

chai.use(require('chai-http'));

describe('API endpoints for path request to edit location', () =>{
    after(()=>{
        stop();
    });
    
    it('should add a new incident report if details are ok', () =>{
        chai.request(app)
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.4590943',
                    longitude:'3.4590945',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
                })
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_CREATED);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.status).to.equal(config.STATUS_CREATED);
                    expect(res.body.data).to.be.an('array');
        });
    });
    
    it('should send error message for empty latitude', () =>{
        chai.request(app)
                .post('/api/v1/red-flags')
                .send({
                    latitude:'',
                    longitude:'3.4590945',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
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
                .post('/api/v1/red-flags')
                .send({
                    latitude:'INVALID_LATITUDE',
                    longitude:'3.4590945',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
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
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.5678903',
                    longitude:'',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
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
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.8934675',
                    longitude:'INVALID_LATITUDE',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
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
    
    it('should send error message for empty comment', () =>{
        chai.request(app)
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.5678903',
                    longitude:'3.5784567',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'',
                    description:'He his a yahoo yahoo boy' ,
                    type:'red-flag'
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
    
    it('should send error message for invalid incident type', () =>{
        chai.request(app)
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.5678903',
                    longitude:'3.8956745',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    type:'INVALID_INCIDENT_TYPE'
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

    it('should send error message when incident type is not choosen', () =>{
        chai.request(app)
                .post('/api/v1/red-flags')
                .send({
                    latitude:'6.5678903',
                    longitude:'3.8956745',
                    images:'image1.jpg,image2.jpg',
                    videos:'video1.mp4',
                    comment:'Bags of Ghana must go with money in my neighbours room',
                    description:'He his a yahoo yahoo boy' ,
                    
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
    
});
