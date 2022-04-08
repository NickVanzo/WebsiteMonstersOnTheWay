import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { InteractiveList } from './personalCollection';
import { Container } from 'react-bootstrap';
import axios from 'axios';
import { create } from "ipfs";
import { Grid } from '@mui/material';
import { MintNFT } from './mintPage';

export class NFTMarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOfNFTsOwned: [],
            address: '',
            ipfs: undefined,
            sectionToRender: 1
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
        let ipfs = await this.connectToIpfs();
        this.setState({
            ipfs: ipfs
        })
    }

    connectToIpfs = async () => {
        let node = undefined;
        try {
            node = await create();
        } catch (err) {
            console.log(err);
        }

        return node;
    }

    checkDurationForNFT = async (id) => {
        let info = await axios.get(`https://us-central1-dangermonsters.cloudfunctions.net/api/cardInformations?id=${id}`);
        return info.data;
    }

    checkOwnershipForEachNFT = async (contract) => {
        let totalSupply = await contract.lastIdMinted();
        
        for (let i = 0; i < totalSupply; i++) {
            let theTokenExists = await contract.checkIfTokenExists(i);        
            if (theTokenExists) {
                let owner = await contract.ownerOf(i);
                if (owner.toLowerCase() === this.state.address) {
                    let cardInfo = await this.checkDurationForNFT(i);
                    let uriOfJson = await this.fetchUriFromId(i);
                    let cardData = await this.fetchDataForCard(uriOfJson);
                    cardInfo.id = i;
                    cardInfo.effects = cardData
                    cardInfo.imageUrl = `https://ipfs.io/ipfs/${cardData["image"].slice(7, cardData["image"].length)}`;
                    this.setState({
                        idOfNFTsOwned: this.state.idOfNFTsOwned.concat(cardInfo)
                    })
                }
            }
        }
    }

    fetchDataForCard = async (uriOfJson) => {
        let obj = await axios.get(`https://ipfs.io/ipfs/${uriOfJson.slice(7, uriOfJson.length)}`);
        return obj.data;
    }

    fetchUriFromId = async (id) => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);

        let uri = await contract.tokenURI(id);
        return uri;
    }

    handleSetAddress = async (addressToSet) => {
        this.setState({
            address: addressToSet
        })

        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);

        await this.checkOwnershipForEachNFT(contract);
    }

    render() {
        return (
            <>
                <HomeNavbar tabSelected={1} />
                <Container className={'nft-page-container'}>
                    <Grid container>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={4} style={{ textAlign: "right" }}>
                            <button className='button-choose-section' onClick={() => this.setState({ sectionToRender: 0 })}>My collection</button>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: "left" }}>
                            <button className='button-choose-section' onClick={() => this.setState({ sectionToRender: 1 })}>Shop</button>
                        </Grid>
                        <Grid item xs={2}></Grid>
                    </Grid>
                    {
                        this.state.sectionToRender === 0 ? (
                            <>
                                <h1>Connect Metamask to see your NFTs</h1>
                                {
                                    this.state.idOfNFTsOwned.length > 0 && (
                                        <InteractiveList ids={this.state.idOfNFTsOwned} ipfs={this.state.ipfs} />
                                    )
                                }
                            </>
                        ) : <>
                            <MintNFT />
                        </>
                    }

                </Container>
                <MetamaskButton callbackFunction={this.handleSetAddress} />
            </>
        )
    }
}