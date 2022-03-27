import React from "react";
import NFTCard from "./nftcard";

export class MintNFT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <>
                <h1>Welcome to the shop!</h1>
                <h2>What can you buy?</h2>
                <p>
                    Here you can use your tokens or your gold to mint a random NFT<br />
                    Go to your collection to activate its effects or sell it on OpenSea
                </p>
                <NFTCard/>
            </>
        )
    }
}