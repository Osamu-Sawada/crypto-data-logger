#!/usr/bin/env node

const web3 = require('Web3');

import artifacts from '~/contracts/DataLogger.json';

const abi = artifacts.abi;

const string = 'こんにちは';
const hex = web3.utils.utf8ToHex(string);
const byte = web3.utils.hexToBytes(hex);

logger.logging(byte);

const getWeb3 = async function() {};

const getContract = async function(web3, networkId) {
    try {
        const abi = artifacts.abi;
        const contractAddress = artifacts.networks[networkId].address;
        return new web3.eth.Contract(abi, contractAddress);
    } catch (e) {
        console.log(e.message);
    }

    return null;
};

const logging = async function(contract) {
    // function logging(bytes memory _data) public returns (bool) {

    const result = await contract.method
        .logging()
        .send({})
        .on('transactionHash', (tx) => {
            //
        });
};
