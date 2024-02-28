import * as _React from 'react';
import { useState } from 'react';
import {
    Button,
    Drawer, 
    ListItemButton,
    List,
    ListItemText,
    AppBar,
    Toolbar,
    IconButton,
    Stack, 
    Typography,
    Divider, 
    CssBaseline,
    Box 
} from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import CottageIcon from '@mui/icons-material/Cottage';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import PetsIcon from '@mui/icons-material/Pets';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import { signOut, getAuth } from 'firebase/auth';


// internal imports
import { theme } from '../../../Theme/themes';
import { blue } from '@mui/material/colors';

const drawerWidth = 200;

const navStyles = {
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut, 
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    hide: {
        display: 'none'
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    drawerHeader: {
        display: 'flex',
        width: drawerWidth,
        alignItems: 'center',
        padding: theme.spacing(1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    toolbar: {
        display: 'flex'
    }, 
    toolbarButton: {
        marginLeft: 'auto',
        color: theme.palette.primary.contrastText
    },
    signInStack: {
        position: 'absolute',
        top: '20%',
        right: '50px'
    }
}



export const NavBar = () => {
    const [open, setOpen ] = useState(false)
    const navigate = useNavigate();
    const auth = getAuth();
    const myAuth = localStorage.getItem('auth');


    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }


    const navLinks = [
        {
            text: 'Home',
            icon: <CottageIcon sx={{ color: blue[200] }}/>,
            onClick: () => navigate('/')
        },
        {
            text: myAuth === 'true' ? 'Shop' : 'Sign In',
            icon: myAuth === 'true' ? <PetsIcon sx={{ color: blue[200] }}/> : <ShoppingBasketIcon sx={{ color: blue[200] }}/>,
            onClick: () => navigate(myAuth === 'true' ? '/shop' : '/auth')
        },
        {
            text: myAuth === 'true' ? 'Cart' : '',
            icon: myAuth === 'true' ? <ShoppingCartIcon sx={{ color: blue[200] }}/> : '',
            onClick: myAuth === 'true' ? () => navigate('/cart') : () => {}
        }
    ]

    let buttonText: string
    myAuth === 'true' ? buttonText = 'Sign Out' : buttonText = 'Sign In'

    const signInButton = async () => {
        if (myAuth === 'false') {
            navigate('/auth')
        } else {
            await signOut(auth)
            localStorage.setItem('auth', 'false')
            localStorage.setItem('user', "")
            localStorage.setItem('uuid', "")
            navigate('/')
        }
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                sx={ open ? navStyles.appBarShift : navStyles.appBar }
                position = 'fixed'
            >
                <Toolbar sx={ navStyles.toolbar }>
                    <IconButton
                        color = 'inherit'
                        aria-label = 'open drawer'
                        onClick = { handleDrawerOpen }
                        edge = 'start'
                        sx = { open ? navStyles.hide : navStyles.menuButton }
                    >
                        <FlutterDashIcon />
                    </IconButton>
                </Toolbar>
                <Stack
                    direction='row'
                    justifyContent='center'
                    alignItems='center'
                    sx = { navStyles.signInStack }
                >
                    <Typography variant='body2' sx={{ color: 'inherit' }}>
                        {localStorage.getItem('user')}
                    </Typography>
                    <Button
                        variant = 'contained'
                        color = 'info'
                        size = 'large'
                        sx = {{ marginLeft: '20px'}}
                        onClick = { signInButton }
                    >
                        { buttonText }
                    </Button>
                </Stack>
            </AppBar>
            <Drawer
                sx = { open ? navStyles.drawer : navStyles.hide }
                variant = 'persistent'
                anchor = 'left'
                open = {open}
            >
                <Box sx = { navStyles.drawerHeader }>
                    <IconButton onClick={handleDrawerClose}>
                        <FlutterDashIcon />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    { navLinks.map ((item) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItemButton key={text} onClick={onClick}>
                                <ListItemText primary={text} />
                                { icon }
                            </ListItemButton>
                        )
                    })}
                </List>
            </Drawer>
        </Box>
    )
}