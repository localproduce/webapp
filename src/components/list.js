import React, { useState } from 'react';
import firebase from './firebase';

import './search.css';
import './list.css';
import Article from './article';

export default function Search() {
  const [expanded, setExpanded] = useState(true);
  const [querying, setQuerying] = useState(false);
  const [data, setData] = useState([]);

  const db = firebase.firestore();
  const collection = db.collection('WeeklyWholesaleMarketPrices');

  function getInSeason(inSeason) {
    let commodities = [];

    Object.values(inSeason).forEach(entry => {
      const query = collection
        .where('UnitMsrEn_QteUnitAn', '==', 'lbs')
        .where('CmdtyEn_PrdtAn', '==', entry.CmdtyEn_PrdtAn)
        .where('VrtyEn_VrteAn', '==', entry.VrtyEn_VrteAn);
      query.get().then(snapshot => {
        const count = snapshot.size;
        let totalLowPricePerLbs = 0;
        let totalHighPricePerLbs = 0;
        let countYearAgo = 0;
        let totalLowPricePerLbsYearAgo = 0;
        let totalHighPricePerLbsYearAgo = 0;
        snapshot.docs.forEach((doc) => {
          let data = doc.data();
          const weight = data.PkgQty_QtePqt === '' ? data.PkgWt_PdsPqt : data.PkgWt_PdsPqt * data.PkgQty_QtePqt;
          totalLowPricePerLbs += data.LowPrice_PrixMin / weight;
          totalHighPricePerLbs += data.HighPrice_PrixMax / weight;
          if (data.Date.includes('2019-08')) {
            countYearAgo++;
            totalLowPricePerLbsYearAgo += data.LowPrice_PrixMin / weight;
            totalHighPricePerLbsYearAgo += data.HighPrice_PrixMax / weight;
          }
        });
        const output = {
          CmdtyEn_PrdtAn: entry.CmdtyEn_PrdtAn,
          VrtyEn_VrteAn: entry.VrtyEn_VrteAn,
          avgLowPrice: totalLowPricePerLbs / count,
          avgHighPrice: totalHighPricePerLbs / count,
          avgPrice: ((totalLowPricePerLbs / count) + (totalHighPricePerLbs / count)) / 2,
          avgLowPriceYearAgo: totalLowPricePerLbsYearAgo / countYearAgo,
          avgHighPriceYearAgo: totalHighPricePerLbsYearAgo / countYearAgo,
          avgPriceYearAgo: ((totalLowPricePerLbsYearAgo / countYearAgo) + (totalHighPricePerLbsYearAgo / countYearAgo)) / 2,
        }
        commodities.push(output);
      });
    });
    return commodities;
  }

  async function loadInSeason() {
    setQuerying(true);
    setData(null);
    let response = await fetch("https://us-central1-localproduce-1.cloudfunctions.net/getInSeason?province=Alberta");
    let json = await response.json();
    setQuerying(false);
    setData(getInSeason(json));
  }

  return (
    <div className="container list" id="list" >
      <h1 className="list-title">In-season Commodities</h1>
      <button className="expand" id="list-expand" onClick={() => {
        setExpanded(!expanded);
        document.querySelector('#list').style.height = !expanded ? '100%' : '5rem';
        document.querySelector('#list-expand').innerHTML = !expanded ? 'Collapse' : 'Expand';
      }}>
        Collapse
      </button>
      <button className="search-submit" id="list-load" onClick={loadInSeason}>Load</button>
      <div className="query-results">
        {querying && (<span className="search-message">Loading...</span>)}
        {data.map(doc => (
          <Article data={doc} />
        ))}
      </div>
    </div>
  );
}
