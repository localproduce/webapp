import React from 'react';

import './frontpage.css';
import logo from '../assets/logo.png';

export default function Frontpage() {
  return (
    <>
      <div id = "navbar" className= "opensans"> 
        <a href="index.html">
          <img src={logo} className="logo" />
        </a>

        <ul>
          <li> <a class = "current"  href = "/">Home</a></li>
          <li> <a  href = "/about/">About</a></li>
        </ul>
        

      </div>


      <div className="container1">
        <div className="description"></div>
        <p className="textcontainer opensans"> Find out what's in szn!</p>
      </div>
    </>
  );
}
