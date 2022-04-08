
import * as React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { Slide } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { constants } from '../../constants';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export class InteractiveList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dense: false,
            secondary: false,
            popupOpen: false,
            showProgress: false,
            cardInfo: {}
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

    handleClickOnItem = (card) => {
        this.setState({
            popupOpen: true,
            cardInfo: card
        })
    }

    generate(array) {
        return array.map((value) =>
            <ListItem>
                <ListItemAvatar>
                    <Avatar>
                        <img src={value.imageUrl} style={{ maxWidth: "60px", maxHeight: "50px" }} />
                    </Avatar>
                </ListItemAvatar>
                <Button className="item-button-list" onClick={() => this.handleClickOnItem(value)}>
                    <Grid container>
                        <Grid item xs={3}>
                            <p>
                                ID: {value.id}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <p className='hide-on-small-screen'>
                                Duration: {value.duration}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <p className='hide-on-small-screen'>
                                Is active: {value.isActive.toString()}
                            </p>
                        </Grid>
                        <Grid item xs={3}>
                            <p className='hide-on-small-screen'>
                                {
                                    this.getRarity(value.id)
                                }
                            </p>
                        </Grid>
                    </Grid>
                </Button>

            </ListItem>
        );
    }



    nameOfCard = (id) => {
        if (id === 0) {
            return (
                <p>Name: Wrath</p>
            )

        } else if (id === 1) {
            return <p>Name: Midnight Hunt</p>
        } else if (id === 2) {
            return <p>Name: Blade of Rashes</p>
        } else if (id === 3) {
            return <p>Name: Vampire</p>
        } else if (id === 4) {
            return <p>Name: Sharpening</p>
        } else if (id === 5) {
            return <p>Name: Path of gold</p>
        } else if (id === 6) {
            return <p>Name: Immersion</p>
        }
    }

    getRarity = (id) => {
        if (id === 1 || id === 4) {
            return <p>Common</p>
        } else if (id === 2 || id === 5 || id === 0) {
            return <p>Very rare</p>
        } else if (id === 3 || id === 6) {
            return <p>Rare</p>
        }
    }

    effectOfCard = (card) => {
        return (
            <>
                <p>Effect: {card.effects.attributes[0]["value"]}</p>
                <p>Duration {card.duration}</p>
                <p>{this.getRarity(card.id)}</p>
                <p>Use in game: {card.isActive.toString()}</p>
            </>
        )
    }

    handleActiveCard = async () => {
        let cardTochange = this.state.cardInfo;

        if (this.state.cardInfo.isActive) {
            cardTochange.isActive = false;
            await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/disableCard?id=${this.state.cardInfo.id}`);
        } else {
            cardTochange.isActive = true;
            await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/activateCard?id=${this.state.cardInfo.id}`);
        }

        this.setState({
            cardInfo: cardTochange
        })
    }

    render() {
        return (
            <Box>
                {
                    this.state.popupOpen && (
                        <Dialog
                            open={this.state.popupOpen}
                            TransitionComponent={Transition}
                            keepMounted
                            onClose={this.handleClose}
                            aria-describedby="alert-dialog-slide-description"
                        >
                            <DialogContent>
                                <DialogContentText id="alert-dialog-slide-description">
                                        <CloseIcon 
                                            fontSize='small' 
                                            className={'card-close-button'}
                                            onClick={() => this.setState({popupOpen: false})}
                                         />
                                    {this.nameOfCard(this.state.cardInfo.id)}
                                    <img className='nft-img' src={this.state.cardInfo.imageUrl}></img>
                                    {this.effectOfCard(this.state.cardInfo)}
                                </DialogContentText>
                            </DialogContent>
                            {
                                !this.state.showProgress ?
                                    <DialogActions>
                                        <Grid container style={
                                            { textAlign: "center" }
                                        }>
                                            <Grid item xs={1}></Grid>
                                            <Grid item xs={4}>
                                                <button className='personal-button-opensea' onClick={() => window.open(`https://testnets.opensea.io/assets/${constants.contractNFTAddress}/${this.state.cardInfo.id}`, "_blank")}>View in Opensea</button>
                                            </Grid>
                                            <Grid item xs={2}></Grid>
                                            <Grid item xs={4}>
                                                <button className='personal-button-accept' onClick={this.handleActiveCard}>
                                                    {
                                                        this.state.cardInfo.isActive ? (
                                                            <>Disable</>
                                                        ) : <>Activate</>
                                                    }
                                                </button>
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
                    )
                }

                <Grid container>
                    <Grid item xs={1} />
                    <Grid item xs={10}>
                        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                            <p>Your NFTs</p>
                        </Typography>
                        <div className={'nft-owned-list'}>
                            <List>
                                {this.generate(
                                    this.props.ids
                                )}
                            </List>
                        </div>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
            </Box>
        );
    }

}



