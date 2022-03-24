import { HomeNavbar } from './components/navbar/navbar';
import { Game } from './components/game/game';
import { MetamaskButton } from './components/buttons/metamask';

export function App(props) {
    return (
        <>
            <HomeNavbar />
            <Game />
            <MetamaskButton/>
        </>
    )
}