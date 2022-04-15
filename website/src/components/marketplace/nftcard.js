import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { BigNumber, ethers } from 'ethers';
import { constants } from '../../constants';
import { Alert, CircularProgress, Grid } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import $ from "jquery";
import axios from 'axios';
import { Button, CardActions } from '@material-ui/core';

export default class NFTCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgToDisplay: 1,
            srcOfImgToDisplay: '/images/1.jpeg',
            feeETH: 0,
            processingIndexing: false,
            processingTicketPayment: false,
            processingForTicketEnded: false,
            processingEnded: false,
            cardMinted: {},
            messageAlert: "",
            commonTickets: 0,
            rareTickets: 0,
            veryRareTickets: 0
        }
    }

    async componentDidMount() {
        $("#alert-mint-process-fail").hide();
        $("#alert-mint-process-success").hide()
        this.changeImageOverTime();
        let contract = this.connectToSmartContract();
        let fee = await this.fetchFee(contract.contract);
        this.setState({
            feeETH: fee
        });
        const tickets = await this.retrieveDataOfUser();
        this.setState({
            commonTickets: tickets.data.commonTickets,
            rareTickets: tickets.data.rareTickets,
            veryRareTickets: tickets.data.veryRareTickets
        })

    }

    retrieveDataOfUser = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let address = await signer.getAddress();
        let tickets = await axios.get(`https://us-central1-dangermonsters.cloudfunctions.net/api/playerStats?address=${address.toLowerCase()}`);
        return tickets;
    }

    connectToSmartContract = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);
        let address = await signer.getAddress()
        return {
            contract: contract,
            provider: provider,
            address: address
        };
    }

    loadNextImage = (index) => {
        this.setState({
            imgToDisplay: index,
            srcOfImgToDisplay: `/images/${this.state.imgToDisplay}.jpeg`
        })
    }

    changeImageOverTime = () => {
        let i = 1;
        const numberOfCards = 8;
        setInterval(() => {
            if (!this.state.processingEnded) {
                this.loadNextImage((this.state.imgToDisplay % numberOfCards) + 1);
                i++;
            }
        }, 500);
    }

    generateRandomURI = () => {
        let id = Math.floor(Math.random() * 6);
        const uri = this.randomUri(id);
        return {
            uri: uri,
            id: id
        };
    }

    generateRandomURIGivenRarity = (rarity) => {
        let uri = '';
        let idsForCommonCards = [4, 1, 6];
        let idsForRareCards = [3];
        let idsForVeryRareCards = [0, 2, 5];
        let idForCard = 0;
        if (rarity === 'veryRare') {
            let randomId = Math.floor(Math.random() * idsForVeryRareCards.length);
            uri = this.randomUri(idsForVeryRareCards[randomId]);
            idForCard = idsForVeryRareCards[randomId];
            //rashes
            //path of gold
            //wrath
        } else if (rarity === 'rare') {
            //vampire
            let randomId = Math.floor(Math.random() * idsForRareCards.length);
            uri = this.randomUri(idsForRareCards[randomId]);
            idForCard = idsForRareCards[randomId];
        } else {
            //midnight hunt
            //sharpening
            //immersion
            let randomId = Math.floor(Math.random() * idsForCommonCards.length);
            uri = this.randomUri(idsForCommonCards[randomId]);
            idForCard = idsForCommonCards[randomId];
        }
        return {
            uri: uri,
            id: idForCard
        };
    }

    retrieveMessageSignedByOwner = async () => {
        let messageSignedAndSignature = await axios.post('https://us-central1-dangermonsters.cloudfunctions.net/api/signMintOfTokens', {
            tokens: '0'
        });
        return {
            signedMessage: messageSignedAndSignature.data['signedMessage']['message'],
            signature: messageSignedAndSignature.data['signedMessage']['signature']
        }
    }

    handleMintWithTicket = async (rarity) => {
        if (typeof window.ethereum !== undefined) {
            let blockchain = await this.connectToSmartContract();
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            if (rarity === 'common') {
                this.setState({
                    commonTickets: this.state.commonTickets - 1
                })
            } else if (rarity === 'rare') {
                this.setState({
                    rareTickets: this.state.rareTickets - 1
                })
            } else {
                this.setState({
                    veryRareTickets: this.state.veryRareTickets - 1
                })
            }
            const uri = this.generateRandomURIGivenRarity(rarity);
            let card = {
                id: uri.id,
                name: this.nameOfCard(uri.id),
                uri: uri.uri
            }
            this.setState({
                cardMinted: card
            })
            let signedMessageAndSignature = await this.retrieveMessageSignedByOwner();
            let trx = await blockchain.contract.safeMintWithTicket(
                signedMessageAndSignature.signedMessage,
                signedMessageAndSignature.signature,
                accounts[0],
                card.uri
            );
            this.setState({
                processingTicketPayment: true
            })
            let receipt = await blockchain.provider.waitForTransaction(trx.hash);
            await this.addNftInDB();
            card.hash = receipt.transactionHash
            let img = this.getImgFromName(card.name);
            this.setState({
                processingForTicketEnded: true,
                srcOfImgToDisplay: img
            })
            $("#alert-mint-process-success").show();
            this.setState({
                messageAlert: 'Purchase successful'
            })
            this.hideAlertOfSuccess();
            await this.removeTicket(accounts[0], rarity);
        }
    }

    removeTicket = async (address, rarity) => {
        await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/removeTicket?address=${address.toLowerCase()}&rarity=${rarity}`);
    }

    handleMintWithPromethium = async () => {
        if (typeof window.ethereum !== undefined) {

            let blockchain = await this.connectToSmartContract();
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            let uri = this.generateRandomURI();
            let card = {
                id: uri.id,
                name: this.nameOfCard(uri.id),
                uri: uri.uri
            }
            this.setState({
                cardMinted: card
            })
            if (await this.userHasEnoughPromethium(blockchain, 10)) {
                let trx = await blockchain.contract.safeMintWithTokens(`${blockchain.address}`, `${uri.uri}`);
                this.setState({
                    processingIndexing: true
                })
                let receipt = await blockchain.provider.waitForTransaction(trx.hash);
                card.hash = receipt.transactionHash
                let img = this.getImgFromName(card.name);
                this.setState({
                    processingEnded: true,
                    srcOfImgToDisplay: img
                })
                await this.addNftInDB();
                $("#alert-mint-process-success").show();
                this.setState({
                    messageAlert: 'Purchase successful'
                })
                this.hideAlertOfSuccess();
            } else {
                $("#alert-mint-process-fail").show();
                this.setState({
                    messageAlert: 'You don\'t have enough Promethium'
                })
                this.hideAlertError();
            }
        }
    }

    addNftInDB = async () => {
        const blockchain = await this.connectToSmartContract();
        const id = await blockchain.contract.lastIdMinted();
        console.log(parseInt(ethers.utils.formatUnits(id[0]._hex, 0)) - 1);
        await axios.post(`https://us-central1-dangermonsters.cloudfunctions.net/api/addNft?id=${parseInt(ethers.utils.formatUnits(id[0]._hex, 0)) - 1}&uri=${this.state.cardMinted.uri}`);
    }

    handleMintWithETH = async () => {
        if (typeof window.ethereum !== undefined) {
            let provider = new ethers.providers.Web3Provider(window.ethereum);
            let signer = provider.getSigner();
            const accounts = await provider.send("eth_requestAccounts", []);
            let blockchain = await this.connectToSmartContract();
            const fee = await this.fetchFee(blockchain);
            let uri = this.generateRandomURI();
            const options = {
                value: ethers.utils.parseEther(`${fee}`)
            }
            let card = {
                id: uri.id,
                name: this.nameOfCard(uri.id),
                uri: uri.uri
            }
            this.setState({
                cardMinted: card
            })
            if (this.userHasEnoughEth(blockchain, fee)) {
                const trx = await blockchain.contract.safeMint(`${blockchain.address}`, `${uri.uri}`, options);
                this.setState({
                    processingIndexing: true
                })
                let receipt = await blockchain.provider.waitForTransaction(trx.hash);
                await this.addNftInDB();

                card.hash = receipt.transactionHash
                let img = this.getImgFromName(card.name);
                this.setState({
                    processingEnded: true,
                    srcOfImgToDisplay: img,
                    messageAlert: 'Mint successful'
                })
                $("#alert-mint-process-success").show();
                this.setState({
                    messageAlert: 'Purchase successful'
                })
                this.hideAlertOfSuccess();
            } else {
                $("#alert-mint-process-fail").show();
                this.setState({
                    messageAlert: 'You don\'t have enough ETH'
                })
                this.hideAlertOfError();
            }
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

    userHasEnoughEth = async (blockchain, fee) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(blockchain.address);
        const balanceInEth = ethers.utils.formatEther(balance._hex).toString();
        return balanceInEth >= fee ? true : false
    }

    userHasEnoughPromethium = async (blockchain, fee) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractAddress, constants.contractABI, signer);
        let address = await signer.getAddress()
        const balance = await contract.balanceOf(address);
        return balance.toNumber() >= fee ? true : false
    }

    nameOfCard = (id) => {
        if (id === 0) {
            return "Wrath"
        } else if (id === 1) {
            return "Midnight Hunt"
        } else if (id === 2) {
            return "Blade of Rashes"
        } else if (id === 3) {
            return "Vampire"
        } else if (id === 4) {
            return "Sharpening"
        } else if (id === 5) {
            return "Path of gold"
        } else if (id === 6) {
            return "Immersion";
        }
    }

    fetchFee = async (blockchain) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, provider);
        const feeBN = await contract.getFee();
        return ethers.utils.formatEther(feeBN._hex).toString();
    }

    randomUri = (id) => {
        let uri = '';
        switch (id) {
            case 0:
                uri = 'QmcASoo86H9dboZoL6CQ18MBPbaVkF82ydr7mBUwzXMmYh';
                break;
            case 1:
                uri = 'QmUVccUPYCnaJqT6NrDjfiScQdjTiBaBrFRDuFXV6snL3t';
                break;
            case 2:
                uri = 'QmWcqbvK5qkJRkrfokhnQHk6tc6hzjQjM3ZuRiQLa7KQBv';
                break;
            case 3:
                uri = 'QmQLVp88bgYvpgYh9aPowHKSQ3RCaT9s472yoirgwXyDaW';
                break;
            case 4:
                uri = 'QmWCvjL4JKWuwmbK6rCjGAWnEztnW8DMHNZDAucq6thXmx';
                break;
            case 5:
                uri = 'QmP4dt9ByjwDqwCvx2goTUCcFuU9u7DhhyfhnPb6mtGWa2';
                break;
            case 6:
                uri = 'QmQdPSCBZbrcfQBh196amZif3P29vK7L18kwXe5jx1uPnE';
                break;
            default:
                console.error('There are not uris for this id');
                break;
        }
        return uri;
    }

    getImgFromName = () => {
        let img = "/images/";
        switch (this.state.cardMinted.name) {
            case "Wrath":
                img = "/images/6.jpeg";
                break;
            case "Path of gold":
                img = "/images/5.jpeg";
                break;
            case "Vampire":
                img = "/images/2.jpeg";
                break;
            case "Midnight Hunt":
                img = "/images/3.jpeg";
                break;
            case "Blade of Rashes":
                img = "/images/7.jpeg";
                break;
            case "Sharpening":
                img = "/images/4.jpeg";
                break;
            case "Immersion":
                img = "/images/8.jpeg";
                break;
            default:
                console.error("There is not image for this id");
                break;
        }
        return img;
    }

    handleDoneButton = () => {
        this.setState({
            processingIndexing: false,
            processingEnded: false,
            processingForTicketEnded: false,
            processingTicketPayment: false,
        })
    }

    render() {
        return (
            <>
                <Alert variant="filled" severity="success" id="alert-mint-process-success" style={{ zIndex: 2, position: "fixed", top: "10px" }}>
                    {this.state.messageAlert}
                </Alert>
                <Alert variant="filled" severity="error" id="alert-mint-process-fail" style={{ zIndex: 2, position: "fixed", top: "10px" }}>
                    {this.state.messageAlert}
                </Alert>
                <p>
                    Common tickets remaining: {this.state.commonTickets}<br />
                    Rare tickets remaining: {this.state.rareTickets}<br />
                    Very rare tickets remaining: {this.state.veryRareTickets}<br />
                </p>
                <Grid container style={{ justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                    <Grid item sx={6}>
                        <Card className={'card'} sx={{ maxWidth: 345 }}>
                            {
                                !this.state.processingIndexing && !this.state.processingEnded ? (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image="/images/treasure.jpeg"
                                        alt="shop with tokens"
                                    />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={this.state.srcOfImgToDisplay}
                                        alt="shop with tokens"
                                    />
                                )
                            }

                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <p>Use your tokens</p>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Use your promethiums or your ETHs to mint a card
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container>
                                    {
                                        !this.state.processingIndexing ? (
                                            <>
                                                <Grid item xs={6}>
                                                    <Button onClick={this.handleMintWithPromethium} size="small" style={{ fontFamily: "Personal Chicago", width: "100%" }}>100 Promethiums</Button>
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <Button onClick={this.handleMintWithETH} size="small" style={{ fontFamily: "Personal Chicago", width: "100%" }}>{this.state.feeETH} ETH</Button>
                                                </Grid>
                                            </>

                                        ) : (
                                            !this.state.processingEnded ? (
                                                <>
                                                    <Grid item xs={12}>
                                                        <p style={{ color: "black" }}>Processing...</p>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CircularProgress />
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>
                                                    <Grid item xs={12}>
                                                        <p style={{ color: "black" }}>
                                                            {this.state.cardMinted.name} added to your collection!
                                                        </p>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CheckIcon style={{ color: "green" }} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <button className='personal-button-accept' onClick={this.handleDoneButton}>Done</button>

                                                    </Grid>
                                                </>
                                            )
                                        )
                                    }
                                </Grid>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item sx={6}>
                        <Card className={'card'} sx={{ maxWidth: 345 }}>
                            {
                                !this.state.processingTicketPayment && !this.state.processingForTicketEnded ? (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image="/images/water.jpeg"
                                        alt="shop with tokens"
                                    />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={this.state.srcOfImgToDisplay}
                                        alt="shop with tokens"
                                    />
                                )
                            }
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    <p>Use your tickets</p>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Use the tickets you found while looting to unlock new powerful abilities
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Grid container>
                                    {
                                        !this.state.processingTicketPayment ? (
                                            <>
                                                <Grid item xs={4}>
                                                    <Button size="small" onClick={() => this.handleMintWithTicket('common')} style={{ fontFamily: "Personal Chicago", width: "100%" }}>Common</Button>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Button size="small" onClick={() => this.handleMintWithTicket('rare')} style={{ fontFamily: "Personal Chicago", width: "100%" }}>Rare</Button>
                                                </Grid>
                                                <Grid item xs={4}>
                                                    <Button size="small" onClick={() => this.handleMintWithTicket('veryRare')} style={{ fontFamily: "Personal Chicago", width: "100%" }}>Very rare</Button>
                                                </Grid>
                                            </>

                                        ) : (
                                            !this.state.processingForTicketEnded ? (
                                                <>
                                                    <Grid item xs={12}>
                                                        <p style={{ color: "black" }}>Processing...</p>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CircularProgress />
                                                    </Grid>
                                                </>
                                            ) : (
                                                <>
                                                    <Grid item xs={12}>
                                                        <p style={{ color: "black" }}>
                                                            {this.state.cardMinted.name} added to your collection!
                                                        </p>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <CheckIcon style={{ color: "green" }} />
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <button className='personal-button-accept' onClick={this.handleDoneButton}>Done</button>

                                                    </Grid>
                                                </>
                                            )
                                        )
                                    }
                                </Grid>


                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </>
        );
    }
}
