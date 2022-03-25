import { HomeNavbar } from '../navbar/navbar';
import { MetamaskButton } from '../buttons/metamask';

export function NFTMarketPlace(props) {

    return(
        <>
            <HomeNavbar tabSelected={1}/>
            <MetamaskButton/>
        </>
    )
}