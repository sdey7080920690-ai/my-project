import express from 'express';
import { createTodo, getTodos, updateTodo, deleteTodo } from '../controller/todo.controller.js';

const router = express.Router();

router.post('/create', createTodo);
router.get('/', getTodos);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

export default router;