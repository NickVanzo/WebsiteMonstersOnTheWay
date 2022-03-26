import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { InteractiveList } from './personalCollection';
import { Container } from 'react-bootstrap';
import { Grid } from '@mui/material';
import axios from 'axios';

export class NFTMarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOfNFTsOwned: [],
            address: '',
        }
    }

    checkDurationForNFT = async (id) => {
        let info = await axios.get(`http://localhost:5001/dangermonsters/us-central1/api/cardInformations?id=${id}`);
        console.log(info.data);
        return info.data;
    }

    checkOwnershipForEachNFT = async (totalSupply, contract) => {
        for (let i = 0; i < totalSupply; i++) {
            let owner = await contract.ownerOf(i);
            if (owner.toLowerCase() === this.state.address) {
                let cardInfo = await this.checkDurationForNFT(i);
                cardInfo.id = i;
                this.setState({
                    idOfNFTsOwned: this.state.idOfNFTsOwned.concat(cardInfo)
                })
            }
        }
    }

    handleSetAddress = async (addressToSet) => {
        this.setState({
            address: addressToSet
        })
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        let signer = provider.getSigner();
        let contract = new ethers.Contract(constants.contractNFTAddress, constants.contractNFTABI, signer);

        let trx = await contract.getCids();
        await this.checkOwnershipForEachNFT(trx.length, contract);
    }

    render() {
        return (
            <>
                <HomeNavbar tabSelected={1} />
                <Container className={'nft-page-container'}>
                    <p>Connect Metamask to see your NFTs</p>
                    {
                        this.state.idOfNFTsOwned.length > 0 && (
                            <InteractiveList ids={this.state.idOfNFTsOwned} />
                        )
                    }
                </Container>
                <MetamaskButton callbackFunction={this.handleSetAddress} />
            </>
        )
    }
}