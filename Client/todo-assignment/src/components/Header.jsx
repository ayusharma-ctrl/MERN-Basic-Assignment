import { AppBar, Toolbar, Typography } from '@mui/material'
import React, { useState } from 'react'

const Header = () => {
    

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Todo App
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

export default Header