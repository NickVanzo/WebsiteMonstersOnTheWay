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
                        <AccordionItemPersonal title={"How can you earn tokens?"} text={""} />
                        <AccordionItemPersonal title={"How can you create NFTs?"} text={""} />
                        <AccordionItemPersonal title={"How can I use my NFTs to gain effects in game?"} text={"You can active your NFTs by visiting your colleciton in this site!\nThe effects will be active as soon as you enter a dungeon."} />
                    </Grid>
                    <Grid item xs={2}></Grid>
                </Grid>
            </div >
        );
    }

}