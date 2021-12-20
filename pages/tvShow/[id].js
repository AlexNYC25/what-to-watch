import Layout from "../../components/Layout";
import { Container, Grid, Typography, CircularProgress, IconButton } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar"

import 'react-circular-progressbar/dist/styles.css';

import axios from "axios";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFilm } from "@fortawesome/free-solid-svg-icons";

export default function TvShow(){
    const router = useRouter();
    const { id } = router.query;

    const {user, error, loading} = useUser();

    const [tvShowData, setTvShowData] = useState(null);

    let getTvShow = async () => {
        const res = await axios.get(`/api/tvShow/${id}`);
        setTvShowData(res.data.data);
        console.log(res.data.data);
    }

    useEffect(() => {
        if(!router.isReady){
            return;
        }

        getTvShow();
    }, [router.isReady]);

    let handleTvButtonClick = (id, categoryType) => {
        if(!user){
            return;
        }

        axios.post('/api/' + categoryType + '/tv' , {
            mediaId: id
        }).then(res => {
            if(res.status === 200){
                setAlert(true);
                setAlertType('success');
                setAlertMessage('Movie added to ' + categoryType);
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
                <Grid container spacing={3}>
                    <Grid item sm={3} md={2} lg={3} xl={3}>
                        <img src={ 'https://image.tmdb.org/t/p/w500/' + tvShowData?.tvShow.poster_path} alt={tvShowData?.tvShow.title} style={{maxWidth: '100%', maxHeight:'100%'}}/> 
                        <div>
                            <Container id="movie-favorite-watchlist-buttons">
                                    <IconButton
                                        aria-label="add to favorites"
                                        disabled={user ? false : true}
                                        onClick={() => {
                                            handleMovieButtonClick(tvShowData?.tvShow.id, 'favorite');
                                        }}
                                        style={{
                                            width: '50%'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faStar} size="2x"/>
                                    </IconButton>

                                    <IconButton
                                        aria-label="add to watchlist"
                                        disabled={user ? false : true}
                                        onClick={() => {
                                            handleMovieButtonClick(tvShowData?.tvShow.id, 'watchlist');
                                        }}
                                        style={{
                                            width: '50%'
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faFilm} size="2x" />
                                    </IconButton>
                                </Container>
                            <CircularProgressbar value={tvShowData?.tvShow.vote_average * 10} text={`${tvShowData?.tvShow.vote_average * 10}`} />
                        </div>
                    </Grid>

                    <Grid item lg={9}>
                        <Grid container spacing={5}>
                            <Grid id="tv-show-properties" item lg={4}>
                                <Typography variant="h4">{tvShowData?.tvShow.name}</Typography>
                                <Typography variant="h6">{ "First Episode Date: " + new Date(tvShowData?.tvShow.first_air_date).toDateString().split(" ").slice(1, 4).join(' ')}</Typography>
                                <Typography variant="h6">{ "Number of Seasons: " + tvShowData?.tvShow.number_of_seasons }</Typography>
                                <Typography variant="h6">{ "Genre: " + tvShowData?.tvShow.genres.map(genre => genre.name).join(", ")}</Typography>
                                {tvShowData?.tvShow?.in_production ? <Typography variant="h6">{ "Currently Running" }</Typography> : <Typography variant="h6">{ "Last Episode: " + new Date(tvShowData?.tvShow.last_air_date).toDateString().split(" ").slice(1, 4).join(' ') }</Typography>}
                            </Grid>


                            <Grid item lg={7}>
                                {tvShowData?.watchProviders.results.US?.flatrate && 
                                    <div >
                                        <Typography variant="h6">Where to Stream</Typography>
                                        <Grid container>
                                            {tvShowData?.watchProviders?.results.US?.flatrate.map(provider => {
                                                return (
                                                    <Grid item lg={1} key={provider.provider_id} sx={{mx:0.5}}>
                                                        <img src={'https://image.tmdb.org/t/p/w500/' + provider.logo_path} alt={provider.provider_name} style={{maxWidth: '100%', maxHeight:'100%', borderRadius: '50%'}}/>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }

                                {tvShowData?.watchProviders.results.US?.buy &&
                                    <div>
                                        <Typography variant="h6">Where To Buy</Typography>
                                        <Grid container>
                                            {tvShowData?.watchProviders?.results.US?.buy.map(buy => {
                                                return (
                                                    <Grid item lg={1} key={buy.provider_id} sx={{mx:0.5}}>
                                                        <img src={'https://image.tmdb.org/t/p/w500/' + buy.logo_path} alt={buy.provider_name} style={{maxWidth: '100%', maxHeight:'100%', borderRadius: '50%'}}/>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }

                                {tvShowData?.watchProviders.results.US?.rent &&
                                    <div>
                                        <Typography variant="h6">Where To Rent</Typography>
                                        <Grid container>
                                            {tvShowData?.watchProviders?.results.US?.rent.map(rent => {
                                                return (
                                                    <Grid item lg={1} key={rent.provider_id} sx={{mx:0.5}}>
                                                        <img src={'https://image.tmdb.org/t/p/w500/' + rent.logo_path} alt={rent.provider_name} style={{maxWidth: '100%', maxHeight:'100%', borderRadius: '50%'}}/>
                                                    </Grid>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }
                            </Grid>

                            <Grid item lg={12} sx={{my: 3}}>
                                <Typography variant="h6">Series Overview</Typography>
                                <Typography variant="body1">{tvShowData?.tvShow.overview}</Typography>
                            </Grid>
                        </Grid>
                        
                        <Typography variant="h6">Cast Members</Typography>
                        <Grid container spacing={1}>
                            {tvShowData?.credits.cast.map(cast => (
                                <Grid item key={cast.id} md={2} lg={2}>
                                    <img src={ 'https://image.tmdb.org/t/p/w500/' + cast.profile_path} alt={cast.name} style={{maxWidth: '100%', maxHeight:'100%'}}/>
                                    <Typography variant="body1">{cast.name}</Typography>
                                </Grid>
                            )).slice(0, 6)}
                        </Grid>

                    </Grid>

                    <Grid item lg={12}>
                        <Typography variant="h6">Similar Tv Shows</Typography>
                        <Grid container spacing={1}>
                            {tvShowData?.recommendations?.results.map(similar => (
                                <Grid item key={similar.id} md={2} lg={2}>
                                    <a href={'/tvShow/' + similar.id}>
                                        <img src={ 'https://image.tmdb.org/t/p/w500/' + similar.poster_path} alt={similar.title} style={{maxWidth: '100%', maxHeight:'100%'}}/>
                                    </a>
                                </Grid>
                            )).slice(0, 6)}
                        </Grid>
                    </Grid>

                </Grid>

            </Container>
        </Layout>
    )

}