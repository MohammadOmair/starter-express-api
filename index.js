const Xray = require('x-ray');
const x = Xray();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const MyModel = require('./Models/predictions');

const MONGODB_URI = 'mongodb+srv://admin-umair:test123@cluster0.xg387ne.mongodb.net/PortalDB';



app.use(express.json());
app.use(cors());

app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yo!')
})

const ConnectToMongo = () => {
    mongoose
        .connect(MONGODB_URI, {
            useNewUrlParser: true,
        })
        .then(() => {
            console.log("DB Connection Succesful");
        })
        .catch((e) => {
            console.log("Something went wrong while connecting to DB: \n", e);
        });
};
ConnectToMongo()

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
            img: 'td.iconLega img@class'

        }])((error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

app.get('/home/:date/:count', (req, res) => { //1X2

    const url = `https://www.bettingclosed.com/predictions/date-matches/${req.params.date}`;


    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });
});

app.get('/underover/:date/:count', (req, res) => { //   under/over

    const url = `https://www.bettingclosed.com/predictions/date-matches/${req.params.date}/bet-type/under-over`;

    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });


});

app.get('/finalscores/:date/:count', (req, res) => { //   final scores

    const url = `https://www.bettingclosed.com/predictions/date-matches/${req.params.date}/bet-type/correct-scores`;

    getData(url, req.params.count)
        .then(results => { res.status(200).send(results) })
        .catch(error => { res.status(500).send(error) });
});


app.get('/mixed/:count', (req, res) => { //

    const url = 'https://www.bettingclosed.com/predictions/date-matches/today/bet-type/mixed';

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


app.post('/admin/save', async (req, res) => {
    try {
        const { day, firstTeam, league, odds, secondTeam, time, tip, img } = req.body;
        const myDocument = new MyModel({ day, firstTeam, league, odds, secondTeam, time, tip, img });
        await myDocument.save();
        res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to save document' }); // Respond with an error message
    }
});

app.delete('/admin/clear', async (req, res) => {
    try {
        await MyModel.deleteMany(); // Delete all documents in the collection
        res.status(200).json({ success: true }); // Respond with a success message
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to clear collection' }); // Respond with an error message
    }
});

app.get('/admin/data', async (req, res) => {
    try {
        const documents = await MyModel.find(); // Find all documents in the collection
        res.status(200).json({ success: true, data: documents }); // Respond with the documents
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve documents' }); // Respond with an error message
    }
});



app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})
