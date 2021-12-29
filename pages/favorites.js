let axios = require('axios').default

import { Button, Container, Grid} from '@mui/material';
import { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import FavoritesCard from '../components/FavoritesCard';

export default function Favorites() {

    const [tvFavorites, setTvFavorites] = useState([])
    const [movieFavorites, setMovieFavorites] = useState([])

    let getFavorites = () => {
        axios.get("/api/userDetails/getFavorites").then(res => {
            setTvFavorites(res.data.tvShowFavorites)
            setMovieFavorites(res.data.movieFavorites)
            console.log(res.data)
        })
        .catch(err => {
            console.log(err)
        })
    }


    let handleRefresh = () => {
        getFavorites()
    }

    useEffect(() => {
        getFavorites()
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
                <h2 className="favorites-media-heading">Movies </h2>
                <Grid container spacing={2}>
                    
                    {movieFavorites && movieFavorites.map(movie => (
                        <FavoritesCard mediaType="movie" id={movie.id} title={movie.title} imagePath={movie.poster_path} />
                    ))}
                </Grid>
            </Container>

            <Container>
                <h2 className="favorites-media-heading">TV Shows </h2>
                <Grid container spacing={2}>
                    {tvFavorites && tvFavorites.map(tv => (
                        <FavoritesCard mediaType="tvShow" id={tv.id} title={tv.name} imagePath={tv.poster_path} />
                    ))}
                </Grid>
            </Container>
        </Layout>
    );
}