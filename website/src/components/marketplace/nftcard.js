import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { BigNumber, ethers } from 'ethers';
import { constants } from '../../constants';
import { Alert, CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import $ from "jquery";
import axios from 'axios';

export default class NFTCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgToDisplay: 1,
            srcOfImgToDisplay: '/images/1.jpeg',
            feeETH: 0,
            processingIndexing: false,
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
        const numberOfCards = 7;
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
        let idsForCommonCards = [4, 1];
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
                processingIndexing: true
            })
            let receipt = await blockchain.provider.waitForTransaction(trx.hash);
            card.hash = receipt.transactionHash
            let img = this.getImgFromName(card.name);
            this.setState({
                processingEnded: true,
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

    removeTicket = async (address,rarity) => {
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
        }
    }

    fetchFee = async (blockchain) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, provider);
        const feeBN = await contract.getFee();
        console.log(feeBN);
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
            default:
                console.error("There is not image for this id");
                break;
        }
        return img;
    }

    handleDoneButton = () => {
        this.setState({
            processingIndexing: false,
            processingEnded: false
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
                <Card className='card ' sx={{ borderRadius: "30px", backgroundColor: "#000000" }} >
                    <CardMedia
                        component="img"
                        height="280"
                        image={this.state.srcOfImgToDisplay}
                        alt="Random image of NFT"
                    />
                    <CardContent>
                        {
                            !this.state.processingIndexing ? (
                                <Typography gutterBottom variant="h5" component="div">
                                    <button className={'personal-button-mint-eth'} onClick={this.handleMintWithETH}>
                                        {this.state.feeETH} ETH
                                    </button>
                                    <button className={'personal-button-mint-promethium'} onClick={this.handleMintWithPromethium}>
                                        10 promethiums
                                    </button>

                                </Typography>
                            ) : (
                                !this.state.processingEnded ? (
                                    <>
                                        <p style={{ color: "white" }}>Processing...
                                        </p>
                                        <CircularProgress />
                                    </>
                                ) : (
                                    <>
                                        <p style={{ color: "white" }}>
                                            {this.state.cardMinted.name} added to your collection!
                                        </p>
                                        <CheckIcon style={{ color: "green" }} />
                                        <button className='personal-button-accept' onClick={this.handleDoneButton}>Done</button>
                                    </>
                                )
                            )
                        }

                    </CardContent>
                </Card>
                <h1>Or use a ticket</h1>
                <p>
                    Common tickets remaining: {this.state.commonTickets}<br />
                    Rare tickets remaining: {this.state.rareTickets}<br />
                    Very rare tickets remaining: {this.state.veryRareTickets}<br />
                </p>
                <button className={'personal-button-mint-ticket'} onClick={() => this.handleMintWithTicket('common')}>1 common ticket</button>
                <button className={'personal-button-mint-ticket'} onClick={() => this.handleMintWithTicket('rare')}>1 rare ticket</button>
                <button className={'personal-button-mint-ticket'} onClick={() => this.handleMintWithTicket('veryRare')} style={{ marginBottom: '20px' }}>1 very rare ticket</button>
            </>
        );
    }
}
