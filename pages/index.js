import styles from '../styles/Home.module.css'

import { Container } from '@mui/material'
import React from 'react'

import Layout from '../components/Layout'

export default function Home({Component, pageProps}) {

  return (
    <Layout>
      <Container sx={{mt:10, mb:5}}>
        <p>Welcome to What To Watch</p>
      </Container>
    </Layout>
  )  
}
