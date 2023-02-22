# Storing and Retrieving Student Records using Web3 Technologies with Web User Interface

## Abstract

Securing and issuing academic transcripts is one of the most mind-numbing tasks in the modern world as there are multiple disciplines and manually maintaining the accuracy of the data is tough. Moreover, the data is stored in an untrusted centralized cloud storage system, this type of model possesses a number of issues like high operational cost, data availability, and data security. This project tries to exploit the decentralization and the smart contract feature of the ethereum blockchain. A model where basic student data is stored in a smart contract and large files are stored in IPFS protocol.

## Summary

This project is a web application that allows the user to store and retrieve student records. The user can also search for a student record by roll number. The records can contain student grades, achievements and other information which can be conveniently entered via web application and the same data is be fetched and displayed in a web page.

## Get Started

Things you can run in backend folder:

```shell
# To list all the available commands
npx hardhat help

# To compile the smart contract and run the tests written in test folder
npx hardhat test

# To show gas usage along with the tests
GAS_REPORT=true npx hardhat test

# To deploy the smart contract on the local blockchain
npx hardhat run scripts/deploy.ts

# To deploy the smart contract on the mumbai testnet
npx hardhat run scripts/deploy.ts --network mumbai
```

Things you can run in frontend folder:

```shell
# To install all the dependencies
yarn install

# To start the development server to run the web application
yarn dev
```
