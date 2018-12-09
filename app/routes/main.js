import express from 'express';

import ValidatorGet from '../middleware/getValidator';
import ControllerGet from '../controllers/getController';
import ValidatorPost from '../middleware/postValidator';
import ControllerPost from '../controllers/postController';
import ValidatorDelete from '../middleware/deleteValidator';
import ControllerDelete from '../controllers/deleteController';
import ValidatorPatch from '../middleware/patchValidator';
import ControllerPatch from '../controllers/patchController';
import Config from '../utils/config';

const router = express.Router();

// Handle requests to api/v1
router.get('/', (req, res) => {
  res.status(Config.STATUS_OK).json({ message: Config.MESSAGE_WELCOME_HACKER });
});

// Get all incidents red-flag and interventions
router.get('/:type', ValidatorGet.getIncidents, ControllerGet.getIncidents);

// Get specific incident (red-flag or intervention) by id
router.get('/:type/:id', ValidatorGet.getIncident, ControllerGet.getIncident);

// Post incident (red-flag or intervention)
router.post('/:type', ValidatorPost.createIncident, ControllerPost.createIncident);

// Delete incident (red-flag or intervention)
router.delete('/:type/:id', ValidatorDelete.deleteIncident, ControllerDelete.deleteIncident);

// Patch incident (red-flag or intervention) comment
router.patch('/:type/:id/:action', ValidatorPatch.updateIncident, ControllerPatch.updateIncident);

export default router;
