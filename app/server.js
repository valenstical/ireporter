import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import routerIncidents from './routes/incidents';
import Constants from './utils/constants';
import IncidentType from './middleware/incidentType';
import routerAuth from './routes/auth';

dotenv.config();
const app = express();
const PORT = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Handle routes to home page
app.get('/', (req, res) => {
  res.status(Constants.STATUS_OK).json({ message: Constants.MESSAGE_WELCOME_HOME });
});

// Handle requests to api/v1
app.get('/api/v1', (req, res) => {
  res.status(Constants.STATUS_OK).json({ message: Constants.MESSAGE_WELCOME_HACKER });
});

// Handle routes to intervention reports
app.use('/api/v1/interventions', IncidentType.setIntervention, routerIncidents);

// Handle routes to red-flag reports
app.use('/api/v1/red-flags', IncidentType.setRedFlag, routerIncidents);

// Handle routes to login
app.use('/api/v1/auth/', routerAuth);

// catch 404
app.all('*', (req, res) => {
  res.status(Constants.STATUS_NOT_FOUND).json({ message: Constants.MESSAGE_NOT_FOUND });
});

app.listen(PORT);

export default app;
