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
import './style/unityCanvas.css';
import'./style/smallScreenUtils.css';
import'./style/homepage.css';
import'./style/buttons.css';
import './style/personalFonts.css';
import './style/token-page.css';
import './style/nftContainer.css';
import './style/card.css';
import './style/accordions.css';
import './style/images.css';
import './style/shop.css';

import { App } from './app';
import { NFTMarketPlace, PersonalCollection } from './components/marketplace/collection';
import { TokenMarketPlace } from './components/marketplace/token';
import { Shop } from './components/marketplace/shop';


ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/marketplaceToken" element={<TokenMarketPlace />} />
        <Route path="/profile/collection" element={<PersonalCollection/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals