import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
//Styles
import './style/navbar.css';
import './style/text.css';

import { App } from './app';

import { NFTMarketPlace } from './components/marketplace/nft';
import { TokenMarketPlace } from './components/marketplace/token';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/marketplaceNFT" element={<NFTMarketPlace />} />
        <Route path="/marketplaceToken" element={<TokenMarketPlace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals