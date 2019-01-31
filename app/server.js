import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import expressUploader from 'express-fileupload';
import routerIncidents from './routes/incidents';
import Constants from './utils/constants';
import IncidentType from './middleware/incidentType';
import routerAuth from './routes/auth';
import routerUser from './routes/users';

dotenv.config();
const app = express();
const PORT = process.env.PORT || '3000';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(expressUploader({ createParentPath: false }));

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

// Handle routes to all reports
app.use('/api/v1/incidents', IncidentType.setAll, routerIncidents);

// Handle routes to login
app.use('/api/v1/auth/', routerAuth);

// Handle routes to edit users. IncidentType router seperates creating and updating user profile
app.use('/api/v1/users', IncidentType.setAll, routerUser);

// catch 404
app.all('*', (req, res) => {
  res.status(Constants.STATUS_NOT_FOUND).json({ error: Constants.MESSAGE_NOT_FOUND });
});

app.listen(PORT);
export default app;
