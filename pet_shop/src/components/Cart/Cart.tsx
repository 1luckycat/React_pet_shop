import * as _React from 'react';
import { useState, useEffect } from 'react';
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
import Help from '@mui/icons-material/Help';
import PetsIcon from '@mui/icons-material/Pets';
import { getDatabase, ref, onValue, off, remove, update } from 'firebase/database';


// internal imports
import { NavBar } from '../sharedComponents';
import { theme } from '../../Theme/themes';
import { ShopProps } from '../../customHooks';
import { shopStyles } from '../Shop';
import { serverCalls } from '../../api';
import { MessageType } from '../Auth';


export const Cart = () => {

    const db = getDatabase();
    const [ open, setOpen ] = useState(false);
    const [ message, setMessage ] = useState<string>();
    const [ messageType, setMessageType ] = useState<MessageType>();
    const [ currentCart, setCurrentCart ] = useState<ShopProps[]>();
    const userId = localStorage.getItem('uuid');
    const cartRef = ref(db, `carts/${userId}/`);

    useEffect(() => {

        onValue(cartRef, (snapshot) => {
            const data = snapshot.val()
            console.log(data)
            let cartList = []

            if (data) {
                for (let [key, value] of Object.entries(data)){
                    let cartItem = value as ShopProps
                    cartItem['id'] = key
                    cartList.push(cartItem)
                }
            }

            setCurrentCart(cartList as ShopProps[])

        })

        return () => {
            off(cartRef)
        }
    }, [] )
    console.log(currentCart)


    const updateQuantity = async (id: string, operation: '-' | '+') => {

        const dataIndex: number = currentCart?.findIndex((cart) => cart.id === id) as number

        const updateCart = [...currentCart as ShopProps[]]
        operation === '-' ? updateCart[dataIndex].quantity -= 1 : updateCart[dataIndex].quantity += 1

        setCurrentCart(updateCart)
   
    }


    const updateCart = async ( cartItem: ShopProps ) => {

        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)

        update(itemRef, {
            quantity: cartItem.quantity
        })
        .then(() => {
            setMessage(`Successfully updated your cart`)
            setMessageType('success')
            setOpen(true)
        })
        .then(() => { setTimeout ( () => window.location.reload(), 2000)})
        .catch((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }


    const deleteItem = async ( cartItem: ShopProps ) => {
        const itemRef = ref(db, `carts/${userId}/${cartItem.id}`)

        remove(itemRef)
        .then(() => {
            setMessage('Successfully deleted item from Cart')
            setMessageType('success')
            setOpen(true)
        })
        .then(() => { setTimeout (() => window.location.reload(), 2000)})
        .catch ((error) => {
            setMessage(error.message)
            setMessageType('error')
            setOpen(true)
        })
    }


    return (
        <Box sx={ shopStyles.main }>
            <NavBar />
            <Stack
                direction='column' alignItems='center' sx={ shopStyles.main }
            >
                <Stack
                    direction='row'
                    alignItems = 'center'
                    justifyContent='space-between'
                    sx={{ marginTop: '100px', width: '400px'}}
                >
                    <Typography variant='h4' sx={{ marginRight: '20px'}}>
                        Your Cart
                    </Typography>
                    <Button
                        variant='contained'
                        color='primary'
                        onClick={() => {}}
                        sx= {{ width: '150px', gap: '10px'}}
                    >
                        Checkout <PetsIcon />
                    </Button>
                </Stack>
                <Grid container spacing={3} sx={ shopStyles.grid }>
                    { currentCart?.map((cart: ShopProps, index: number ) => (
                        <Grid item key={index} xs={12} md={6} lg={4}>
                            <Card sx={ shopStyles.card }>
                                <CardMedia
                                    component = 'img'
                                    sx = { shopStyles.cardMedia }
                                    image = { cart.image }
                                    alt = { cart.animal_type }
                                />
                                    <CardContent>
                                        <Stack
                                            direction='column'
                                            justifyContent='space-between'
                                            alignItems='center'
                                        >
                                            <Accordion sx={{ color: 'black', backgroundColor: theme.palette.secondary.light, width: '270px' }}>
                                                <AccordionSummary
                                                    expandIcon = {<Help sx={{ color: theme.palette.primary.main }}/>}
                                                >
                                                    <Typography>{cart.animal_type}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography>{cart.color}</Typography>
                                                    <Typography>{cart.description}</Typography>
                                                </AccordionDetails>
                                            </Accordion>
                                            <Stack
                                                direction='row'
                                                alignItems='center'
                                                justifyContent="space-between"
                                                sx={ shopStyles.stack2 }
                                            >
                                                <Button
                                                    size='large'
                                                    variant='text'
                                                    onClick= { () => updateQuantity( cart.id, '-') }
                                                >
                                                    -
                                                </Button>
                                                <Typography variant='h6' sx={{ color: 'black'}}>
                                                    { cart.quantity }
                                                </Typography>
                                                <Button
                                                    size='large'
                                                    variant='text'
                                                    onClick= { () => updateQuantity( cart.id, '+') }
                                                >
                                                    +
                                                </Button>
                                            </Stack>
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                sx = { shopStyles.button }
                                                onClick= { () => updateCart(cart)}
                                            >
                                                Update Quantity - ${(cart.quantity * parseFloat(cart.price)).toFixed(2)}
                                            </Button>
                                            <Button
                                                variant='outlined'
                                                size='medium'
                                                sx= { shopStyles.button }
                                                onClick= { () => deleteItem(cart) }
                                            >
                                                Delete Item from Cart
                                            </Button>
                                        </Stack>
                                    </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose = { () => setOpen(false) }
            >
                <Alert severity= { messageType }>
                    {message}
                </Alert>
            </Snackbar>
        </Box>

    )
}