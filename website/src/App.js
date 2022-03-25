import { HomeNavbar } from './components/navbar/navbar';
import { Game } from './components/game/game';

export function App(props) {
    return (
        <>
            <HomeNavbar tabSelected={0}/>
            <Game />
        </>
    )
}