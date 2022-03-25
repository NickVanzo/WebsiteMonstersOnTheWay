import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";


export function Game(props) {
    return (
        <Grid container className={"home-page-container"}>
            <Grid item xs={1} />
            <Grid item xs={10}>
                <h1>Play "Monsters on the way" to earn Crypto and NFTs</h1>
                <h2>This is the project for my thesis</h2>
                <p>
                    Slay monsters and loot treasure to gain Crypto, NFTs and in game gold!<br />
                    Use your gold or your tokens to buy NFTs directly from the market<br />
                    That's all you need to understand, HAVE FUN!
                </p>
                <Button variant="contained">
                    <a href="https://allennick.itch.io/monsters-on-the-way">Open on itch.io</a>
                </Button>
            </Grid>
            <Grid item xs={1} />
        </Grid>

    )
}