import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { CircularProgress } from '@mui/material';

export default class NFTCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imgToDisplay: 1,
            srcOfImgToDisplay: '/images/1.jpeg',
            feeETH: 0,
            processingMint: false,
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

    connectToSmartContract = () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);
        return contract;
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
            this.loadNextImage((this.state.imgToDisplay % numberOfCards) + 1);
            i++;
        }, 500);
    }

    handleMintWithGold = async () => {
        let contract = this.connectToSmartContract();

    }

    handleMintWithETH = async () => {
        let contract = this.connectToSmartContract();
        const fee = await this.fetchFee(contract);
        let id = Math.floor(Math.random() * 6);
        const uri = this.randomUri(id);
        // const trx = await contract.safeMint(`${fee}`, `${uri}`);
        this.setState({
            processingMint: true
        })
    }

    fetchFee = async (contract) => {
        const feeBN = await contract.getFee();
        return ethers.utils.formatEther(feeBN._hex).toString();
    }

    randomUri = (id) => {
        let uri = '';
        switch (id) {
            case 0:
                uri = 'ipfs://QmcASoo86H9dboZoL6CQ18MBPbaVkF82ydr7mBUwzXMmYh';
                break;
            case 1:
                uri = 'ipfs://QmUVccUPYCnaJqT6NrDjfiScQdjTiBaBrFRDuFXV6snL3t';
                break;
            case 2:
                uri = 'ipfs://QmWcqbvK5qkJRkrfokhnQHk6tc6hzjQjM3ZuRiQLa7KQBv';
                break;
            case 3:
                uri = 'ipfs://QmQLVp88bgYvpgYh9aPowHKSQ3RCaT9s472yoirgwXyDaW';
                break;
            case 4:
                uri = 'ipfs://QmWCvjL4JKWuwmbK6rCjGAWnEztnW8DMHNZDAucq6thXmx';
                break;
            case 5:
                uri = 'ipfs://QmP4dt9ByjwDqwCvx2goTUCcFuU9u7DhhyfhnPb6mtGWa2';
                break;
            default:
                console.error('There are not uris for this id');
                break;
        }
        return uri;
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
                            !this.state.processingMint ? (
                                <Typography gutterBottom variant="h5" component="div">
                                    <button className={'personal-button-mint-eth'} onClick={this.handleMintWithETH}>
                                        {this.state.feeETH} ETH
                                    </button>
                                    <button className={'personal-button-mint-gold'} onClick={this.handleMintWithGold}>
                                        1000 gold coins
                                    </button>
                                    <button className={'personal-button-mint-promethium'}>
                                        10 promethiums
                                    </button>
                                </Typography>
                            ) : (
                                <CircularProgress />
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
