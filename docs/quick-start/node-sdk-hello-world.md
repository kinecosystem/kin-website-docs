---
id: hi-kin-node
title: Hello World Node
---

With the Kin SDK for javascript Node, you can create a server back-end to support your client apps and integrate Kin.
If you’re just getting started with Kin ecosystem, we suggest you spend a few minutes reading this [overview of the Kin architecture.](../kin-architecture-overview.md)

The following tutorial is meant to run on a server and will serve as a crash course on the basic functionalities of the Kin SDK for Node.
As you implement Kin in your service, you should wrap this SDK in your back-end services as you see fit.
Here we will simply look at the most basic functions of the Kin SDK for Node showing you how to create an account on the Kin Blockchain, execute a transaction and read the user's current balance.

This tutorial operates in the Kin Playground environment where you can develop and test your Kin integration.

This tutorial is designed to take you from start to finish in 5 minutes or less, so get ready!

## Setup
First of all, you need to install the Kin SDK. The Kin SDK requires Python 3 and is installed with pip:

```bash
npm install @kinecosystem/kin-sdk
```
## Code Walkthrough
This tutorial covers the primary elements of the script. See the Download link at the end of the article if you want to skip to the finished work.

The script simply executes a set of predefined commands. No user interaction is required except for the creation of a public address.

### The Basics
With the Kin SDK for Node installed, you can create the simple `index.js` script. Let's import `kin`.

```node
// This is the Kin SDK
import * as KinSdk from @kinecosystem/kin-sdk;

```
TODO: CHECH THE CODE ^^

### Manage Accounts
Let's create two accounts: one for a user of your service and one to receive some Kin from your user.

Here you instantiate the `KinClient` and select in which environment you want to work. In this case, you'll work in the Playground (the test environment).

```node
  console.log('First we will create our KinClient object, and direct it to our test environment');
  let client = new KinClient(integEnv);

  console.log("environment", client.environment);
```
###### Output:

```
Environment {
      _url: 'https://horizon-testnet.kininfrastructure.com/',
      _name: 'IntegEnv',
      _passphrase: 'Kin Testnet ; December 2018',
      _friendbotUrl: 'https://friendbot-testnet.kininfrastructure.com' }
```

#### Get a Keypair
With a `KinClient` instantiated, you are ready to either open or create the first account. Accounts always have a keypair of public address (the public address on the blockchain) and private key. *Remember to never share your private keys!*

The Kin SDK for Node generates a keypair based on a secret `seed`. There is a unique relationship between seed and keypair; if you save a secret seed, you can regenerate the associated keypair. A keypair contains 1 seed (aka private key) and 1 public key. You need a unique keypair for each user.

Feel free to save the secret seed after the first run and use it later for other tests.

```node
// Get keypair

const keypair = KeyPair.generate();
console.log("We are using the following keypair: ", keypair.publicAddress.toString());

```

###### Output

``` We are using the following keypair:  GBA4ZP354NDCETBOUS4MGHM5ZCWCCQJ7XJ67CLYT5NAIY5QNA7EFZHRZ ```

#### Check Account Existence and Create
Now that you have a keypair, you can check if the associated account already exists on the blockchain. If not, you'll create it.

**Note:** Creating a keypair does not mean that the account exists or is valid on the blockchain. You need to explicitly create an account using, for example, the following code:

```node
console.log("Since we are on the testnet blockchain, we can use the friendbot to create our account...");
await client.friendbot({ address: keypair.publicAddress, amount: 10000 });

// Init KinAccount
console.log("We can now create a KinAccount object, we will use it to interact with our account");
const account = client.createKinAccount({ seed: keypair.seed });
```

###### Output

```
console.log tests/src/kinClient.intg.test.ts:15
  We are using the following keypair:  GCQX6NC63Y5VTN5PCPHL45HSM34KFCJKMK6KOO4CUEZHG3QDYJT5DMI3

console.log tests/src/kinClient.intg.test.ts:16
  Since we are on the testnet blockchain, we can use the friendbot to create our account...

console.log tests/src/kinClient.intg.test.ts:18
  We can now create a KinAccount object, we will use it to interact with our account
```

Details of the `friendbot` service are too detailed for our Hello World tutorial, so when you're ready you should read [this](../documentation/node-sdk#friendbot).
TODO: CHECH THE LINK ^^

### Get Balance
Whether you created a new account or opened an existing one, you can now perform the most basic action - check the  account balance. The `account` object provides a few basic methods including `getBalance()`.

```node
console.log("We can use our KinAccount object to get our balance");
console.log("Our balance is " + await account.getBalance() + " KIN");
```
#### Output

```node
  console.log tests/src/kinAccount.intg.test.ts:21
    We can use our KinAccount object to get our balance

  console.log tests/src/kinAccount.intg.test.ts:22
    Our balance is 10000 KIN
```

As you see, the new account already has Kin in it! True to its name `friendbot` kindly gave us some Kin to get started.

