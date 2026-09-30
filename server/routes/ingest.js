import express from 'express';
import { ingestItem } from '../controllers/ingestController.js';

const router = express.Router();

router.post('/', ingestItem);

export default router;
