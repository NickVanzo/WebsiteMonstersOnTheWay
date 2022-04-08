import React from "react";
import axios from 'axios';
import { ethers } from "ethers";

export class DisplayNumberOfTicketsOfUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            commonTickets: 0,
            rareTickets: 0,
            veryRareTickets: 0
        }
    }

    async componentDidMount() {
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

    render() {
        return (
            <>
                <p>
                    Common tickets remaining: {this.state.commonTickets}<br/>
                    Rare tickets remaining: {this.state.rareTickets}<br/>
                    Very rare tickets remaining: {this.state.veryRareTickets}<br/>
                </p>                
            </>
        )
    }
}