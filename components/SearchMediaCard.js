import Link from 'next/link';
import {Card, CardMedia, CardContent, Typography } from '@mui/material';

/*
    props:
        imagePath: string
        title: string
        mediaType: string (movie, tvShow )
        mediaId: string
*/
export default function SearchMediaCard(props) {
    

    return (
        <Link href={`/${props.mediaType}/${props.id}`}>
            <Card
                className="search-card"
                sx={{maxWidth: 345}}
            >
                <CardMedia
                    className="card-image"
                    component="img"
                    image={props.imagePath ? `https://image.tmdb.org/t/p/w500/${props.imagePath}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                    title={props.title}
                />

                
            </Card>
        </Link>
    );
}