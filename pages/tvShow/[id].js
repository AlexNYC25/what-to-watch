import Layout from "../../components/Layout";
import ActorCard from "../../components/ActorCard";
import ProviderLogo from "../../components/ProviderLogo";
import TvImageCard from "../../components/TvImageCard";
import { Container, Grid, Typography, Tooltip, IconButton, Snackbar, Alert } from "@mui/material";
import { CircularProgressbar } from "react-circular-progressbar"

import 'react-circular-progressbar/dist/styles.css';

import axios from "axios";

import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faClipboardList } from "@fortawesome/free-solid-svg-icons";

export default function TvShow(){
    const router = useRouter();
    const { id } = router.query;

    const {user, error, loading} = useUser();

    const [tvShowData, setTvShowData] = useState(null);

    const [alert, setAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

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

    let handleClose = (event) => {
        setAlert(false);
    }


    let handleTvButtonClick = (id, categoryType) => {
        if(!user){
            return;
        }

        axios.post('/api/' + categoryType + '/tvShow' , {
            mediaId: id
        }).then(res => {
            if(res.status === 200){
                setAlert(true);
                setAlertType('success');
                setAlertMessage('Tv Show added to ' + categoryType);
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
            <Container id="media-container" sx={{mt:10, mb:5}}>
                <Grid container spacing={3} >
                    <Grid item sm={12} md={4} lg={3} xl={3}>
                        <img src={ 'https://image.tmdb.org/t/p/w500/' + tvShowData?.tvShow.poster_path} alt={tvShowData?.tvShow.title} style={{maxWidth: '100%', maxHeight:'100%'}}/> 
                        <div>
                            <Container sx={{my: 2}}>
                                <Tooltip title="Add Tv Show to Favorites">
                                    <IconButton
                                        className="media-icon-buttons"
                                        aria-label="add to favorites"
                                        disabled={user ? false : true}
                                        onClick={() => {
                                            handleTvButtonClick(tvShowData?.tvShow.id, 'favorites');
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faStar} size="2x"/>
                                    </IconButton>
                                </Tooltip>
                                
                                <Tooltip title="Add Tv Show to Watchlist">
                                    <IconButton
                                        className="media-icon-buttons"
                                        aria-label="add to watchlist"
                                        disabled={user ? false : true}
                                        onClick={() => {
                                            handleTvButtonClick(tvShowData?.tvShow.id, 'watchlist');
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                    </IconButton>
                                </Tooltip>

                                
                            </Container>
                            <CircularProgressbar value={tvShowData?.tvShow.vote_average * 10} text={`${tvShowData?.tvShow.vote_average * 10}`} />
                        </div>
                    </Grid>

                    <Grid item md={8} lg={9}>
                        <Grid container spacing={5}>
                            <Grid item lg={4}>
                                <Typography className="tv-properties" variant="h4">{tvShowData?.tvShow.name}</Typography>
                                <Typography className="tv-properties" variant="h6">{ "First Episode Date: " + new Date(tvShowData?.tvShow.first_air_date).toDateString().split(" ").slice(1, 4).join(' ')}</Typography>
                                <Typography className="tv-properties" variant="h6">{ "Number of Seasons: " + tvShowData?.tvShow.number_of_seasons }</Typography>
                                <Typography className="tv-properties" variant="h6">{ "Genre: " + tvShowData?.tvShow.genres.map(genre => genre.name).join(", ")}</Typography>
                                {tvShowData?.tvShow?.in_production ? <Typography className="tv-properties" variant="h6">{ "Currently Running" }</Typography> : <Typography className="tv-properties" variant="h6">{ "Last Episode: " + new Date(tvShowData?.tvShow.last_air_date).toDateString().split(" ").slice(1, 4).join(' ') }</Typography>}
                            </Grid>


                            <Grid item lg={7}>
                                {tvShowData?.watchProviders.results.US?.flatrate && 
                                    <div >
                                        <Typography variant="h6">Where to Stream</Typography>
                                        <Grid container>
                                            {tvShowData?.watchProviders?.results.US?.flatrate.map(provider => {
                                                return (
                                                    <ProviderLogo provider_key={provider.provider_id} provider_name={provider.provider_name} logo_path={provider.logo_path}/>
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
                                                    <ProviderLogo provider_key={buy.provider_id} provider_name={buy.provider_name} logo_path={buy.logo_path}/>
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
                                                    <ProviderLogo provider_key={rent.provider_id} provider_name={rent.provider_name} logo_path={rent.logo_path}/>
                                                )
                                            })}
                                        </Grid>
                                    </div>
                                }
                            </Grid>

                            <Grid item lg={12} sx={{my: 2}}>
                                <Typography variant="h6">Series Overview</Typography>
                                <Typography variant="body1">{tvShowData?.tvShow.overview}</Typography>
                            </Grid>
                        </Grid>
                        
                        <Typography variant="h6">Cast Members</Typography>
                        <Grid container spacing={1}>
                            {tvShowData?.credits.cast.map(cast => (
                                <ActorCard key={cast.id} profile_path={cast.profile_path} name={cast.name}/>
                            )).slice(0, 6)}
                        </Grid>

                    </Grid>

                    <Grid item md={12} lg={12}>
                        <Typography variant="h6">Similar Tv Shows</Typography>
                        <Grid container spacing={1}>
                            {tvShowData?.recommendations?.results.map(similar => (
                                <TvImageCard id={similar.id} poster_path={similar.poster_path} title={similar.title}/>
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
    )

}