const Xray = require('x-ray');
const x = Xray();
const express = require('express');
const app = express();
const cors = require('cors');
 
app.use(cors());


app.use(express.json());
const fetch = require('node-fetch');

// Define the URL and authentication credentials
let url = '';
const apiKey = 'bdcabb21-a43e-4dcf-989e-fc0f5e7f9340';



app.get('/:number', (req, res) => {


  let arr = [];
  url = 'https://api.company-information.service.gov.uk/company/' + req.params.number + '/filing-history';

  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
    },
  })
    .then(response => {
      if (!response.ok) {
        console.log(`HTTP Error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      data?.items?.forEach(item => {
        if (item.type === 'SH02') {
          arr.push(item);
        }
      })

      res.status(200).send({ success: true, data: arr })
    })
    .catch(error => {
      // Handle errors here
      res.status(200).send({ success: false, error })
    });

});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
})
