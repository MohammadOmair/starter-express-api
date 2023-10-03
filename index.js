const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios'); // Import Axios
app.use(cors());
app.use(express.json());

// Define the URL and authentication credentials
const apiKey = 'bdcabb21-a43e-4dcf-989e-fc0f5e7f9340';

app.get('/:number', async (req, res) => {
  try {
    let arr = [];
    const apiUrl = `https://api.company-information.service.gov.uk/company/${req.params.number}/filing-history`;

    // Set up Axios configuration
    const axiosConfig = {
      headers: {
        'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
      },
    };

    // Make the GET request using Axios
    const response = await axios.get(apiUrl, axiosConfig);

    if (response.status !== 200) {
      console.log(`HTTP Error! Status: ${response.status}`);
      res.status(200).send({ success: false, error: `HTTP Error! Status: ${response.status}` });
      return;
    }

    const data = response.data;

    data?.items?.forEach(item => {
      if (item.type === 'SH02') {
        arr.push(item);
      }
    });

    res.status(200).send({ success: true, data: arr });
  } catch (error) {
    // Handle errors here
    console.error('Error:', error);
    res.status(200).send({ success: false, error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
