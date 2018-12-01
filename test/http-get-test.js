const chai=require('chai');
const expect=require('chai').expect;

const config=require('../app/model/config');

const app=require('../app/server').app;
const stop=require('../app/server').stop;

chai.use(require('chai-http'));

describe('API endpoints for get requests', () =>{
    after(()=>{
        stop();
    });
    
    it('should get list of all incidents as an array with a 200 status code', () =>{
        chai.request(app)
                .get('/api/v1/red-flags')
                .then((res)=>{
                    expect(res).to.have.status(config.STATUS_OK);
                    expect(res.body).to.be.an('object');
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('data');
                    expect(res.body.status).to.equal(config.STATUS_OK);
                    expect(res.body.data).to.be.an('array');
        });
    });  
    
});
