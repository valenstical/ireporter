const express = require('express');
const bodyParser=require('body-parser');

const app = express();
const router = require('./routes/api/v1/index');
const PORT = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//Handle routes to home page
app.get('/',(req,res) =>{
    res.status(200).json({'message':'Welcome to iReporter. Are you an Hacker? Use our endpoint /api/v1 to interact with our service. Are you a Normal person? You can visit the site and click around.'});
});

//Handle routes to api
app.use('/api/v1',router);

// catch 404 
app.all('*',(req,res) =>{
    res.status(404).json({'message':'That is a dead end. Nothing to see here. Please check your link then try again.'});
});


app.listen(PORT);

module.exports=app;
