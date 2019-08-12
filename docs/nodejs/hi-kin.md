---
id: hi-kin
title: Hello World Node
---

With the Kin SDK for Node.js, you can create a server back-end to support your client apps and integrate Kin.
If you’re just getting started with Kin ecosystem, we suggest you spend a few minutes reading this [overview of the Kin architecture.](../kin-architecture-overview.md)

The following tutorial is meant to run on a server and will serve as a crash course on the basic functionalities of the Kin SDK for Node.
As you implement Kin in your service, you should wrap this SDK in your back-end services as you see fit.
Here we will simply look at the most basic functions of the Kin SDK for Node showing you how to create an account on the Kin Blockchain, execute a transaction and read the user's current balance.

This tutorial operates in the Kin Playground environment where you can develop and test your Kin integration.

This tutorial is designed to take you from start to finish in 5 minutes or less, so get ready!

## Setup
First of all, you need to install the Kin SDK. The Kin SDK requires Node v8 or higher and is installed with npm:

```bash
npm install @kinecosystem/kin-sdk-node
```
## Code Walkthrough
This tutorial covers the primary elements of the Node.js SDK. See the Download link at the end of the article if you want to skip to the finished work.

The following examples simply run a set of predefined commands. No user interaction is required except for the creation of a public address.

### The Basics
With the Kin SDK for Node installed, you can create the simple `index.js` script. Let's import `kin`.

```javascript
// This is the Kin SDK
require("@kinecosystem/kin-sdk-node");

```

### Manage Accounts
Let's create two accounts: one for a user of your service and one to receive some Kin from your user.

Here you instantiate the `KinClient` and select in which environment you want to work. In this case, you'll work in the Playground (the test environment).

```javascript
  const KinClient = require('@kinecosystem/kin-sdk-node').KinClient;
  const Environment = require('@kinecosystem/kin-sdk-node').Environment;
  
  console.log('First we will create our KinClient object, and direct it to our test environment');
  let client = new KinClient(Environment.Testnet);
  
  console.log("environment", client.environment);
```
###### Output:
```
environment Environment {
  _url: 'https://horizon-testnet.kininfrastructure.com/',
  _name: 'Test',
  _passphrase: 'Kin Testnet ; December 2018',
  _friendbotUrl: 'https://friendbot-testnet.kininfrastructure.com' }
```

#### Get a Keypair
With a `KinClient` instantiated, you are ready to either open or create the first account. Accounts always have a keypair of public address (the public address on the blockchain) and private key. *Remember to never share your private keys!*

The Kin SDK for Node.js generates a keypair based on a secret `seed`. There is a unique relationship between seed and keypair; if you save a secret seed, you can regenerate the associated keypair. A keypair contains 1 seed (aka private key) and 1 public key. You need a unique keypair for each user.

Feel free to save the secret seed after the first run and use it later for other tests.

```javascript
  const KeyPair = require('@kinecosystem/kin-sdk-node').KeyPair;
  // Get keypair
  
  const keypair = KeyPair.generate();
  console.log("We are using the following keypair: ", keypair.publicAddress);
```

###### Output
``` 
We are using the following keypair:  GBA4ZP354NDCETBOUS4MGHM5ZCWCCQJ7XJ67CLYT5NAIY5QNA7EFZHRZ 
```

#### Check Account Existence and Create
Now that you have a keypair, you can check if the associated account already exists on the blockchain. If not, you'll create it.

**Note:** Creating a keypair does not mean that the account exists or is valid on the blockchain. You need to explicitly create an account using, for example, the following code:

```javascript
  console.log("Since we are on the testnet blockchain, we can use the friendbot to create our account...");
  client.friendbot({ address: keypair.publicAddress, amount: 10000 }).then(response => {
    // Init KinAccount
    console.log("We can now create a KinAccount object; we will use it to interact with our account");
    const account = client.createKinAccount({ seed: keypair.seed });
    console.log("This is the app ID of our account:", account.appId);
  });
```

###### Output
```
Since we are on the testnet blockchain, we can use the friendbot to create our account...
We can now create a KinAccount object, we will use it to interact with our account
This is the app ID of our account: anon
```

Details of the `friendbot` service are too detailed for our Hello World tutorial, so when you're ready you should read [this](../documentation/nodejsjs-sdk#friendbot).

### Get Balance
Whether you created a new account or opened an existing one, you can now perform the most basic action - check the  account balance. The KinAccount object provides a few basic methods including `getBalance()`.

```javascript
  // Init KinAccount
  console.log("We can now create a KinAccount object, we will use it to interact with our account");
  const account = client.createKinAccount({ seed: keypair.seed });


  console.log("We can use our KinAccount object to get our balance");
  account.getBalance().then(balance => {
    console.log("Our balance is " + balance + " KIN");
  })
```

