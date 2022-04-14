import { Container, Grid } from '@mui/material';
import * as React from 'react';
import Slider from "react-slick";

export class HomeSlider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const settings = {
            accessibility: true,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true,
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        return (
            <div>
                <Slider className='slider' {...settings}>
                    <p className='text-in-slider'>
                        Play to earn the in-game currency: the Promethium
                        <Grid container>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4} style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                <img src='/images/diamond.svg' className='diamond'></img>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                    </p>
                    <p>
                        Find the tickets to mint new NFTs directly from our marketplace 
                        <Grid container>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4} style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                <img src='/images/store.svg' className='store  '></img>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                    </p>
                    <p>
                        Use the cards in your collection to acquire powerfull skills
                        <Grid container>
                            <Grid item xs={4}></Grid>
                            <Grid item xs={4} style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                                <img src='/images/axe.svg' className='axe'></img>
                            </Grid>
                            <Grid item xs={4}></Grid>
                        </Grid>
                    </p>
                </Slider>
            </div>
        );
    }

}