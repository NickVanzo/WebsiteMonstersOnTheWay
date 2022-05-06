import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';
import React from "react";
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { Container, Slider } from '@mui/material';
import axios from 'axios';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Slide } from '@mui/material';
import { Grid } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { CircularProgress } from '@mui/material';
import $ from "jquery";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export class TokenMarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            promethium: 0,
            gold: 0,
            goldAvailable: 0,
            active: false,
            promethiumsToReceive: 0,
            address: "",
            showProgress: false,
        }
    }

    hideAlertError = () => {
        setTimeout(() => {
            $("#alert-mint-process-fail").hide();
            this.setState({
                messageAlert: ""
            });
        }, 3000)
    }

    hideAlertOfSuccess = () => {
        setTimeout(() => {
            $("#alert-mint-process-success").hide();
            this.setState({
                messageAlert: ""
            });
        }, 3000)
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

    handleAccept = async () => {
        if (typeof window.ethereum !== undefined) {
            let query = await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/signMintOfTokens`, {
                tokens: `${this.state.promethiumsToReceive * (10 ** 6)}`
            });

            await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/removeGold?address=${this.state.address}&gold=${this.state.gold}`)

            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            let contract = new ethers.Contract(constants.contractAddress, constants.contractABI, signer);
            let trx = await contract.mint(`${query.data.signedMessage.message}`, `${query.data.signedMessage.signature}`);

            this.setState({
                showProgress: true
            })

            await provider.waitForTransaction(trx.hash);
            window.location.reload();
            this.setState({
                open: false,
                showProgress: false,
            })
        }
    }

    handleSetAddress = (addressToSet) => {
        this.setState({
            address: addressToSet
        })
    }

    async componentDidMount() {
        if (typeof window.ethereum !== undefined) {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            let accounts = await provider.send("eth_requestAccounts", []);
            this.setState({
                address: accounts[0]
            })
            let contract = new ethers.Contract(constants.contractAddress, constants.contractABI, provider);

            contract.connect(signer);

            let decimals = await contract.decimals();
            let balanceOf = await contract.balanceOf(this.state.address);
            this.setState({
                promethium: balanceOf.toNumber() / (10 ** decimals)
            })
            this.fetchGoldOfPlayer();
        }
    }

    async fetchGoldOfPlayer(account) {
        let gold = await axios.get(`https://us-central1-dangermonsters.cloudfunctions.net/api/playerStats?address=${this.state.address}`);
        this.setState({
            gold: gold.data.gold,
            goldAvailable: gold.data.gold
        })
        $("#slider-gold").val(this.state.gold);
    }

    handleChange = (event, newValue) => {
        this.setState({
            gold: newValue,
            promethiumsToReceive: newValue / 100
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
                                <p>You spend: {this.state.gold}</p>
                                <p>You will receive: {this.state.promethiumsToReceive} promethiums</p>
                            </DialogContentText>
                            <Slider
                                style={{ maxWidth: 500 }}
                                value={this.state.gold}
                                min={0}
                                max={this.state.goldAvailable}
                                step={1}
                                onChange={this.handleChange}
                                valueLabelDisplay="auto"
                                aria-labelledby="non-linear-slider"
                                id="slider-gold"
                            />
                        </DialogContent>
                        {
                            !this.state.showProgress ?
                                <DialogActions>
                                    <Grid container style={
                                        { textAlign: "center" }
                                    }>
                                        <Grid item xs={1}></Grid>
                                        <Grid item xs={4}>
                                            <button className='personal-button-deny' onClick={this.handleClose}>Disagree</button>
                                        </Grid>
                                        <Grid item xs={2}></Grid>
                                        <Grid item xs={4}>
                                            <button className='personal-button-accept' onClick={this.handleAccept}>Agree</button>
                                        </Grid>
                                        <Grid item xs={1}></Grid>
                                    </Grid>

                                </DialogActions>
                                :
                                <DialogActions>
                                    <Grid container style={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <CircularProgress />
                                        </Grid>
                                    </Grid>
                                </DialogActions>
                        }
                    </Dialog>
                </div>
                <Container className='token-page-container'>
                    <p>Promethium balance: {this.state.promethium}</p>
                    <p>Gold balance: {this.state.gold}</p>
                    <p>Convert your gold coins to promethium! <br />For every 100 coins you will get 1 promethium</p>
                    <button onClick={this.handleClickOpen} className='personal-button'><AutorenewIcon fontSize='large'></AutorenewIcon></button>
                </Container>
                <MetamaskButton callbackFunction={this.handleSetAddress} />
            </>
        )
    }

}