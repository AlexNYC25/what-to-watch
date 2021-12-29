let axios = require('axios').default;

import { Button, Container, Grid } from '@mui/material';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import WatchlistCard from '../components/WatchlistCard';

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
                <h2 className="watchlist-media-heading">Movies</h2>
                <Grid container spacing={3}>
                    {movieWatchlist && movieWatchlist.map(movie => (
                        <WatchlistCard mediaType="movie" id={movie.id} title={movie.title} imagePath={movie.poster_path} />
                    ))}
                </Grid>
            </Container>

            <Container>
                <h2 className="watchlist-media-heading">TV Shows</h2>
                <Grid container spacing={3}>
                    {tvWatchlist && tvWatchlist.map(tvShow => (
                        <WatchlistCard mediaType="tvShow" id={tvShow.id} title={tvShow.title} imagePath={tvShow.poster_path} />
                    ))}
                </Grid>
            </Container>

        </Layout> 
    );     

}