### Create a New Account
Let's do something more interesting now: let's send Kin to another account.
For simplicity, create a new account, but of course you can send Kin to any account on the blockchain as long as you know its address (public key).
(Sending Kin to your own public address won't work). Note that the owner of the account to which your user will transfer Kin may or may not be another of your users.
* The memo can be up to 21 characters.
* Minimum Fee is 100 kins.
TODO: check the minimum coin name ^^

```node
// Create a different account
console.log("We will now create a different account");
const seconedKeypair = KeyPair.generate();
console.log("Creating account: ", keypair.publicAddress);
const transactionBuilder = await account.buildCreateAccount({
			fee: 100,
			startingBalance: 1000,
			memoText: "Test create account",
			address: seconedKeypair.publicAddress
		});
const transactionHash = await sender.submitTransaction(transactionBuilder);
console.log("We created the account and got the transaction id: ", transactionHash);
```
#### Output

```
console.log tests/src/kinAccount.intg.test.ts:65
  We will now create a different account

console.log tests/src/kinAccount.intg.test.ts:67
  Creating account:  GDJNMB3UPXMLVMQDWCHELVDVDHK4RAINVEO2PBA55WOBFLTT6HVTCOWI

console.log tests/src/kinAccount.intg.test.ts:75
  We created the account and got the transaction id:  e2f254f9ffb1250a7ff905893d0e6d7f9662cbe39e993517ae1645a4c8bfad86
```

### Get the Details of a Transaction
Let's print information about the last action performed.

```node
// Get info about a tx
console.log("We can now use the client to get info about the transaction we did");
const transaction = await client.getTransactionData(transactionHash);
console.log("Transaction data: ", JSON.stringify(transaction));
````
###### Output

```
console.log tests/src/kinAccount.intg.test.ts:78
    Transaction data:  {"fee":100,"hash":"631d022ad9b382d4e28db65ec10adb28089ed0d92c5adefc7222496837dac2d4","sequence":5926758515736577,"signatures":[{"_attributes":{"hint":{"type":"Buffer","data":[186,22,13,146]},"signature":{"type":"Buffer","data":[250,170,219,245,2,32,89,5,75,120,26,71,101,97,44,169,40,237,144,208,248,209,204,25,163,213,87,178,45,167,108,44,116,163,110,123,128,188,197,61,71,126,159,94,85,189,22,155,196,167,143,20,110,192,104,188,61,166,78,226,82,232,50,3]}}}],"source":"GAY7ZK5S5K4V3BHMJRSXTFQKRM2MQAV5YZBGMQDA2264SPF2CYGZFQCK","timestamp":"2019-07-21T13:16:45Z","type":"CreateAccountTransaction","destination":"GA375FPA747GONJQU672GNCQ4D4WUFKKW36TKIB4LXPHIHLFYFKQIFB6","startingBalance":1000,"memo":"1-anon-Test create account"}

```

### Send Kin
Now that you have a destination public address, you can send Kin to the associated account. `const keypair` holds the information of the destination account. You are going to send 10 KIN. Executing this transaction will by default incur a cost of 100 FEE. (1 KIN = 10<sup>-5</sup> FEE)

```node
const transactionBuilder = await account.buildSendKin({
			amount: 100,
			memoText: "Hello World",
			address: seconedKeypair.publicAddress,
			fee: 100
		});
const transactionHash = account.submitTransaction(transactionBuilder);
console.log("The transaction succeeded with the hash ", transactionHash);
```

###### Output

```
console.log tests/src/kinAccount.intg.test.ts:88
  The transaction succeeded with the hash  b27e9a84a5ec5c2bffdd0d04bf4e1ecc3d3726c8719d3241b76e2b2521ec61ca
```


Not all transactions executed on the blockchain will be charged fee. To learn more about transaction fees and whitelisting, see [Whitelist](../documentation/node-sdk#transferring-kin-to-another-account-using-whitelist-service).
TODO: VHECK LINK ADDRESS ^^
In whitelisting transaction we will sign the transaction builder with Whitelisted account. We will show you the process:

```node
  // use premade whitelisted account GAJCKSF6YXOS52FIIP5MWQY2NGZLCG6RDEKYACETVRA7XV72QRHUKYBJ
	const whitelistAccount = client.createKinAccount({seed: "SDH76EUIJRM4LARRAOWPBGEAWJMRXFUDCFNBEBMMIO74AWB3MZJYGJ4J"});
	const transactionBuilder = await account.buildSendKin({
  			amount: 100,
  			memoText: "Hello World",
  			address: seconedKeypair.publicAddress,
  			fee: 100
  		});

	const transaction = transactionBuilder.build();
	const signers = new Array<Keypair>();
	signers.push(Keypair.fromSecret(keyPair.seed));
	transaction.sign(...signers);
	const envelop = transaction.toEnvelope().toXDR("base64").toString();
	const whiteTx = await whitelistAccount.whitelistTransaction({
		envelope: envelop,
		networkId: Network.current().networkPassphrase()
	});
  // A hack to submit a string as a transaction, should be use txSender.submitTransaction.
  const transactionHash = await server.submitTransaction(xdrTransaction);
  console.log("Whitelisted transaction's hash ", transactionHash.hash);
```
TODO: FIX THE server.submitTransaction 'server.submitTransaction' in the code!!!
##### Output

```
console.log tests/src/kinAccount.intg.test.ts:133
  Whitelisted transaction's hash  300540f24604d31d4f6dbf9de18e8ba1b04d6e22cb3fc086703530445832fc69
```


// Check and print transaction details.
//
// ```python
// transaction = await client.get_transaction_data(tx_hash=tx_hash)
//
// # We don't have __str__ for the transaction class, so we print it like this till we add it
// transaction.operation = vars(transaction.operation)
// print('\nThese are the details of the transaction we just executed sending Kin to our test account')
// pprint(vars(transaction))
// ```
//
// ###### Output
//
// ![](../../img/HWPython/7_SendKinTxDetail.png)
//
// Lastly, check the updated balance.
//
// ```python
// print('Updated balance is {}'.format(await client.get_account_balance(new_keypair.public_address)))
// ```

## Conclusions
This was a very short introduction to the Kin SDK for node. This SDK is meant to run on a server and be between your client apps and the Kin Blockchain.
The SDK provides plenty more features for you to explore including support for channels to maximize your transaction throughput.

[//]: # (## Downloads)

[//]: # (Download the full helloWorld.js for your convenience.)

[//]: # (Track progress and download the Node SDK on GitHub.)
