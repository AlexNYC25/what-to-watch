import { UserProvider } from '@auth0/nextjs-auth0'
import React from 'react';
import '../styles/globals.css'
import '../styles/styles.css'

function MyApp({ Component, pageProps }) {
  return (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
  );
}

export default MyApp
