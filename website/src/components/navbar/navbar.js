import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';

export function HomeNavbar(props) {
  let [tabSelected, setTabSelected] = useState(0);
  let navigate = useNavigate();
  
  return (
    <>
      <Tabs value={props.tabSelected} id={'navbar'} className={'navbar'} centered>
        <Button onClick={() => navigate('/')}>
          <Tab value={0} label={"Play game"}/>
        </Button>
        <Button onClick={() => navigate('/marketplaceNFT')}>
          <Tab value={1} label={"NFT"} />
        </Button>
        <Button onClick={() => navigate('/marketplaceToken')}>
          <Tab value={2} label={"Token"} />
        </Button>
      </Tabs>
    </>
  );
}