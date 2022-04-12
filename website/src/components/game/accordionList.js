import * as React from 'react';
import { AccordionItemPersonal } from './accordionItem';
import { Grid } from '@mui/material';

export class AccordionList extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Grid container>
                    <Grid item xs={2}></Grid>
                    <Grid item xs={8}>
                        <AccordionItemPersonal title={"How can you earn tokens?"} text={"The token of this game is called \"Promethium\".\nYou will find gems of promethiums while looting the dungeons of MonstersOnTheWay."} />
                        <AccordionItemPersonal title={"How can you create NFTs?"} text={"You can find tickets while looting! You can then mint NFTs from the marketplace using your tickets, your promethiums or your ethers.\nYou can then activate the effects of your NFTs from your collection or sell it on OpenSea."} />
                        <AccordionItemPersonal title={"How can I use my NFTs to gain effects in game?"} text={"You can active your NFTs by visiting your colleciton in this site!\nThe effects will be active as soon as you enter a dungeon."} />
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </div >
        );
    }

}