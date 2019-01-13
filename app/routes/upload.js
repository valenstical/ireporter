import express from 'express';


const router = express.Router();

// POST: Upload files
router.post('/:id', (req, res) => {
  res.send(req.params.id);
});


export default router;
