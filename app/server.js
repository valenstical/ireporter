import express from 'express';

import bodyParser from 'body-parser';

import router from './routes/api/v1/index';

import config from './utils/config';

const app = express();
const PORT = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Handle routes to home page
app.get('/', (req, res) => {
  res.status(config.STATUS_OK).json({ message: config.MESSAGE_WELCOME_HOME });
});

// Handle routes to api
app.use('/api/v1', router);

// catch 404
app.all('*', (req, res) => {
  res.status(config.STATUS_NOT_FOUND).json({ message: config.MESSAGE_404 });
});

app.listen(PORT);

export default app;
