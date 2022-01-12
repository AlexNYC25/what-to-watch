import Link from 'next/link';
import {Grid, Card, CardMedia } from '@mui/material';

export default function TopRatedCard(props){
    
    return(
        <Grid item xs={6} sm={4} md={3} lg={3} xl={2}>
            <Link href={`/${props.mediaType}/${props.id}`}>
                <Card className="media-card" sx={{maxWidth: 345}}>
                    <CardMedia
                        className="card-image"
                        component="img"
                        image={props.imagePath ? `https://image.tmdb.org/t/p/w500/${props.imagePath}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                        title={props.title}
                    />
                </Card>
            </Link>
        </Grid>
    )
}