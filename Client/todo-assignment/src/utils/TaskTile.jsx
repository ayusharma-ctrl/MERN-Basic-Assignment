import { Checkbox, Paper, Typography } from '@mui/material'
import React from 'react'
import TaskDialog from './TaskDialog';
import axios from 'axios';
import { toast } from 'react-toastify';

const TaskTile = ({ dataTask }) => {
    const [checked, setChecked] = React.useState(dataTask.isCompleted);
    const [isDialog, setIsDialog] = React.useState(false)

    const handleChange = (event) => {
        setChecked(event.target.checked);
    };

    // func to update status of task, pending or completed
    const handleStatusUpdate = async() => {
        try {
            const { data } = await axios.put(`https://basic-assignment.onrender.com/api/task/update/status/${dataTask._id}`)
            if (data.success) {
              toast.success(data.message)
            } else {
              toast.error(data.message)
            }
          } catch (error) {
            console.log(error)
          }
    }

    return (
        <>
            {
                isDialog ? (<TaskDialog dataTask={dataTask} setIsDialog={setIsDialog} />) : (
                    <div style={{ margin: '1.3rem 1rem' }}>
                        <Paper elevation={2} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '90vw', backgroundColor: 'lightskyblue' }} >
                            <Typography onClick={()=>setIsDialog(true)} sx={{ cursor: 'pointer' }}>{dataTask.title}</Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography sx={{ cursor: 'pointer' }}> {checked ? "Completed" : "Pending"}</Typography>
                                <Checkbox checked={checked} onClick={handleStatusUpdate} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />
                            </div>
                        </Paper>
                    </div>
                )
            }
        </>
    )
}

export default TaskTile