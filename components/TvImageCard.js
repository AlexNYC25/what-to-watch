import { Grid } from "@mui/material";

export default function TvImageCard(props){
    return (
        <Grid
            key={props.id}
            xs={6} sm={6} md={4} lg={2} xl={2}
            item
        >
            <a
                href={'/tvShow/' + props.id}
            >
                <img
                    className="media-image-card-image"
                    src={ props.poster_path ?  'https://image.tmdb.org/t/p/w500/' + props.poster_path : 'https://via.placeholder.com/300x450?text=TV+Show+Not+Found'} 
                    alt={props.name} 
                />
            </a>
        </Grid>
    )
}