
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { AppBar, Divider, IconButton, Link, Toolbar, Typography } from '@mui/material';

import { useUser } from '@auth0/nextjs-auth0'

import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faUser, faCheck, faStar, faSignOutAlt, faSignInAlt, faSearch, faAward, faBookOpen } from '@fortawesome/free-solid-svg-icons'

const drawerWidth = 240;

export default function Layout(props) {

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const {user, error, isLoading} = useUser();

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    let drawerItems = () => {
        if(user) {
            return (
                <List>
                    <ListItem button key="profile">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faUser} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Profile" />
                        </Link>
                    </ListItem>
                    <ListItem button key="watchlist">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faCheck} />
                        </ListItemIcon>
                        <Link href="/watchlist" color="inherit" underline="none">
                            <ListItemText primary="Watchlist" />
                        </Link>
                    </ListItem>
                    <ListItem button key="favorites">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faStar} />
                        </ListItemIcon>
                        <Link href="/favorites" color="inherit" underline="none">
                            <ListItemText primary="Favorites" />
                        </Link>
                    </ListItem>
                    <ListItem button key="logout">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Logout" />
                        </Link>
                    </ListItem>
                    <Divider />
                    <ListItem button key="discover">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faBookOpen} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Discover" />
                        </Link>
                    </ListItem>
                    <ListItem button key="topRated">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faAward} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Top Rated" />
                        </Link>
                    </ListItem>
                    <ListItem button key="search">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faSearch} />
                        </ListItemIcon>
                        <Link href="/search" color="inherit" underline="none">
                            <ListItemText primary="Search"/>
                        </Link>
                    </ListItem>
                </List>
            )
        } else {
            return (
                <List>
                    <ListItem button key="login">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faSignInAlt} />
                        </ListItemIcon>
                        <Link href="/api/auth/login" color="inherit" underline="none">
                            <ListItemText primary="Log In" />
                        </Link>
                    </ListItem>
                    <Divider />
                    <ListItem button key="discover">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faBookOpen} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Discover" />
                        </Link>
                    </ListItem>
                    <ListItem button key="topRated">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faAward} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Top Rated" />
                        </Link>
                    </ListItem>
                    <ListItem button key="search">
                        <ListItemIcon>
                            <FontAwesomeIcon icon={faSearch} />
                        </ListItemIcon>
                        <Link href="" color="inherit" underline="none">
                            <ListItemText primary="Search" />
                        </Link>
                    </ListItem>
                </List>
            )
        }
    }

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
                {drawerItems()}
            <Divider />
            
        </div>
    );
    
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        Text
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        What to Watch
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                    >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {props.children}
            </Box>
        </Box>
    )
}