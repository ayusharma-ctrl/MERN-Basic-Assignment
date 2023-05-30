import { taskModel } from "../models/taskModel.js";
import { cleanupTask } from "../utils/cleanupAndValidate.js";

// func to create a new task
export const createTask = async (req, res) => {

    const { title, description } = req.body;

    try {
        await cleanupTask({ title, description });
    } catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: err,
        })
    }

    try {
        const taskObj = await taskModel.create({
            title,
            description,
            user: req.user
        })

        return res.status(201).json({
            success: true,
            message: "Task created!",
            task: taskObj
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to update task 
export const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { title, description } = req.body
    try {
        await cleanupTask({ title, description });
    } catch (err) {
        return res.send({
            status: 400,
            success: false,
            message: err,
        })
    }
    try {
        const task = await taskModel.findById(taskId);
        task.title = title
        task.description = description
        await task.save();
        res.status(200).json({
            success: true,
            message: "Task is updated!",
            task: task
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// function to update status of task
export const updateStatus = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await taskModel.findById(taskId);
        task.isCompleted = !task.isCompleted
        await task.save();
        res.status(200).json({
            success: true,
            message: "Task is updated!",
            task: task
        })
    }
    catch (err) {
        console.log(err)
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to delete or recover task
export const updateIsDeleted = async (req, res) => {
    const taskId = req.params.id;
    try {
        const task = await taskModel.findById(taskId);
        task.isDeleted = !task.isDeleted
        await task.save();
        res.status(200).json({
            success: true,
            message: "Changes Saved",
            task: task
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the tasks posted by the user
export const getAllTasks = async (req, res) => {
    const userId = req?.user?._id;
    // read skip from query, if available then take it otherwise consider 0
    let skip = 0
    // we have to set a limit of data which we want to send
    const limit = req?.query?.limit || 3
    // we have to set a page number
    let page = req?.query?.page || 1

    while (page > 1) {
        skip += parseInt(limit)
        page--
    }

    try {
        const tasks = await taskModel.find({ $and: [{ user: userId }, { isDeleted: false }] }).skip(parseInt(skip)).limit(parseInt(limit))
        res.status(200).json({
            success: true,
            tasks
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the completed tasks
export const getAllCompleted = async (req, res) => {
    const userId = req?.user?._id;
    // read skip from query, if available then take it otherwise consider 0
    let skip = req?.query?.skip || 0
    // we have to set a limit of data which we want to send
    const limit = req?.query?.limit || 3
    // we have to set a page number
    let page = req?.query?.page || 1

    while (page > 1) {
        skip += limit
        page--
    }

    try {
        const tasks = await taskModel.find({ $and: [{ user: userId }, { isDeleted: false }, { isCompleted: true }] }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit))
        res.status(200).json({
            success: true,
            tasks
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the pending tasks
export const getAllPending = async (req, res) => {
    const userId = req?.user?._id;
    // read skip from query, if available then take it otherwise consider 0
    let skip = req?.query?.skip || 0
    // we have to set a limit of data which we want to send
    const limit = req?.query?.limit || 3
    // we have to set a page number
    let page = req?.query?.page || 1

    while (page > 1) {
        skip += limit
        page--
    }

    try {
        const tasks = await taskModel.find({ $and: [{ user: userId }, { isDeleted: false }, { isCompleted: false }] }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit))
        res.status(200).json({
            success: true,
            tasks
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to get all the deleted tasks
export const getAllDeleted = async (req, res) => {
    const userId = req?.user?._id;
    // read skip from query, if available then take it otherwise consider 0
    let skip = req?.query?.skip || 0
    // we have to set a limit of data which we want to send
    const limit = req?.query?.limit || 3
    // we have to set a page number
    let page = req?.query?.page || 1

    while (page > 1) {
        skip += limit
        page--
    }

    try {
        const tasks = await taskModel.find({ $and: [{ user: userId }, { isDeleted: true }] }).sort({ createdAt: -1 }).skip(parseInt(skip)).limit(parseInt(limit))
        res.status(200).json({
            success: true,
            tasks
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to delete a task permanently - single task
export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;
        const task = await taskModel.findById(taskId);
        if (!task) {
            return res.send({
                success: false,
                status: 404,
                message: "No such task Found!"
            })
        }
        await task.deleteOne()
        return res.send({
            success: true,
            status: 200,
            message: "Task Deleted!"
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
}

// func to deleted all the tasks from bin - all at once or one click
export const deleteTaskAll = async (req, res) => {
    try {
        await taskModel.deleteMany({ isDeleted: true })
        return res.send({
            success: true,
            status: 200,
            message: "Bin is empty!"
        })
    }
    catch (err) {
        return res.send({
            success: false,
            status: 500,
            message: "Internal Server Error",
            error: err
        })
    }
} 