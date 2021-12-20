import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, IconButton } from "@mui/material";
import Layout from '../components/Layout';

import {useState, useEffect} from 'react';

import {useUser} from '@auth0/nextjs-auth0';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faFilm, faTv } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

export default function TopRated() {

    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);

    const { user, error, isLoading } = useUser();

    let handleTopRated = async () => {
        let response = await axios.get('/api/topRated');
        setMovies(response.data.movies);
        setTvShows(response.data.tvShows);

        console.log(response.data);
    }

    useEffect(() => {
        handleTopRated();
    }, []);

    return (
        <Layout>

            <Container sx={{mt:10, mb:10}}>
                <h1>Top Rated</h1>
                <h2>Top Rated Movies</h2>

                <Grid container spacing={2}>
                    {movies.map( item => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={item.id} style={{display: 'flex'}}>
                            <Card sx={{maxWidth: 345}} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} >
                                <CardMedia
                                    component="img"
                                    image={item.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${item.poster_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                                    style={{height: '100%', width: '100%'}}
                                    title={item.title ? item.title : item.name}
                                />

                                <CardContent>
							        <Typography varient="body5" color="textSecondary" component="p">
								        {item.title ? item.title : item.name}
							        </Typography>
						        </CardContent>
                            
                                <CardActions>
                                    <p>{item.vote_average}</p>
                                    <IconButton 
                                        aria-label="add to favorites" 
                                        disabled={user ? false : true} 
                                        onClick={() => handleButtonClick(item.id, 'favorites')}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                    </IconButton>
                                    <IconButton 
                                        aria-label="add to watchlist" 
                                        disabled={user ? false : true}
                                        onClick={() => handleButtonClick(item.id, 'watchlist')}
                                    >
                                        {item.media_type === 'movie' ? <FontAwesomeIcon icon={faFilm} /> : <FontAwesomeIcon icon={faTv} />}
                                    </IconButton>
                                </CardActions>

                            </Card>
                        </Grid>
                    ))}

                </Grid>

                <h2>Top Rated TV Shows</h2>
                <Grid container spacing={2}>
                    {tvShows.map( item => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={item.id} style={{display: 'flex'}}>
                            <Card sx={{maxWidth: 345}} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}} >
                                <CardMedia
                                    component="img"
                                    image={item.poster_path ? `https://image.tmdb.org/t/p/w185_and_h278_bestv2/${item.poster_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                                    style={{height: '100%', width: '100%'}}
                                    title={item.title ? item.title : item.name}
                                />

                                <CardContent>
                                    <Typography varient="body5" color="textSecondary" component="p">
                                        {item.title ? item.title : item.name}
                                    </Typography>
                                </CardContent>

                                <CardActions>
                                    <p>{item.vote_average}</p>
                                    <IconButton
                                        aria-label="add to favorites"
                                        disabled={user ? false : true}
                                        onClick={() => handleButtonClick(item.id, 'favorites')}
                                    >
                                        <FontAwesomeIcon icon={faStar} />
                                    </IconButton>

                                    <IconButton
                                        aria-label="add to watchlist"
                                        disabled={user ? false : true}
                                        onClick={() => handleButtonClick(item.id, 'watchlist')}
                                    >
                                        {item.media_type === 'movie' ? <FontAwesomeIcon icon={faFilm} /> : <FontAwesomeIcon icon={faTv} />}
                                    </IconButton>
                                </CardActions>

                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Container>

        </Layout>
    )
}
