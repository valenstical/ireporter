const chai=require('chai');
const expect=require('chai').expect;
const config=require('../app/model/config');

chai.use(require('chai-http'));

const app=require('../app/server').app;
const stop=require('../app/server').stop;

describe('Server handle incomming requests with proper status codes',function(){
  after(() => {
    stop();
  });

    it('should send 200 status code with a message for / routes', function () {
        chai.request(app)
                .get('/')
                .then((res) =>{
                    expect(res).to.have.status(config.STATUS_OK);
        });
    });  
    
});





