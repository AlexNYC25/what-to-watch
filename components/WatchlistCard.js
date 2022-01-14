import Link from "next/link";
import { Card, CardActions, CardMedia, IconButton, Grid, Tooltip } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash} from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

export default function WatchlistCard(props){

    // add to favorites
    let handleMarkFavorite = (mediaType, mediaId) => {
        axios.post(
            `/api/favorites/${mediaType}`, { mediaId: mediaId }
        )
        .then(res => {
            if(res.status === 200){
                props.handleWatchlistCardAlert('success', 'Tv Show added to Favorites');
            }
        })
        .catch(err => {
            if(err.response?.status){
                props.handleWatchlistCardAlert('error', 'Error Occured: ' + err.response.data.message);
            } else {
                props.handleWatchlistCardAlert('error', 'Error Occured: Unknown Error');
            }
        });
    }

    // remove from watchlist
    let handleMarkRemove = (mediaType, mediaId) => {
        axios.post(
            `/api/removeWatchlist/${mediaType}`, { mediaId: mediaId }
        )
        .then(res => {
            if(res.status === 200){
                props.handleRemoveCardAlert('success', mediaType + ' removed from Watchlist', mediaType, mediaId );
            }
        })
        .catch(err => {
            if(err.response?.status){
                props.handleRemoveCardAlert('error', 'Error Occured: ' + err.response.data.message, mediaType, mediaId);
            } else {
                props.handleRemoveCardAlert('error', 'Error Occured: Unknown Error', mediaType, mediaId);
            }
        });
    }

    return(
        <Grid item sm={6} md={3} lg={3} xl={3}>        
            
                <Card
                    className="featured-media-card"
                    sx={{maxWidth: 345}}
                >
                    <Link href={`/${props.mediaType}/${props.id}`}>
                        <CardMedia
                            className="watchlist-card-image"
                            component="img"
                            image={props.imagePath ? `https://image.tmdb.org/t/p/w500/${props.imagePath}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                            title={props.title}
                        />
                    </Link>

                    <div
                        className="featured-media-card-actions"
                    > 
                        <Tooltip className="featured-media-icon-buttons" title="Favorite">
                            <IconButton >
                                <FontAwesomeIcon icon={faStar} onClick={() => handleMarkFavorite(props.mediaType, props.id)}/>
                            </IconButton>
                        </Tooltip>

                        <Tooltip className="featured-media-icon-buttons" title="Remove from Watchlist">
                            <IconButton >
                                <FontAwesomeIcon icon={faTrash} onClick={() => handleMarkRemove(props.mediaType, props.id)}/>
                            </IconButton>
                        </Tooltip>

                    </div>
                </Card>
        </Grid>
    )
}