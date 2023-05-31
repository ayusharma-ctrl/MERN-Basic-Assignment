import React, { useEffect, useState } from 'react'
import { Box, Button, FormControl, FormControlLabel, Input, InputLabel, LinearProgress, Radio, RadioGroup, TablePagination, Typography } from '@mui/material'
import { Add } from '@mui/icons-material'
import SearchBar from '../utils/SearchBar'
import TaskTile from '../utils/TaskTile'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'


const Home = () => {
  const [value, setValue] = React.useState('none');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [addTask, setAddTask] = React.useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [taskData, setTaskData] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // func to add a new task
  const handleAddNewTask = async () => {
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
      const { data } = await axios.post("https://basic-assignment.onrender.com/api/task/new",
        { title: title, description: description },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      if (data.success) {
        toast.success(data.message)
        setAddTask(false)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // func to get unfiltered data from db
  const getDataUnfiltered = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`https://basic-assignment.onrender.com/api/task/all?limit=${rowsPerPage}&page=${page + 1}`)
      if (data.success) {
        setTaskData(data.tasks)
        setLoading(false)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  // func to get only pending tasks
  const getDataPending = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`https://basic-assignment.onrender.com/api/task/pending?limit=${rowsPerPage}&page=${page + 1}`)
      if (data.success) {
        setTaskData(data.tasks)
        setLoading(false)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  // func to get only completed tasks
  const getDataCompleted = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`https://basic-assignment.onrender.com/api/task/completed?limit=${rowsPerPage}&page=${page + 1}`)
      if (data.success) {
        setTaskData(data.tasks)
        setLoading(false)
      } else {
        toast.error(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // handle filter value changes
  useEffect(() => {
    setPage(0)
  }, [value])

  // handle api calls to fetch data
  useEffect(() => {
    if (value === 'none') {
      getDataUnfiltered()
    }
    else if (value === 'pending') {
      getDataPending()
    }
    else {
      getDataCompleted()
    }
  }, [page, value])


  return (
    <>
      <ToastContainer />
      {
        addTask ? (
          <div style={{ width: '94vw', backgroundColor: 'aliceblue', padding: '2rem', margin: '1rem' }}>
            <div style={{ width: '100%', display: "flex", justifyContent: "center", alignItems: 'center', flexWrap: 'wrap', flexDirection: 'column' }}>
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
              <Button onClick={handleAddNewTask} size='small' variant='contained' color='success' sx={{ m: 1, height: '2rem' }}>Save</Button>
              <Button onClick={() => setAddTask(false)} size='small' variant='contained' color='warning' sx={{ m: 1, height: '2rem' }}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <SearchBar />
            <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', alignItems: 'center', width: '95%', margin: '20px', padding: '10px', borderRadius: '30px', backgroundColor: 'lightgray' }}>
              <Button variant="contained" onClick={() => setAddTask(true)} size='small' color='error' endIcon={<Add />}>Add Task</Button>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', margin: '1rem' }}>
                <Typography mr={1}>Tasks Filtered By:</Typography>
                <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group" value={value} onChange={handleChange}>
                  <FormControlLabel value="none" control={<Radio size='small' />} label="None" />
                  <FormControlLabel value="pending" control={<Radio size='small' />} label="Pending" />
                  <FormControlLabel value="completed" control={<Radio size='small' />} label="Completed" />
                </RadioGroup>
              </div>
            </div>
            {loading ? (<Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>) : (!taskData || taskData.length === 0) ? (<p>No Data Found.</p>) :
              taskData.map((e, i) => {
                return <TaskTile key={i} dataTask={e} />
              })
            }
            <div>
              <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />

            </div>
          </div>
        )
      }
    </>
  )
}

export default Home