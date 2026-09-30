import express from 'express';
import { getItems, getItemById, deleteItem } from '../controllers/itemsController.js';

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItemById);
router.delete('/:id', deleteItem);

export default router;
