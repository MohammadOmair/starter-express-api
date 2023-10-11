const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios'); // Import Axios
const realEstateData = require('./Models/predictions');
app.use(cors());
app.use(express.json());

// const apiKey = 'bdcabb21-a43e-4dcf-989e-fc0f5e7f9340';
const url = "mongodb+srv://admin-umair:test123@cluster0.xg387ne.mongodb.net/SampleDB";
const documentId = '6526d7dff2f1b0a565cd7bfe';

const ConnectToMongo = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
    });
    console.log("DB Connection Successful");
  } catch (error) {
    console.log("Something went wrong Umair ! : ", error);
  }
};

async function findAndDecrementCount(documentId) {
  let document;
  try {
    document = await realEstateData.findById(documentId);

    if (!document) {
      console.log('Document not found');
      return -1;
    }

    if (document.countId <= 0) {
      console.log('Document countId is already 0');
      return -1;
    }
    document.countId--;
    await document.save();

    console.log('Document found and countId decremented:', document);
  } catch (error) {
    console.error('Error finding and decrementing countId:', error);
  }

  return document.countId;

}



app.get('/', async (req, res) => {
  ConnectToMongo()
  const count = await findAndDecrementCount(documentId)
  console.log(count)
  if (count <= 0) return res.send({ message: 'condition matched' })

  axios.get('http://localhost:3000/')

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

























// try {
//   let arr = [];
//   const apiUrl = `https://api.company-information.service.gov.uk/company/${req.params.number}/filing-history`;

//   // Set up Axios configuration
//   const axiosConfig = {
//     headers: {
//       'Authorization': `Basic ${Buffer.from(apiKey).toString('base64')}`,
//     },
//   };

//   // Make the GET request using Axios
//   const response = await axios.get(apiUrl, axiosConfig);

//   if (response.status !== 200) {
//     console.log(`HTTP Error! Status: ${response.status}`);
//     res.status(200).send({ success: false, error: `HTTP Error! Status: ${response.status}` });
//     return;
//   }

//   const data = response.data;

//   data?.items?.forEach(item => {
//     if (item.type === 'SH02') {
//       arr.push(item);
//     }
//   });

//   res.status(200).send({ success: true, data: arr });
// } catch (error) {
//   // Handle errors here
//   console.error('Error:', error);
//   res.status(200).send({ success: false, error });
// }
