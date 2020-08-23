const admin = require('firebase-admin');

const serviceAccount = require('./localproduce-1-firebase-adminsdk-w90vg-3f49ebeadb.json');
const { get } = require('http');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const collection = db.collection('WeeklyWholesaleMarketPrices');

collection
  .where('CmdtyEn_PrdtAn', '==', 'APPLES')
  .where('VrtyEn_VrteAn', '==', 'FUJI')
  .where('UnitMsrEn_QteUnitAn', '==', 'lbs')
  .get()
  .then(processApples);

function processApples(snapshot) {
  const count = snapshot.size;
  let totalLowPricePerLbs = 0;
  let totalHighPricePerLbs = 0;
  let countYearAgo = 0;
  let totalLowPricePerLbsYearAgo = 0;
  let totalHighPricePerLbsYearAgo = 0;
  snapshot.forEach((doc) => {
    let data = doc.data();
    const weight = getWeight(data);
    totalLowPricePerLbs += getLowPrice(data) / weight;
    totalHighPricePerLbs += getHighPrice(data) / weight;
    if (getDate(data).includes('2019-08')) {
      countYearAgo++;
      totalLowPricePerLbsYearAgo += getLowPrice(data) / weight;
      totalHighPricePerLbsYearAgo += getHighPrice(data) / weight;
    }
  });
  
  const avgLowPrice = totalLowPricePerLbs / count;
  const avgHighPrice = totalHighPricePerLbs / count;
  const avgPrice = (avgLowPrice + avgHighPrice) / 2;

  console.log(`Average low wholesale price for past 52 weeks: $${avgLowPrice}/lbs`);
  console.log(`Average high wholesale price for past 52 weeks: $${avgHighPrice}/lbs`);
  console.log(`Average wholesale price for past 52 weeks: $${avgPrice}/lbs`);

  const avgLowPriceYearAgo = totalLowPricePerLbsYearAgo / countYearAgo;
  const avgHighPriceYearAgo = totalHighPricePerLbsYearAgo / countYearAgo;
  const avgPriceYearAgo = (avgLowPriceYearAgo + avgHighPriceYearAgo) / 2;

  console.log(`Average low wholesale price for last August: $${avgLowPriceYearAgo}/lbs`);
  console.log(`Average high wholesale price for last August: $${avgHighPriceYearAgo}/lbs`);
  console.log(`Average wholesale price for last August: $${avgPriceYearAgo}/lbs`);

  function getDate(data) {
    return data.Date;
  }
  function getLowPrice(data) {
    return data.LowPrice_PrixMin;
  }
  function getHighPrice(data) {
    return data.HighPrice_PrixMax;
  }
  function getWeight(data) {
    return data.PkgWt_PdsPqt;
  }
}
