import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import Alert from '@mui/material/Alert';
import $ from "jquery";
import { AccordionList } from "./accordionList";

export class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
            alertMessage: ""
        }
    }

    componentDidMount = () => {
        $("#alert-game").hide();
    }

    showAlert = () => {
        $("#alert-game").show()
        this.setState({
            alertMessage: "Please use a PC to play the game"
        });
        setTimeout(() => {
            $("#alert-game").hide();
            this.setState({
                alertMessage: ""
            })
        }, 3000);
    }

    render() {
        return (
            <>
                <Alert variant="filled" severity="error" id="alert-game" style={{zIndex: 2, position: "fixed"}}>
                    {this.state.alertMessage}
                </Alert>
                <Grid container className={"home-page-container"}>
                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <h1>Play "Monsters on the way" to earn Crypto and NFTs</h1>
                        <AccordionList/>
                        <h2>This is the project for my thesis</h2>
                        <p>
                            Slay monsters and loot treasure to gain Crypto, NFTs and in game gold!<br />
                            Use your gold or your tokens to buy NFTs directly from the market<br />
                            That's all you need to understand, HAVE FUN!
                        </p>
                        <button variant="contained" className="personal-button hide-in-small-screen">
                            <a href="https://allennick.itch.io/monsters-on-the-way">Open on itch.io</a>
                        </button>
                        <button onClick={this.showAlert} variant="contained" className="personal-button hide-in-big-screen">
                            Open on itch.io
                        </button>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </>
        )
    }
}