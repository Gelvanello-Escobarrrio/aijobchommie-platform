import express from 'express';
import { createSuccessResponse } from '@aijobchommie/shared';
const router = express.Router();

router.post('/login', (req, res) => {
  res.json(createSuccessResponse({ message: 'Auth endpoints coming soon' }));
});

export default router;
