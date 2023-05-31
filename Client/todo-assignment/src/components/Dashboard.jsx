import React, { useState } from 'react'
import { Box, Tab, Tabs } from '@mui/material'

// components-imports
import Home from './Home'
import Bin from './Bin'
import Profile from './Profile'

const Dashboard = () => {
    const [value, setValue] = useState('1');
    
    // func to switch tabs
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div style={{ margin: '1rem' }}>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        textColor="primary"
                        indicatorColor="primary"
                        aria-label="secondary tabs example"
                    >
                        <Tab value="1" label="Task" />
                        <Tab value="2" label="Bin" />
                        <Tab value="3" label="Profile" />
                    </Tabs>
                </Box>
                {value === '1' ? <Home /> : value === '2' ? <Bin /> : <Profile />}
            </Box>
        </div>
    )
}

export default Dashboard