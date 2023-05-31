import { ArrowBack, Delete, DeleteForever, Edit, Restore } from '@mui/icons-material'
import { Button, FormControl, IconButton, Input, InputLabel, Typography } from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const TaskDialog = ({ dataTask, setIsDialog }) => {
  const [isEditTask, setIsEditTask] = useState(false)
  const [title, setTitle] = useState(dataTask.title)
  const [description, setDescription] = useState(dataTask.description)

  // func to edit task
  const handleEditTask = async () => {
    if (!title || !description) {
      toast.error("Please enter valid data before saving")
      return
    }
    if (title.length < 3 || description.length < 10) {
      toast.error("Either title or description is too short")
      return
    }
    if (title.length > 50) {
      toast.error("Title cannot be greater than 50 characters long")
      return
    }
    if (description.length > 50) {
      toast.error("Description cannot be greater than 256 characters long")
      return
    }
    try {
      const { data } = await axios.put(`https://basic-assignment.onrender.com/api/task/${dataTask._id}`,
        { title: title, description: description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (data.success) {
        toast.success(data.message)
        setIsEditTask(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // func to delete task permanently from bin
  const handleDeletePermanently = async () => {
    try {
      const { data } = await axios.delete(`https://basic-assignment.onrender.com/api/task/${dataTask._id}`)
      if (data.success) {
        toast.success(data.message)
        setIsDialog(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // func to delete task and send it to bin
  const handleDeleteTemporary = async () => {
    try {
      const { data } = await axios.put(`https://basic-assignment.onrender.com/api/task/update/bin/${dataTask._id}`)
      if (data.success) {
        toast.success(data.message)
        setIsDialog(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // func to recover deleted task from bin
  const handleRestore = async () => {
    try {
      const { data } = await axios.put(`https://basic-assignment.onrender.com/api/task/update/bin/${dataTask._id}`)
      if (data.success) {
        toast.success(data.message)
        setIsDialog(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div style={{ width: '90vw', backgroundColor: 'aliceblue', padding: '2rem', margin: '1rem' }}>
      <IconButton onClick={() => setIsDialog(false)}>
        <ArrowBack />
      </IconButton>
      <h5> {dataTask.isCompleted ? "Completed Task" : "Pending Task"} </h5>
      <Typography> {dataTask.title} </Typography>
      <Typography> {dataTask.description} </Typography>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly', alignItems: 'center', margin: '1rem 0' }}>

        {
          dataTask.isDeleted ? (<>
            <Button variant="contained" onClick={handleDeletePermanently} sx={{ mt: 1 }} color='error' size='small' endIcon={<DeleteForever />} >
              Delete Permanently
            </Button>
            <Button variant="contained" onClick={handleRestore} color='warning' sx={{ mt: 1 }} size='small' endIcon={<Restore />} >
              Restore
            </Button>
          </>) : (<>
            <Button variant="contained" color='primary' sx={{ mt: 1 }} size='small' onClick={() => setIsEditTask(true)} endIcon={<Edit />} >
              Edit
            </Button>
            <Button variant="contained" onClick={handleDeleteTemporary} color='error' sx={{ mt: 1 }} size='small' endIcon={<Delete />} >
              Delete
            </Button>
          </>)
        }
      </div>
      {
        isEditTask ? (<div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: 'center', flexWrap: 'wrap', flexDirection: 'column' }}>
          <FormControl sx={{ m: 1, width: '35ch' }} size='small' variant="standard">
            <InputLabel htmlFor="standard-adornment-comment">Title</InputLabel>
            <Input
              id="standard-adornment-comment"
              value={title}
              type='text'
              onChange={(e) => setTitle(e.target.value)}
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: '35ch' }} size='small' variant="standard">
            <InputLabel htmlFor="standard-adornment-comment">Description</InputLabel>
            <Input
              id="standard-adornment-comment"
              value={description}
              type='text'
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <Button onClick={handleEditTask} size='small' variant='contained' color='success' sx={{ m: 1, height: '2rem' }}>Save</Button>
          <Button onClick={() => setIsEditTask(false)} size='small' variant='contained' color='warning' sx={{ m: 1, height: '2rem' }}>Cancel</Button>
        </div>) : null
      }

    </div>
  )
}

export default TaskDialog