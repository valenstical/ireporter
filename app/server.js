import express from 'express';

import bodyParser from 'body-parser';

import router from './routes/main';

import Config from './utils/config';

const app = express();
const PORT = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle routes to home page
app.get('/', (req, res) => {
  res.status(Config.STATUS_OK).json({ message: Config.MESSAGE_WELCOME_HOME });
});

// Handle routes to api
app.use('/api/v1', router);

// catch 404
app.all('*', (req, res) => {
  res.status(Config.STATUS_NOT_FOUND).json({ message: Config.MESSAGE_NOT_FOUND });
});

app.listen(PORT);

export default app;
