import React from "react";
import NFTCard from "./nftcard";

export class MintNFT extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <h1>Welcome to the shop!</h1>
                <h2>What can you buy?</h2>
                <p>
                    Here you can use your <span style={{color: 'purple'}}>Promethiums</span>, your <span style={{color: 'blue'}}>ETH</span> or your <span style={{color: 'green'}}>NFT tickets</span> to mint a random NFT<br />
                    Then you can go to your collection to activate its effects or sell it on OpenSea
                </p>
                <NFTCard/>
            </>
        )
    }
}