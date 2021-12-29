import { Container, Grid } from "@mui/material";
import Layout from '../components/Layout';
import TopRatedCard from "../components/TopRatedCard";

import {useState, useEffect} from 'react';
import axios from 'axios';

export default function TopRated() {

    const [movies, setMovies] = useState([]);
    const [tvShows, setTvShows] = useState([]);

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
                <h1 className="top-rated-media-heading">Top Rated</h1>
                <h2 className="top-rated-media-heading">Top Rated Movies</h2>

                <Grid container spacing={2}>
                    {movies.map( item => (
                        <TopRatedCard mediaType="movie" id={item.id} title={item.title} imagePath={item.poster_path} />
                    ))}

                </Grid>

                <h2 className="top-rated-media-heading">Top Rated TV Shows</h2>
                <Grid container spacing={2}>
                    {tvShows.map( item => (
                        
                        <TopRatedCard mediaType="tvShow" id={item.id} title={item.name} imagePath={item.poster_path} />
                    ))}
                </Grid>

            </Container>

        </Layout>
    )
}
