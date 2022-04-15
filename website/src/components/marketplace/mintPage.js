import React from "react";
import NFTCard from "./nftcard";

export class MintNFT extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <div className='home-page-container'>
                    <h1>Welcome to the shop!</h1>
                    <p>
                        Mint a random card to unlock its powers<br />
                        Then go to your collection and activate its effects or sell it on OpenSea
                    </p>
                    <NFTCard />
                </div>

            </>
        )
    }
}