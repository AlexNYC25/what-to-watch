let axios = require('axios').default

import { Button, Card, Container, Grid, CardMedia, CardContent, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';

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
                <h2>Movies </h2>
                <Grid container spacing={2}>
                    
                    {movieFavorites && movieFavorites.map(movie => (
                        <Grid item xs={6} md={3} lg={2} xl={2} key={movie.id} style={{disply: 'flex'}}>
                            <Card sx={{maxWidth: 345}} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                <CardMedia
                                    component="img" 
                                    //image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                                    style={{height: '100%', width: '100%'}}
                                    title={movie.title}
                                />

                                <CardContent >
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {movie.title ? movie.title : movie.name}
                                    </Typography>
                                </CardContent>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <Container>
                <h2>TV Shows </h2>

                <Grid container spacing={2}>
                    
                    {tvFavorites && tvFavorites.map(tv => (
                        
                        <Grid item xs={6} md={3} lg={2} xl={2} key={tv.id} style={{disply: 'flex'}}>
                            <Card sx={{maxWidth: 345}} style={{display:'flex', flexDirection:'column', justifyContent:'space-between'}}>
                                <CardMedia
                                    component="img" 
                                    //image={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                                    image={tv.poster_path ? `https://image.tmdb.org/t/p/w500/${tv.poster_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                                    style={{height: '100%', width: '100%'}}
                                    title={tv.name}
                                />

                                <CardContent >
                                    <Typography variant="body2" color="textSecondary" component="p">
                                        {tv.name ? tv.name : tv.title}
                                    </Typography>
                                    
                                </CardContent>

                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Layout>
    );
}