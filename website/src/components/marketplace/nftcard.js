import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { CircularProgress } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default class NFTCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgToDisplay: 1,
            srcOfImgToDisplay: '/images/1.jpeg',
            feeETH: 0,
            processingIndexing: false,
            processingEnded: false,
            cardMinted: {}
        }
    }

    async componentDidMount() {
        this.changeImageOverTime();
        let contract = this.connectToSmartContract();
        let fee = await this.fetchFee(contract);
        this.setState({
            feeETH: fee
        })
    }

    connectToSmartContract = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);
        let address = await signer.getAddress()
        console.log(address);
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

    mintCard = () => {

    }

    handleMintWithPromethium = async () => {
        let blockchain = await this.connectToSmartContract();
        let uri = this.generateRandomURI();
        let card = {
            id: uri.id,
            name: this.nameOfCard(uri.id),
            uri: uri.uri
        }
        this.setState({
            cardMinted: card
        })
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
    }

    handleMintWithETH = async () => {
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
        console.log(blockchain, uri, options);
        const trx = await blockchain.contract.safeMint(`${blockchain.address}`,`${uri.uri}`, options);
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
        const feeBN = await blockchain.contract.getFee();
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
                        <Typography variant="body2" color="text.secondary">
                        </Typography>
                    </CardContent>
                </Card>
            </>
        );
    }
}
