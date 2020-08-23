import React, { useState } from 'react';
import firebase from './firebase';

import './search.css';
import Article from './article';

export default function Search() {
  const [expanded, setExpanded] = useState(true);
  const [querying, setQuerying] = useState(false);
  const [data, setData] = useState();

  const db = firebase.firestore();
  const collection = db.collection('WeeklyWholesaleMarketPrices');

  function handleQuery() {
    setQuerying(true);
    setData(null);

    const commodityField = document.getElementById('commodity');
    const variantField = document.getElementById('variant');
    const dateField = document.getElementById('date');
    
    let query = collection.where('UnitMsrEn_QteUnitAn', '==', 'lbs');;
    if (commodityField.value !== '') {
      query = query.where('CmdtyEn_PrdtAn', '==', commodityField.value);
    }
    if (variantField.value !== '') {
      query = query.where('VrtyEn_VrteAn', '==', variantField.value);
    }
    if (dateField.value !== '') {
      query = query.where('Date', '==', dateField.value);
    }

    query.get().then(snapshot => {
      setData(snapshot.docs.map(doc => doc.data()));
      setQuerying(false);
    });
  }

  return(
    <div className="container search">
      <h1 className="search-title">Search</h1>
      <button className="expand" onClick={() => {
        setExpanded(!expanded);
        document.querySelector('.search').style.height = expanded ? '100%' : '5rem';
        document.querySelector('.expand').innerHTML = expanded ? 'Collapse' : 'Expand'
      }}>
        Expand
      </button>
      <div className="search-row">
        <div className="queries">
          <input type="text" id="commodity" defaultValue="APPLES" placeholder="Commodity name" />
          <input type="text" id="variant" defaultValue="FUJI" placeholder="Variant name" />
          <input type="text" id="date" defaultValue="2019-08-09T00:00:00-05:00" placeholder="Date" />
        </div>
      </div>
      <button className="search-submit" onClick={handleQuery}>Query</button>
      <div className="query-results">
        {querying && (<span className="search-message">Loading...</span>)}
        {Array.isArray(data) && data.length === 0 && (
          <span className="search-message">No Results</span>
        )}
        {Array.isArray(data) && data.map(doc => (
          <Article data={doc} />
        ))}
      </div>
    </div>
  );
}
