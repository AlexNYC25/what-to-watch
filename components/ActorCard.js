import { Grid, Typography } from "@mui/material";

export default function ActorCard(props){

    return (
        <Grid
            item
            key={props.id}
            xs={6} sm={6} md={2} lg={2} xl={2}
        >
            <img
                className="actor-card-image"
                src={ props.profile_path ?  'https://image.tmdb.org/t/p/w500/' + props.profile_path : 'https://via.placeholder.com/300x450?text=Actor+Not+Found'}
                alt={props.name}
            />
            <Typography
                classname="actor-card-name"
                variant="body1"
            >
                {props.name}
            </Typography>
            
            
        </Grid>
    )
}