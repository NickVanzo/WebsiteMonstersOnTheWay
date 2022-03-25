import { Button } from "@mui/material"
import { Tooltip } from "@mui/material";
import MetaMaskOnboarding from '@metamask/onboarding';
import React from "react";
export class MetamaskButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: ''
        };
    }

    async connectMetamask() {
        if (typeof window.ethereum !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setState({
                address: accounts[0]
            })
            document.getElementById('metamask-button').style.visibility = "hidden";
        } else {
            const onboarding = new MetaMaskOnboarding();
            onboarding.startOnboarding();
        }
    }
    render() {
        return (
            <Tooltip id="metamask-button-container" title={"Metamask"} placement="top" arrow >
                <Button variant="contained"
                    id={"metamask-button"}
                    onClick={async () => await this.connectMetamask()}
                >
                    <img src="./images/metamask-fox.svg" />
                </Button>
            </Tooltip >

        )
    }
}