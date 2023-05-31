import { Search } from '@mui/icons-material'
import { Container, InputAdornment, TextField } from '@mui/material'
import React, { useState } from 'react'

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div>
            <Container maxWidth="xs" sx={{ mt: 2 }}>
                <TextField
                    id="search"
                    size='small'
                    type="search"
                    label="Enter Title or Description..."
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ width: "100%" }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />
            </Container>
        </div>
    )
}

export default SearchBar