import {Grid } from '@mui/material';

export default function ProviderLogo(props) {

    return (
        <Grid
            key={props.provider_id}
            sx={{mx:0.5}}
            xs={2} sm={2} md={2} lg={1}
            item
        >
            <img
                className="provider-logo-image"
                src={ props.logo_path ? `https://image.tmdb.org/t/p/w500/${props.logo_path}` : 'https://via.placeholder.com/300x450?text=Movie+Not+Found'}
                alt={props.provider_name}
            />
        </Grid>


    )
}