import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';
import React from "react";
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { Container } from '@mui/material';
import axios from 'axios';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Slide } from '@mui/material';
import { Grid } from '@mui/material';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { textAlign } from '@mui/system';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


export class TokenMarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promethium: 0,
            gold: 0,
            active: false,
            promethiumsToReceive: 0
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
            promethiumsToReceive: this.state.gold / 100
        })
    };

    handleClose = () => {
        this.setState({
            open: false
        })
    };

    async componentDidMount() {
        if (typeof window.ethereum !== undefined) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            let contract = new ethers.Contract(constants.contractAddress, constants.contractABI, provider);
            contract.connect(signer);
            let decimals = await contract.decimals();
            let balanceOf = await contract.balanceOf(accounts[0]);
            this.setState({
                promethium: balanceOf.toNumber() / (10 ** decimals)
            })
            this.fetchGoldOfPlayer(accounts[0]);
        }
    }

    async fetchGoldOfPlayer(account) {
        let gold = await axios.get(`https://us-central1-dangermonsters.cloudfunctions.net/api/playerStats?address=${account}`);
        this.setState({
            gold: gold.data.gold
        })
    }

    render() {
        return (
            <>
                <HomeNavbar tabSelected={2} />
                <div>
                    <Dialog
                        open={this.state.open}
                        TransitionComponent={Transition}
                        keepMounted
                        onClose={this.handleClose}
                        aria-describedby="alert-dialog-slide-description"
                    >
                        <DialogContent>
                            <DialogContentText id="alert-dialog-slide-description">
                                <p>You will receive: {this.state.promethiumsToReceive} promethiums</p>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Grid container style={
                                {textAlign: "center"}
                            }>
                                <Grid item xs={1}></Grid>
                                <Grid item xs={4}>
                                    <button className='personal-button-deny' onClick={this.handleClose}>Disagree</button>
                                </Grid>
                                <Grid item xs={2}></Grid>
                                <Grid item xs={4}>
                                    <button className='personal-button-accept' onClick={this.handleClose}>Agree</button>
                                </Grid>
                                <Grid item xs={1}></Grid>
                            </Grid>

                        </DialogActions>
                    </Dialog>
                </div>
                <Container className='home-page-container'>
                    <p>Promethium balance: {this.state.promethium}</p>
                    <p>Gold balance: {this.state.gold}</p>
                    <p>Convert your gold to promethium! <br />For every 100 coins you will get 1 promethium</p>
                    <button onClick={this.handleClickOpen} className='personal-button'><AutorenewIcon fontSize='large'></AutorenewIcon></button>
                </Container>
                <MetamaskButton />
            </>
        )
    }

}