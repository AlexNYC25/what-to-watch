import styles from '../styles/Home.module.css'

import React from 'react'
import axios from 'axios'

import { useUser } from '@auth0/nextjs-auth0';

import { useEffect } from 'react';

import Layout from '../components/Layout';

export default function UserPage() {
    const { user, error, isLoading } = useUser();


    if(isLoading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>{error.message}</p>
    }

    if(!user) {
        return (
            <Layout>
                <div className={styles.container}>
                    <p>You are not logged in.</p>
                </div>
                
            </Layout>
        )    
    }

    useEffect(() => {

        axios.get('/api/userDetails').then((response) => {
            console.log(response)
        })
    }, [])
    
    return (
        

            <Layout>
                <div className={styles.container}>
                    <h1>User Page</h1>
                    <p>Your email is {user.email} </p>
                
                    <p>{JSON.stringify(user)}</p>
                </div>
            </Layout>

        
    )
}