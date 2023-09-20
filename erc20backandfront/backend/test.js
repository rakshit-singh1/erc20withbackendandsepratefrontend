const { Web3 } = require('web3');
const bodyParser = require('body-parser');
const express = require('express');
const router = express();
const cors = require('cors');
require('dotenv').config();
const abi = require('./contract.json');
const { string } = require('zod');

const web3 = new Web3(new Web3.providers.HttpProvider('https://sepolia.infura.io/v3/9ca1af07007a4463b2a3a3bacb7cafc6'));

const key = process.env.SIGNER_PRIVATE_KEY;
const contractAddress = '0x2e777c5b0052d933500ead5bd34ba995deb6bff2';
const myAddress = "0x668425484835D082D11e3A83b97D47705Ef6ACA4";

router.use(bodyParser.json());
router.use(cors());
router.use(express.json());
router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));

router.post('/getName', async function (req, res) {
    try {
        let contract = new web3.eth.Contract(abi, contractAddress);
        console.log("getName");
        let name = await contract.methods.name().call();
        console.log(name);
        return res.status(200).json({ name }); 
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});

router.post('/getSymbol', async function (req, res) {
    try {
        let contract = new web3.eth.Contract(abi, contractAddress);
        console.log("getSymbol");
        let symbol = await contract.methods.symbol().call();
        console.log(symbol);
        return res.status(200).json({ symbol }); 
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});

router.post('/ContractOwner', async function (req, res) {
    try {
        let contract = new web3.eth.Contract(abi, contractAddress);
        console.log("ContractOwner");
        let owner = await contract.methods.owner().call();
        console.log(owner);
        return res.status(200).json({ owner}); 
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});
router.post('/totalSupply', async function (req, res) {
    try {
        let contract = new web3.eth.Contract(abi, contractAddress);
        console.log("totalSupply");
        let totalSupply = await contract.methods.totalSupply().call();
        totalSupply=totalSupply.toString();
        console.log(totalSupply);
        return res.status(200).json({ totalSupply}); 
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});
router.post('/getBalance', async function (req, res) {
    try {
        let contract = new web3.eth.Contract(abi, contractAddress);
        console.log("getBalance");
        let bal = await contract.methods.balanceOf(req.body.address).call();
        bal=bal.toString()
        console.log(bal);
        return res.status(200).json({ bal }); 
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});
router.post('/transfer', async function (req, res) {
    try {
        console.log("Transfer");
        const gasPrice = await web3.eth.getGasPrice();

        let contract = new web3.eth.Contract(abi, contractAddress, { from: myAddress });

        let tx = contract.methods.transfer(req.body.address, req.body.amount).encodeABI();
        // console.log(req.body.address);
        // console.log(req.body.amount);
        const rawTransaction = {
            from:myAddress,
            gasPrice: gasPrice,
            gas: 550000,
            to: contractAddress,  // Use the ERC20 contract address here
            value: '0x0',
            data: tx,
            chainId: 11155111
        };

        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, key);

        let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '');

        // Update balance if needed
        let balance = await web3.eth.getBalance(myAddress);
        console.log(balance);

        if (!receipt) {
            return res.status(407).json({ message: 'Failed to get Details!!', flag: false });
        }

        return res.status(200).json({ message: receipt.transactionHash.toString(), flag: true, status: receipt.status.toString(), blocknumber: receipt.blockHash.toString() });
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});

router.post('/mint', async function (req, res) {
    try {
        console.log("Mint");
        console.log(req.body.address);
        console.log(req.body.amount);
        const gasPrice = await web3.eth.getGasPrice();

        let contract = new web3.eth.Contract(abi, contractAddress, { from: myAddress });

        let tx = contract.methods.mint(req.body.address, req.body.amount).encodeABI();
        
        const rawTransaction = {
            from:myAddress,
            gasPrice: gasPrice,
            gas: 550000,
            to: contractAddress,  // Use the ERC20 contract address here
            value: '0x0',
            data: tx,
            chainId: 11155111
        };

        const signedTx = await web3.eth.accounts.signTransaction(rawTransaction, key);

        let receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction || '');

        // Update balance if needed
        let balance = await web3.eth.getBalance(myAddress);
        console.log(balance);

        if (!receipt) {
            return res.status(407).json({ message: 'Failed to get Details!!', flag: false });
        }

        return res.status(200).json({ message: receipt.transactionHash.toString(), flag: true, status: receipt.status.toString(), blocknumber: receipt.blockHash.toString() });
    } catch (error) {
        return res.status(400).json({ message: error.message.toString(), flag: false });
    }
});
//Assign a port manually
const port = process.env.PORT || 5000;
process.stdout.write('\x1b]2;API Success\x1b\x5c');
router.listen(port, () => console.log(`Server running at http://localhost:${port}`));