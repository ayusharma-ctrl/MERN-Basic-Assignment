import express from 'express'

// file-imports
import { isAuthenticated } from '../middlewares/auth.js';
import { createTask, deleteTask, deleteTaskAll, getAllCompleted, getAllDeleted, getAllPending, getAllTasks, updateIsDeleted, updateStatus, updateTask } from '../controllers/taskController.js';

//creating a router
const router = express.Router();

//api to create a new task
router.post('/new', isAuthenticated, createTask)

//apis to update & delete a task by it's id, that's why id is dynamic
router.route("/:id").put(isAuthenticated, updateTask).delete(isAuthenticated, deleteTask)

// api to update task status, completed or not
router.put('/update/status/:id', isAuthenticated, updateStatus)

// api to move or remove a task - bin
router.put('/update/bin/:id', isAuthenticated, updateIsDeleted)

// api to delete all tasks - permanently
router.delete('/delete/all', isAuthenticated, deleteTaskAll)

//api to get all the tasks
router.get('/all', isAuthenticated, getAllTasks)

//api to get all the completed tasks
router.get('/completed', isAuthenticated, getAllCompleted)

//api to get all the pending tasks
router.get('/pending', isAuthenticated, getAllPending)

//api to get all the deleted tasks
router.get('/deleted', isAuthenticated, getAllDeleted)


export default router;