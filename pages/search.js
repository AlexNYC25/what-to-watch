
import Layout from "../components/Layout";
import SearchMediaCard from "../components/SearchMediaCard";

import 
    { Button, Select, TextField, MenuItem, 
    Grid, Container,  Typography, IconButton} from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import { useState } from 'react';
import { Box } from "@mui/system";

import { useUser } from '@auth0/nextjs-auth0';


export default function Search() {

    const [search, setSearch] = useState('');
    const [mediaType, setMediaType] = useState('movie');
    const [pageNumber, setPageNumber] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchResultsMediaType, setSearchResultsMediaType] = useState('');
    const [media, setMedia] = useState([]);

    let handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

    let handleSelectChange = (e) => {
        setMediaType(e.target.value);
    }

    let handlePageBack = (e) => {
        if (pageNumber > 1) {

            axios.get('/api/search', 
                {params: {query: search, mediaType: mediaType, pageNumber: pageNumber - 1}}
            ).then(res => {
                setTotalPages(res.data.data.total_pages);
                setMedia(res.data.data.results);
                setSearchResultsMediaType(mediaType);

            })

            setPageNumber(pageNumber - 1);
        }
        
    }

    let handlePageForward = (e) => {
        if (pageNumber < totalPages) {
            
            axios.get('/api/search', 
                {params: {query: search, mediaType: mediaType, pageNumber: pageNumber + 1}}
            ).then(res => {
                setTotalPages(res.data.data.total_pages);
                setMedia(res.data.data.results);
                setSearchResultsMediaType(mediaType);

            })

            setPageNumber(pageNumber + 1);
        }
    }

    let handleSubmit = (e) => {
        //e.preventDefault();
        axios.get('/api/search', 
            {params: {query: search, mediaType: mediaType, pageNumber: pageNumber}}
        ).then(res => {
            setTotalPages(res.data.data.total_pages);
            setMedia(res.data.data.results);
            setSearchResultsMediaType(mediaType);
            setPageNumber(1);

            console.log(res.data.data);
        })
    }




  return (
    <Layout id="search-page">
        
        <Container sx={{mt:10, mb:5}}>
            <Grid container id="search-options">
                <Grid item xs={12} sm={12} md={6} lg={8} xl={8} >
                    <TextField
                        placeholder="Search"
                        varient="outlined"
                        value={search}
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2} xl={2}>
                    <Select
                        value={mediaType}
                        onChange={handleSelectChange}
                        label="Media Type"
                        fullWidth
                    >
                        <MenuItem value="movie">Movie</MenuItem>
                        <MenuItem value="tv">TV Show</MenuItem>
                    </Select>
                </Grid>
                <Grid id="search-submit" container item xs={12} sm={6} md={3} lg={2} xl={2} component="div">
                    <Button
                        id="search-submit-button"
                        variant="contained" 
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Search
                    </Button>
                </Grid>

                
            </Grid>
        </Container>

        <Container >
            <Grid container spacing={2}>
                {media?.map(item => (
                    <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={item.id} style={{display:'flex'}} >

                        <SearchMediaCard
                            imagePath={item.poster_path}
                            title={item.title ? item.title : item.name}
                            id={item.id}
                            mediaType={searchResultsMediaType === 'movie' ? 'movie' : 'tvShow'}
                        />
                        
                    </Grid>
                    
                ))}
            </Grid>
        </Container>

        <Container>
            <Box display="flex" justifyContent="center" alignItems="center">
                    
                    <IconButton 
                        aria-label="previous page" 
                        onClick={handlePageBack} 
                        disabled={pageNumber <= 1 ? true : false}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </IconButton>
                    <Typography variant="h6" color="textSecondary" component="p">
                        Page {pageNumber} of {totalPages}
                    </Typography>
                    <IconButton 
                        aria-label="next page" 
                        onClick={handlePageForward}
                        disabled={pageNumber >= totalPages ? true : false}
                    >
                        <FontAwesomeIcon icon={faArrowRight} />
                    </IconButton>
            </Box>
            
        </Container>
        
    </Layout>
    );
}