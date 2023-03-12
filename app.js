const Web3 = require('web3');
const xlsx = require('xlsx');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const web3 = new Web3(new Web3.providers.HttpProvider('https://matic-testnet.chainstacklabs.com'));

const contractABI = require('./myContractABI.json');
const contractAddress = '0x2C97Ae40B812B81C059E991c5cE408FD39339Ec2'; // Put the address of the smart contract here
const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

app.get('/mint', async (req, res) => {
  try {
    const workbook = xlsx.readFile('Book.csv');
    const worksheet = workbook.Sheets['Sheet1'];
    const data = xlsx.utils.sheet_to_json(worksheet);

    for (let i = 0; i < data.length; i++) {
      const recipient = data[i].walletAddress;
      const name = data[i].name;
      const rank = data[i].rank;
      const recognitionType = data[i].recognitionType;
      const designFormat = data[i].designFormat;
      const issuingOrganization = data[i].issuingOrganization;
      const issuingPerson = data[i].issuingPerson;
      const signature = data[i].signature;

      await contractInstance.methods.mint(
        recipient,
        name,
        rank,
        recognitionType,
        designFormat,
        issuingOrganization,
        issuingPerson,
        signature
      ).send({from:'0x962B7042f5933B22e71fB53E49F5FB1689c850eb'});
    }

    res.status(200).send('Minting complete');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error minting tokens');
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
