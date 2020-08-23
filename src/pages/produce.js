import React, { useState } from 'react';
import firebase from '../components/firebase';

import './produce.css';
import '../components/search.css';
import Article from '../components/article';

export default function Produce() {
  const [querying, setQuerying] = useState(false);
  const [content, setContent] = useState([]);
  const [, updateState] = React.useState();

  const db = firebase.firestore();
  const collection = db.collection('WeeklyWholesaleMarketPrices');

  const getInSeason = (inSeason) => {
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
    })

    return commodities;
  }

  async function loadInSeason() {
    setQuerying(true);
    setContent([]);

    const provinceField = document.querySelector('#province');

    let response = await fetch(`https://us-central1-localproduce-1.cloudfunctions.net/getInSeason?province=${provinceField.value}`);
    let json = await response.json();
    const inSeason = getInSeason(json);
    setQuerying(false);
    setContent(inSeason);
  }

  const forceUpdate = React.useCallback(() => updateState({}), []);
  
  return (
    <div className= "opensans">
      <div className="container search">
        <h3 className="search-title">Select A Province To See In-Season Produce</h3>
        <div className="search-row">
          <div className="queries">
            <select id="province">
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Manitoba">Manitoba</option>
              <option value="Ontario">Ontario</option>
              <option value="Quebec">Quebec</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="Prince Edward Island">Prince Edward Island</option>
              <option value="Yukon">Yukon</option>
              <option value="Northwest Territories">Northwest Territories</option>
              <option value="Nunavut">Nunavut</option>
            </select>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button className="search-submit" onClick={loadInSeason}>Query</button>
          <button className="expand" onClick={forceUpdate}>Refresh</button>
        </div>
        <div className="query-results">
          {querying && (<span className="search-message">Loading...</span>)}
          {!querying && content.map(doc => (
            <Article data={doc} />
          ))}
        </div>
      </div>
    </div>
  );
}
