import * as _React from 'react';
import { useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Card,
    CardContent,
    CardMedia,
    Grid,
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogContentText,
    Stack,
    Typography,
    Snackbar,
    Alert
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { useForm, SubmitHandler } from 'react-hook-form';
import { getDatabase, ref, push } from 'firebase/database';

// internal imports
import { useGetShop, ShopProps } from '../../customHooks';
import { NavBar, InputText } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { MessageType } from '../Auth';


export interface SubmitProps {
    quantity: string
}

interface CartProps {
    cartItem: ShopProps
}


export const shopStyles = {
    main: {
        backgroundColor: theme.palette.secondary.main,
        height: '100%',
        width: '100%',
        color: 'black',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        position: 'absolute',
        overflow: 'auto',
        paddingBottom: '100px'
    },
    grid: {
        marginTop: '25px',
        marginRight: 'auto',
        marginLeft: 'auto',
        width: '70vw'
    },
    card: {
        width: "300px", 
        padding: '10px',
        display: "flex",
        flexDirection: "column",
        backgroundColor: theme.palette.secondary.light,
        border: '3px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    cardMedia: {
        width: '95%',
        margin: 'auto',
        marginTop: '5px',
        aspectRatio: '1/1',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        borderRadius: '10px'
    },
    button: {
        color: 'black', 
        borderRadius: '50px',
        height: '45px',
        width: '250px',
        marginTop: '10px'
    },
    stack: {
        width: '75%', 
        marginLeft: 'auto', 
        marginRight: 'auto'
    },
    stack2: {
        border: '1px solid', 
        borderColor: theme.palette.primary.main, 
        borderRadius: '50px', 
        width: '100%',
        marginTop: '10px'
    },
    typography: { 
        color: "black", 
        marginTop: '100px', 
        display: 'flex',  
        justifyContent: 'center', 
    }
}


const AddToCart = (cart: CartProps) => {
    const db = getDatabase();
    const [ open, setOpen ] = useState(false);
    const [ message, setMessage ] = useState<string>()
    const [ messageType, setMessageType ] = useState<MessageType>()
    const { register, handleSubmit } = useForm<SubmitProps>()
    let myCart = cart.cartItem

    const onSubmit: SubmitHandler<SubmitProps> = async (data, event) => {
        if (event) event.preventDefault();

        const userId = localStorage.getItem('uuid');
        const cartRef = ref(db, `carts/${userId}/`);

        (myCart.quantity > parseInt(data.quantity)) ? myCart.quantity = parseInt(data. quantity) : ""

        push(cartRef, myCart)
        .then((_newCartRef) => {
            setMessage(`Successfully added item ${myCart.animal_type} to Cart`)
            setMessageType('success')
            setOpen(true)
        })
        .then(() => {
            setTimeout(() => window.location.reload(), 2000)
        })
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }

    return (
        <Box>
            <form onSubmit = {handleSubmit(onSubmit)}>
                <Box>
                    <label htmlFor='quantity'>How much of {myCart.animal_type} do you want?</label>
                    <InputText {...register('quantity')} name='quantity' placeholder='Quantity Here' />
                </Box>
                <Button type='submit'>Submit</Button>
            </form>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
            >
                <Alert severity = {messageType}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    )

}



export const Shop = () => {

    const { shopData } = useGetShop();
    const [ currentShop, setCurrentShop ] = useState<ShopProps>();
    const [ cartOpen, setCartOpen ] = useState(false);
    
    console.log(shopData)

    return (
        <Box sx={ shopStyles.main }>
            <NavBar />
            <Typography variant ='h4' sx={ shopStyles.typography }>
                The Dream Pet Shop
            </Typography>
            <Grid container spacing={3} sx={ shopStyles.grid }>
                { shopData.map(( shop: ShopProps, index: number ) => (
                    <Grid item key={index} xs={12} md={6} lg={4}>
                        <Card sx={ shopStyles.card }>
                            <CardMedia
                                component='img'
                                sx={ shopStyles.cardMedia }
                                image={ shop.image }
                                alt = { shop.animal_type }
                            />
                            <CardContent>
                                <Stack
                                    direction='column'
                                    justifyContent='space-between'
                                    alignItems='center'
                                >
                                    <Stack
                                        direction='row'
                                        alignItems='center'
                                        justifyContent='space-between'
                                    >
                                        <Accordion sx={{ width: '270px', backgroundColor: theme.palette.secondary.light }}>
                                            <AccordionSummary expandIcon={<HelpIcon sx={{ color: theme.palette.primary.main }} /> }>
                                                <Typography>{shop.animal_type}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>Color: {shop.color}</Typography>
                                                <Typography>Quantity: {shop.quantity}</Typography>
                                                <Typography>{shop.description}</Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Stack>
                                    <Button
                                        variant='outlined'
                                        size='medium'
                                        sx={shopStyles.button}
                                        onClick = { () => { setCartOpen(true); setCurrentShop(shop) }}
                                    >
                                        Add to Cart - ${parseFloat(shop.price).toFixed(2)}
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>                    
                ))}
            </Grid>
            <Dialog open={cartOpen} onClose={() => setCartOpen(false)}>
                <DialogContent>
                    <DialogContentText>Add to Cart</DialogContentText>
                    <AddToCart cartItem = {currentShop as ShopProps} />
                </DialogContent>
            </Dialog>
        </Box>
    )
}