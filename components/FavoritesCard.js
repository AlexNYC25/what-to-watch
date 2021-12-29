import Link from "next/link";
import { Card, CardActions, CardMedia, IconButton, Grid, Tooltip } from "@mui/material";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faTrash} from '@fortawesome/free-solid-svg-icons';

export default function FavoritesCard(props){

    return (
        <Grid item sm={6} md={3} lg={3} xl={3}>
            <Link href={`/${props.mediaType}/${props.id}`}>
                <Card
                    className="favorites-card"
                    sx={{maxWidth: 345}}
                >
                    <CardMedia
                        className="favorites-card-image"
                        component="img"
                        image={props.imagePath ? `https://image.tmdb.org/t/p/w500/${props.imagePath}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                        title={props.title}
                    />

                    <CardActions
                        className="favorites-card-actions"
                    >
                        <Tooltip title="Move to Watchlist">
                            <IconButton className="favorites-card-icon">
                                <FontAwesomeIcon icon={faClipboardList}/>
                            </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Remove from Favorites">
                            <IconButton className="favorites-card-icon">
                                <FontAwesomeIcon icon={faTrash}/> 
                            </IconButton>
                        </Tooltip>
                    </CardActions>
                </Card>
            </Link>
        </Grid>
    )
}