

import Layout from "../components/Layout";
import 
    { Button, Select, TextField, MenuItem, 
    Grid, Container, Card, CardMedia, CardContent, 
    Typography, IconButton, CardActions, ButtonGroup, Alert, Snackbar } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilm, faTv, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

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

    const { user, error, isLoading } = useUser();

    const [alert, setAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');

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
                setTotalPages(res.data.total_pages);
                setMedia(res.data.results);
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
                setTotalPages(res.data.total_pages);
                setMedia(res.data.results);
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
            setTotalPages(res.data.total_pages);
            setMedia(res.data.data.results);
            setSearchResultsMediaType(mediaType);
            setPageNumber(1);

            console.log(res.data.data.results);
        })
    }


    /*
        Id: specific media id given to media
        categoryType: what specific category to save the media passed in either favorties or watchlist
    */
    let handleButtonClick = (id, categoryType) => {

        if(!user){
            return
        }

        axios.post('/api/' + categoryType + '/' + searchResultsMediaType, {
            mediaId: id
        }).then(res => {
            if(res.status === 200){
                setAlert(true);
                setAlertType('success');
                setAlertMessage(searchResultsMediaType + ' added to ' + categoryType);
            }
        }
        ).catch(err => {
            if(err.response.status === 400 || err.response.status === 500){
                setAlert(true);
                setAlertType('error');
                setAlertMessage('Error Occured: ' + err.response.data.message);
            }
        })

    }



  return (
    <Layout>
        
        <Container sx={{mt:10, mb:5}}>
            <Grid container >
                <Grid item xs={12} sm={12} md={6} lg={8} xl={8} >
                    <TextField
                        placeholder="Search"
                        value={search}
                        onChange={handleSearchChange}
                        //InputLabelProps={{shrink: false}}
                        varient="outlined"
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
                <Grid container item xs={12} sm={6} md={3} lg={2} xl={2} component="div">
                    <Button 
                        variant="contained" 
                        color="primary"
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
                {media.map(item => (
                    <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={item.id} style={{display:'flex'}} >
                        
                        <Card sx={{maxWidth: 345}} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                            <CardMedia
                                component="img" 
                                //image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                image={item.poster_path ? `https://image.tmdb.org/t/p/w500/${item.poster_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                                style={{height: '100%', width: '100%'}}
                                title={item.title}
                            />
                                
                            <CardContent >
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {item.title ? item.title : item.name}
                                </Typography>
                                
                            </CardContent>

                            <CardActions>
                                
                                <IconButton 
                                    aria-label="add to favorites" 
                                    disabled={user ? false : true} 
                                    value={item.id}
                                    //onClick={handleFavorite}
                                    onClick={() => handleButtonClick(item.id, 'favorites')}
                                >
                                    <FontAwesomeIcon icon={faStar} />
                                </IconButton>
                                <IconButton 
                                    aria-label="add to watchlist" 
                                    disabled={user ? false : true}
                                    value={item.id}
                                    onClick={() => handleButtonClick(item.id, 'watchlist')}
                                >
                                    {searchResultsMediaType === 'movie' ? <FontAwesomeIcon icon={faFilm} /> : <FontAwesomeIcon icon={faTv} />}
                                </IconButton>
                            </CardActions>
                        </Card>
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

        <Snackbar
            open={alert}
            onClose={() => setAlert(false)}
        >
            
            <Alert onClose={() => {setAlert(false)}} severity={alertType} >
                {alertMessage}
            </Alert> 
            
        </Snackbar>
        
    </Layout>
    );
}