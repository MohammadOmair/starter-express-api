const Xray = require('x-ray');
const x = Xray();
const express = require('express');
const app = express();
const cors = require('cors');
 
app.use(cors());

function getData(url, count) {
    return new Promise((resolve, reject) => {
        x(url, `table#myTable tbody tr:nth-child(-n+${count})`, [{
            dateTime: 'td.dataMt',
            team_b: 'td.teamBmatch',
            team_a: 'td.teamAmatch',
            score: 'td.resultMt',
            prediction: 'td.predMt a',
            odds: 'td.oddPredBook',
            result: '.imgCorrect img@title',
            lg: 'td.iconLega img@alt',

        }])((error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/home/:date/:count', (req, res) => {

    const url = `https://www.bettingclosed.com/predictions/date-matches/${req.params.date}`;


    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });
});

app.get('/mixed/:count', (req, res) => {

    const url = 'https://www.bettingclosed.com/predictions/date-matches/today/bet-type/mixed';

    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });


});

app.get('/underover/:count', (req, res) => {

    const url = 'https://www.bettingclosed.com/predictions/date-matches/today/bet-type/under-over';

    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });


});

app.get('/golnogol/:count', (req, res) => {

    const url = 'https://www.bettingclosed.com/predictions/date-matches/today/bet-type/gol-nogol';
 
    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });


});

app.get('/finalscores/:count', (req, res) => {

    const url = 'https://www.bettingclosed.com/predictions/date-matches/today/bet-type/correct-scores';

    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})
