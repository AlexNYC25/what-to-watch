let axios = require('axios').default;

import { Button, Card, Container, Grid, CardMedia, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';

export default function Watchlist() {

    const [tvWatchlist, setTvWatchlist] = useState([])
    const [movieWatchlist, setMovieWatchlist] = useState([])

    let getWatchlist = () => {
        axios.get("/api/userDetails/getWatchlist").then(res => {
            setTvWatchlist(res.data.tvShowWatchlist)
            setMovieWatchlist(res.data.movieWatchlist)
        })
        .catch(err => {
            console.log(err)
        })
    }

    let handleRefresh = () => {
        getWatchlist()
    }

    useEffect(() => {
        getWatchlist()
    }, [])

    return (
        <Layout>
            <Container sx={{mt:10, mb:5}}>
                <Grid>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </Button>
                </Grid> 
            </Container>

            <Container>
                <h2>Movies</h2>
                <Grid container spacing={3}>
                    {movieWatchlist && movieWatchlist.map(movie => (
                        <Card sx={{maxWidth: 345}} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}} key={movie.id}>
                            <CardMedia
                                component="img"
                                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : "https://via.placeholder.com/300x450?text=Movie+Not+Found"}
                                style={{height: '100%', width: '100%'}}
                                title={movie.titile}
                            />

                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {movie.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Container>

            <Container>
                <h2>TV Shows</h2>
                <Grid container spacing={3}>
                    {tvWatchlist && tvWatchlist.map(tvShow => (
                        <Card sx={{maxWidth: 345}} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}} key={tvShow.id}>
                            <CardMedia
                                component="img"
                                image={tvShow.poster_path ? `https://image.tmdb.org/t/p/w500/${tvShow.poster_path}` : "https://via.placeholder.com/300x450?text=TV+Show+Not+Found"}
                                style={{height: '100%', width: '100%'}}
                                title={tvShow.titile}
                            />

                            <CardContent>
                                <Typography variant="body2" color="textSecondary" component="p">
                                    {tvShow.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Grid>
            </Container>

        </Layout> 
    );     

}