###### Output
```
We can use our KinAccount object to get our balance
Our balance is 10000 KIN
```

As you see, the new account already has Kin in it! True to its name `friendbot` kindly gave us some Kin to get started.

### Create a New Account
Let's do something more interesting now: let's send Kin to another account.
For simplicity, create a new account, but of course you can send Kin to any account on the blockchain as long as you know its address (public key).
(Sending Kin to your own public address won't work). Note that the owner of the account to which your user will transfer Kin may or may not be another user of yours.
* The memo can be up to 21 characters.
* The minimum fee is 100 quark.

```javascript
  // Create a different account
  console.log("We will now create a different account");
  const newKeypair = KeyPair.generate();
  console.log("Creating account: ", keypair.publicAddress);
  account.buildCreateAccount({
        fee: 100,
        startingBalance: 1000,
        memoText: "Test create account",
        address: newKeypair.publicAddress
      }).then(transactionBuilder => {
        account.submitTransaction(transactionBuilder).then(transactionHash => {
          console.log("We created the account and got the transaction id: ", transactionHash);
        });
      });
```
###### Output
```
We will now create a different account
Creating account:  GCUAX7KGOOJHJWTU5SMBZMF2DLOAVGPOWRZ7KTK6K5QC2ONUW4JWY2Z5
Our balance is 10000 KIN
We created the account and got the transaction id:  4e6b5ec1b27554e3592cf0f9f8354a3d055950db4192cae418cd0fd72f14e483
```

### Get the Details of a Transaction
Let's print information about the last action performed.

```javascript
  // Get info about a tx
  console.log("We can now use the client to get info about the transaction we did");
  client.getTransactionData(transactionHash).then(transaction => {
    console.log("Transaction data: ", JSON.stringify(transaction))
  });
```
###### Output
```
Transaction data: {
          "fee":100,
          "hash":"3427b3b4cb4025162e90eba5715e4d28e523be59975e67dcfac1083305758e1b",
          "sequence":6519116110233601,
          "signatures":[
            {"_attributes":
              {"hint":
                {"type":"Buffer",
                "data":[92,123,211,223]},
                "signature":{
                  "type":"Buffer",
                  "data":[43,27,251,34,70,37,63,110,104,214,98,134,15,198,245,225,151,176,195,135,9,221,178,54,119,111,252,41,118,107,249,174,254,203,114,252,209,5,152,57,168,194,11,112,244,222,216,174,182,97,133,149,36,10,108,146,150,75,117,22,176,104,80,0]
                }
              }
            }
          ],
          "source":"GD6AMNVTNREII6CTQWIQQ75IY6VJE4JS4N6T4DLQU2VIV5C4PPJ565WY",
          "timestamp":"2019-07-29T12:49:57Z","type":"CreateAccountTransaction",
          "destination":"GC5ANPUMUPCWFYYRFEHAXWUFVIEAX5ILRHQYTCYLSM7RAJSJRWTHCDGS",
          "startingBalance":1000,
          "memo":"1-anon-Test create account"
        }
```

### Send Kin
Now that you have a destination public address, you can send Kin to the associated account. keypair holds the information of the destination account. You are going to send 10 KIN. Executing this transaction will by default incur a cost of 100 Quarks. (1 KIN = 10<sup>-5</sup> Quarks)

```javascript
  account.buildSendKin({
    amount: 100,
    memoText: "Hello World",
    address: newKeypair.publicAddress,
    fee: 100
  }).then(transactionBuilder => {
    account.submitTransaction(transactionBuilder).then(transactionHash => {
      console.log("The transaction succeeded with the hash ", transactionHash);
    });
  });
```

###### Output
```
The transaction succeeded with the hash  251fa6e5835d49c6bfddb904cded853285177a96a1d625fd368d87a75b2c01c2
```

Not all transactions executed on the blockchain will be charged a fee. To learn more about transaction fees and whitelisting, see [Whitelist](../documentation/node-sdk#transferring-kin-to-another-account-using-whitelist-service).
If an account is whitelisted, it signs the transaction builder and its transactions are processed by the blockchain free of charge.

## Conclusions
This was a very short introduction to the Kin SDK for node. This SDK is meant to run on a server and be between your client apps and the Kin Blockchain.
The SDK provides plenty more features for you to explore including support for channels to maximize your transaction throughput.

[//]: # (## Downloads)

[//]: # (Download the full helloWorld.js for your convenience.)

[//]: # (Track progress and download the Node SDK on GitHub.)
