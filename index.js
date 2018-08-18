const {
  csvFormat
} = require('d3-dsv');

const { readFileSync, writeFileSync } = require('fs');
const Nightmare = require('nightmare');
// const jquery = require('jquery');

const URL = 'https://www.google.ca/';
const nightmare = Nightmare({
  show: true
});


const getData = async () => {

  try {
    await nightmare
      .goto(URL)
      .type('input#lst-ib.gsfi', 'datatables')
      .click('input[value="Google Search"]')
      .wait('h3.r a')
      .click('h3.r a');
  } catch (e) {
    console.error(e);
  }

  try {
    const result = await nightmare
      .evaluate(() => {
        let result = {};
        return Array.from(document.querySelectorAll('table#example tbody tr'))
          .map((el) => {
            let key = document.querySelector('table#example thead tr').innerText;
            console.log(key);
            let object = {};
            object[key] = el.innerText;
            return object;
          });
      })
      .end()
    return result;
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

getData()
  // .then(a => console.dir(a))
  .then(data => {
    const csvData = csvFormat(data.filter(i => i));
    writeFileSync('./output.csv', csvData, { encoding: 'utf8' });
  })
