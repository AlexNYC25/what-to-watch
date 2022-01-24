import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, IconButton } from "@mui/material";
import Layout from "../components/Layout";

import { useEffect, useState } from "react";

import { useUser } from '@auth0/nextjs-auth0';

import axios from "axios";
import DiscoverCard from "../components/DiscoverCard";

export default function Discover() {

	const [movies, setMovies] = useState([]);
	const [tvShows, setTvShows] = useState([]);

	const {user, error, isLoading} = useUser();

	let handleDiscover = async () => {
		let response = await axios.get("/api/discover");
		setMovies(response.data.movies);
		setTvShows(response.data.tvShows);
		console.log(response.data);
	};

	useEffect(() => {
		handleDiscover();
	}, []);

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
		<Container id="discover-container" sx={{mt:10, mb:5}}>
			<h1>Discover</h1>
			<h2>Trending Movies</h2>
			<Grid container spacing={2}>
				{movies.map(item => (
					<DiscoverCard mediaType="movie" title={item.title ? item.title : item.name} id={item.id} imagePath={item.poster_path} />
				))}
			</Grid>
			<h2>Trending Tv Shows</h2>
			<Grid container spacing={2}>
				
				{tvShows.map(item => (
					<DiscoverCard mediaType="tvShow" title={item.title ? item.title : item.name} id={item.id} imagePath={item.poster_path} />
				))}
			</Grid>
		</Container>
	</Layout>
	);
}