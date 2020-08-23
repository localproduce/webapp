const fs = require('fs');

const json = require('./data/En-WeeklyWholesaleMarketPrices.json');

const data = json.WeeklyWholesaleMarketPrices;

// const index = (element, index) => {
//   if (element.Date === '2020-08-07T00:00:00-05:00') {
//     console.log(index);
//     return true;
//   }
// }

console.log(data.length);

// data.splice(0, 52697);

// fs.writeFileSync('./data/new.json', JSON.stringify(json, null, 2));
