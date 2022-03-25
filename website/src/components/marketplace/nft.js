import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { constants } from '../../constants';
import { Cardnft } from './card';

export class NFTMarketPlace extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOfNFTsOwned: [],
            address: ''
        }
    }

    checkOwnershipForEachNFT = async (totalSupply, contract) => {
        for (let i = 0; i < totalSupply; i++) {
            let owner = await contract.ownerOf(i);
            if (owner.toLowerCase() === this.state.address) {
                this.setState({
                    idOfNFTsOwned: this.state.idOfNFTsOwned.concat(i)
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
        this.checkOwnershipForEachNFT(trx.length, contract);
    }

    render() {
        return (
            <>
                <HomeNavbar tabSelected={1} />
                <Cardnft/>
                <MetamaskButton callbackFunction={this.handleSetAddress} />
            </>
        )
    }
}