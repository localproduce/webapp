import React from 'react';

import './article.css';

export default function Article({ data }) {
  return (
    <article className="container entry">
      <div className="headings">
        <h3>{data.CmdtyEn_PrdtAn}</h3>
        <h4>{data.VrtyEn_VrteAn}</h4>
      </div>
      <div className="details">
        <p>Average price for past 52 weeks:  <b>${data.avgPrice.toFixed(2)}/lbs</b></p>
        <p>Average price for Aug 2019:  <b>${data.avgPriceYearAgo.toFixed(2)}/lbs</b></p>
        <p>Average price range for past 52 weeks:  <b>${data.avgLowPrice.toFixed(2)}/lbs – ${data.avgHighPrice.toFixed(2)}/lbs</b></p>
        <p>Average predicted price range:  <b>${data.avgLowPriceYearAgo.toFixed(2)}/lbs – ${data.avgHighPriceYearAgo.toFixed(2)}/lbs</b></p>
      </div>
    </article>
  );
}
