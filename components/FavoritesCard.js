import Link from "next/link";
import { Card, CardMedia, IconButton, Grid, Tooltip } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faTrash} from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

export default function FavoritesCard(props){

    // add to watchlist 
    let handleMarkWatchlist = (mediaType, mediaId) => {
        axios.post(
            `/api/watchlist/${mediaType}`, { mediaId: mediaId }
        )
        .then(res => {
            if(res.status === 200){
                props.handleFavoriteCardAlert('success', 'Tv Show added to Watchlist');
            }
        })
        .catch(err => {
            if(err.response?.status){
                props.handleFavoriteCardAlert('error', 'Error Occured: ' + err.response.data.message);
            } else {
                props.handleFavoriteCardAlert('error', 'Error Occured: Unknown Error');
            }
        });
    }

    // remove from favorites
    let handleMarkRemove = (mediaType, mediaId) => {
        axios.post(
            `/api/removeFavorite/${mediaType}`, { mediaId: mediaId }
        )
        .then(res => {
            if(res.status === 200){
                props.handleRemoveCardAlert('success', mediaType + ' removed from Favorites list', mediaType, mediaId );
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

    return (
        <Grid item sm={6} md={3} lg={3} xl={3}>
            
                <Card
                    className="featured-media-card"
                    sx={{maxWidth: 345}}
                >
                    <Link href={`/${props.mediaType}/${props.id}`}>
                        <CardMedia
                            className="favorites-card-image"
                            component="img"
                            image={props.imagePath ? `https://image.tmdb.org/t/p/w500/${props.imagePath}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                            title={props.title}
                        />
                    </Link>

                    <div
                        className="featured-media-card-actions"
                    >
                        <Tooltip className="featured-media-icon-buttons" title="Move to Watchlist">
                            <IconButton className="favorites-card-icon" onClick={() => handleMarkWatchlist(props.mediaType, props.id)}>
                                <FontAwesomeIcon icon={faClipboardList}/>
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip className="featured-media-icon-buttons" title="Remove from Favorites">
                            <IconButton className="favorites-card-icon" onClick={() => handleMarkRemove(props.mediaType, props.id)}>
                                <FontAwesomeIcon icon={faTrash}/> 
                            </IconButton>
                        </Tooltip>
                    </div>
                </Card>
            
        </Grid>
    )
}