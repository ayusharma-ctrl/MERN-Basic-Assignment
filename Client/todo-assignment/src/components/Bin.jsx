import React, { useEffect } from 'react'
import SearchBar from '../utils/SearchBar'
import { Box, Button, LinearProgress, TablePagination } from '@mui/material'
import { DeleteForever } from '@mui/icons-material'
import TaskTile from '../utils/TaskTile'
import axios from 'axios'


const Bin = () => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [binData, setBinData] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // func to get tasks which are partially or temporary deleted
  const getBinData = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`https://basic-assignment.onrender.com/api/task/deleted?limit=${rowsPerPage}&page=${page+1}`)
      if (data.success) {
        setBinData(data.tasks)
        setLoading(false)
      } else {
        console.log(data.message)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  // func to permanently delete all the tasks which are in bin
  const handleClearBin = async () => {
    try {
      const { data } = await axios.delete("https://basic-assignment.onrender.com/api/task/delete/all")
      if (data.success) {
        console.log(data.message)
      } else {
        console.log(data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(()=>{
    getBinData()
  },[page])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <SearchBar />
      <Button variant="contained" onClick={handleClearBin} sx={{ mt: 2 }} color='error' size='small' endIcon={<DeleteForever />} >
        Empty Bin
      </Button>
      {loading ? (<Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>) : (!binData || binData.length === 0) ? (<p>No Data Found.</p>) :
        binData.map((e, i) => {
          return <TaskTile key={i} data={e} />
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

export default Bin