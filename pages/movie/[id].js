import Layout from "../../components/Layout";
import ActorCard from "../../components/ActorCard";
import ProviderLogo from "../../components/ProviderLogo";
import MovieImageCard from "../../components/MovieImageCard";

import { Container, Grid, Typography, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar"

import 'react-circular-progressbar/dist/styles.css';

import axios from "axios";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClipboardList } from "@fortawesome/free-solid-svg-icons";


export default function Movie() {
    const router = useRouter();
    const { id } = router.query;

    const {user, error, isLoading} = useUser();

    const [movieData, setMovieData] = useState(null);

    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    let getMovie = async () => {
        const res = await axios.get(`/api/movie/${id}`);
        setMovieData(res.data);
        console.log(res.data);

    }

    useEffect(() => {
        if(!router.isReady) {
            return;
        }

        console.log(router.query);
        console.log(id);
        getMovie();
    }, [router.isReady]);


    let handleClose = (event) => {
        setAlert(false);
    }

    let handleMovieButtonClick = (id, categoryType) => {
        if(!user) {
            return
        }

        axios.post('/api/' + categoryType + '/movie' , {
            mediaId: id
        }).then(res => {
            if(res.status === 200){
                setAlert(true);
                setAlertType('success');
                setAlertMessage('Movie added to ' + categoryType);
            }
        }
        ).catch(err => {
            if(err?.response.status === 400 || err?.response.status === 500){
                setAlert(true);
                setAlertType('error');
                setAlertMessage('Error Occured: ' + err.response.data.message);
            }
        })
    }

    return (
        <Layout>
            <Container id="media-container" sx={{mt:10, mb:5}}>
                <Grid container spacing={3}>
                    <Grid item sm={12} md={4} lg={3} xl={3}>
                        <img src={ 'https://image.tmdb.org/t/p/w500/' + movieData?.data.movie.poster_path} alt={movieData?.title} style={{maxWidth: '100%', maxHeight:'100%'}}/> 
                        <div>
                            <Container id="movie-favorite-watchlist-buttons">
                                    <Tooltip title="Add to Favorites">
                                        <IconButton
                                            className="media-icon-buttons"
                                            aria-label="add to favorites"
                                            disabled={user ? false : true}
                                            onClick={() => {
                                                handleMovieButtonClick(movieData?.data.movie.id, 'favorites');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faStar} size="2x"/>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Add to Watchlist">
                                        <IconButton
                                            className="media-icon-buttons"
                                            aria-label="add to watchlist"
                                            disabled={user ? false : true}
                                            onClick={() => {
                                                handleMovieButtonClick(movieData?.data.movie.id, 'watchlist');
                                            }}
                                        >
                                            <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                        </IconButton>
                                    </Tooltip>

                                    <CircularProgressbar value={movieData?.data.movie.vote_average * 10} text={`${movieData?.data.movie.vote_average * 10}`} />
                            </Container>
                        </div>
                    </Grid>

                    <Grid item md={8} lg={9}>

                        <Grid container spacing={5}>

                            <Grid item lg={4}>
                                <Typography variant="h4">{movieData?.data.movie.title}</Typography>
                                <Typography variant="h6">{ "Release Date: " + new Date(movieData?.data.movie.release_date).toDateString().split(" ").slice(1, 4).join(' ')}</Typography>
                                <Typography variant="h6">{ "Director: " + movieData?.data.credits.crew.filter( crewMember => crewMember.job == "Director").map(crewMember => crewMember.name).join(', ')} </Typography>
                                <Typography variant="h6">{ "Runtime: " + movieData?.data.movie.runtime + " minutes"}</Typography>
                                <Typography variant="h6">{ "Genre: " + movieData?.data.movie.genres.map(genre => genre.name).join(", ")}</Typography>
                                

                            </Grid>
                            <Grid item lg={7}>
                                {movieData?.data.watchProviders.results.US?.flatrate && 
                                    <div >
                                        <Typography variant="h6">Where to Stream</Typography>
                                        <Grid container>
                                            {movieData?.data.watchProviders?.results.US?.flatrate.map(provider => {
                                                return (
                                                    <ProviderLogo provider_key={provider.provider_key} provider_name={provider.provider_name} logo_path={provider.logo_path}/>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }

                                {movieData?.data.watchProviders.results.US?.buy &&
                                    <div>
                                        <Typography variant="h6">Where To Buy</Typography>
                                        <Grid container>
                                            {movieData?.data.watchProviders?.results.US?.buy.map(buy => {
                                                return (
                                                    <ProviderLogo provider_id={buy.provider_id} provider_name={buy.provider_name} logo_path={buy.logo_path}/>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }

                                {movieData?.data.watchProviders.results.US?.rent &&
                                    <div>
                                        <Typography variant="h6">Where To Rent</Typography>
                                        <Grid container>
                                            {movieData?.data.watchProviders?.results.US?.rent.map(rent => {
                                                return (
                                                    <ProviderLogo provider_id={rent.provider_id} provider_name={rent.provider_name} logo_path={rent.logo_path}/>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }

                                
                            </Grid> 

                            <Grid item lg={12} sx={{my: 2}}>
                                <Typography variant="h6">Movie Synopsis</Typography>
                                <Typography variant="body1">{movieData?.data.movie.overview}</Typography>
                            </Grid>
                        </Grid>


                        
                        <Grid container spacing={1}>
                            {movieData?.data.credits.cast.map(cast => (
                                <ActorCard key={cast.id} profile_path={cast.profile_path} name={cast.name} />
                                
                            )).slice(0, 6)}
                        </Grid>

                    </Grid>

                    <Grid item md={12} lg={12}>
                        <Typography id="similar-movie-heading" variant="h6">Similar Movies</Typography>
                        <Grid container spacing={1}>
                            {movieData?.data.recommendations?.results.map(similar => (
                                <MovieImageCard id={similar.id} title={similar.title} poster_path={similar.poster_path}/>
                            )).slice(0, 6)}
                        </Grid>
                    </Grid>

                </Grid>
            </Container>

            <Snackbar
                open={alert}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert onClose={handleClose} severity={alertType}>{alertMessage}</Alert>
            </Snackbar>
        </Layout>
    );
}
