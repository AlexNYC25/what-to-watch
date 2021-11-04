import styles from '../styles/Home.module.css'

import { TextField, Grid } from '@mui/material'

export default function Home() {
  return (
    <Grid container justifyContent="center" alignItems="center" direction="row" id='login-section' className={styles.container}>
      <Grid container alignItems="center" direction="column">
        <div>
          <p>What to Watch</p>
        </div>
        <Grid item>
          <TextField
            id="username-field"
            label="Username"
            variant="outlined"
            className={styles.textField}
            fullWidth
            required
          />

          <TextField
            id="password-field"
            label="Password"
            variant="outlined"
            className={styles.textField}
            fullWidth
            required
          />  

        </Grid>
      </Grid>   
    </Grid>
  )  
}
