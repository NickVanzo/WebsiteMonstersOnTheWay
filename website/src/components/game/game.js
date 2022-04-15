import React from "react";
import { Grid } from "@mui/material";
import Alert from '@mui/material/Alert';
import $ from "jquery";
import { HomeSlider } from "./slider";

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

    openItch = () => {
        window.open('https://allennick.itch.io/monsters-on-the-way', '_blank');
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
                        <h1 id="title-game-page">Play "Monsters on the way" to earn Crypto and NFTs</h1>
                        {/* <AccordionList/> */}
                        <HomeSlider/>
                        <p>
                            Slay monsters and loot treasure to gain Crypto, NFTs and in game gold!<br />
                            Use your gold or your tokens to buy NFTs directly from the market<br />
                            That's all you need to understand, HAVE FUN!
                        </p>
                        <button variant="contained" onClick={this.openItch} className="console-button hide-in-small-screen">
                            <img src="images/console.svg" className="console"></img>
                            <p>Play NOW!</p>
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