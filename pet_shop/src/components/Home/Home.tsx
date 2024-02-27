import * as _React from 'react';
import { styled } from '@mui/system';
import { Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';


// internal import
import shopImage from '../../assets/images/petbg4.jpg';
import { NavBar } from '../sharedComponents';


interface Props {
    title: string
}

const Root = styled('div')({
    padding: 0,
    margin: 0
})

const Main = styled('main')({
    backgroundImage: `url(${shopImage});`,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center', 
    position: 'absolute',
    marginTop: '10px'
})

const MainText = styled('div')({
    textAlign: 'center',
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
})



export const Home = (props: Props) => {
    return (
        <Root>
            <NavBar />
            <Main>
                <MainText>
                    <Typography variant='h3'> { props.title }</Typography>
                    <Button sx={{ marginTop: '10px'}} component={Link} to={'/shop'} variant='contained'>Find your dream pet</Button>
                </MainText>
            </Main>
        </Root>
    )
}

