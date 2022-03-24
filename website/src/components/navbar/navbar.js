import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Link } from 'react-router-dom';

export function HomeNavbar(props) {
  return (
    <>
      <Tabs id={'navbar'} className={'navbar'} centered>
        <Link to="/">
          <Tab label="Play game" value={1}/>          
        </Link>
        <Link to="/marketplaceNFT">
          <Tab label="NFTs" value={1}/>          
        </Link>
        <Link to="/marketplaceToken">
          <Tab label="Tokens" value={1}/>          
        </Link>
      </Tabs>      
    </>
  );
}