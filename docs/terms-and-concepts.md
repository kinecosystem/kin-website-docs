---
id: terms-and-concepts
title: Terms & Concepts
---

The Kin Developer Platform SDKs and tools contain many terms and concepts that you might be unfamilar with and we want to make sure you have a place to reference back to them in case you forget.  Here is a list of all the key terms and concepts:

## Accounts
Accounts (sometimes referred to as wallets) are objects that allow their owners to store and manage funds (Kin) and to perform various Kin transactions. There are two basic types of Kin accounts - local (client) account {ref} and blockchain account {ref} . Each fully functioning local account has a corresponding blockchain account.

## Account, local (client)

A local account is created on a client app (i.e., on a user's device). Referred to in the docs as KinAccount. It serves two purposes:
* Each local account holds its unique identifier known as public/private keypair {ref}, generated when the account is created. The keypair also uniquely identify the corresponding blockchain account {ref} and ensures the security of Kin transactions against it.  
* A local account allows its owner to build and send transactions to be processed by the blockchain. Each transaction is signed with the private key of the keypair (without disclosing it).

## Account, blockchain

Each local (client) account {ref} has a corresponding blockchain account, without which no blockchain transactions can be processed. After a local account is created, the public key of its keypair {ref} is used as a unique identifier for creation of the blockchain account. See {ref}
After the blockchain account is created, the public key of the keypair {ref} that it holds allows the blockchain to verify each transaction signed with the private key of the keypair.  
In addition, the blockchain account holds the Kin balance and has access to the account data stored in the blockchain database (e.g., transaction log).


## Account, Operational
This is an account that resides on the developer's backend server. It is used for signing transactions of account creation and whitelisting using the developer's secret seed {??}. This is also the account where the developer stores Kin to pay earns to the users.

## Account, Cold Storage 
This account is used for storing large amounts of Kin offline and to receive KRE rewards. The developer can use this account to replenish the operational account when it’s running low on Kin.

## Creating Accounts
This is a two-step process, and the flow requires both the client SDK and the server SDK. First, an account is created locally on client, which generates a public/private keypair. At this point, no account exists on the blockchain yet. Then, the public key is sent to the developer's server, where the server SDK creates a blockchain account using this public address in a process called “onboarding”. A successful account creation results in a transaction ID.

## AppID 

An appID is a unique identifier assigned to your app by Kin. When you initialize your Kin SDK clients with your appID string, it will be automatically added to the memo field of each transaction sent to the Kin Blockchain by your users. Your appID will be used to track the activity your application generates so you can be rewarded from the Kin Rewards Engine.  The appID string consists of three or four UTF-8 characters containing only digits and upper and/or lowercase letters. While you are testing your integration in the Kin Test environment, you can use any valid string as long as you only use digits and upper or lowercase letters.

## Backend Server

When you're in production, your backend server will provide crucial Kin services to your users. Kin provides the [Kin SDK for Python](/python/sdk) and the [Kin SDK for Node.js](/nodejs/sdk) for your use. [More...](/kin-architecture-overview#back-end-server)

## Channels

Channels are additional accounts that are used internally in the Kin SDK to increase the performance of the server. Simply put, if you have X channels, you will be able to perform X transactions at the same time.  The concept of channels is only relevant to our back-end server SDKs and not the client SDKs. You can view more detailed information for using channels with our [Python SDK](/python/sdk#channels) and the [NodeJs SDK](/nodejs/sdk#channels).

## Client App

Your client app is an interface for your users, allowing them to create and manage Kin accounts. Kin provides client SDKs including the [Kin SDK for Android](/android/sdk), [Kin SDK for iOS](/ios/sdk) and [Kin SDK for Unity](/unity/sdk) to allow for this functionality.  [More...](/kin-architecture-overview#client-app)

## Creating An Account

This is a two-step process, and the flow requires both the client SDK and the server SDK. First, an account is created locally on client, which generates a public/private keypair. At this point, no account exists on the blockchain yet. Then, the public key is sent to the developer's server, where the server SDK creates a blockchain account using this public address in a process called “onboarding”. A successful account creation results in a transaction ID.
## Earn

The concept of an earn is when a user is rewarded by the app, which means that a payment transaction is sent from the developer’s [Operational Account](/terms-and-concepts#operational-account) to a User Account.

## Friendbot

Friendbot is a simple service that can create and fund accounts on behalf of developers. Kin SDKs normally have this preconfigured and also allow developers to test a client app without immediately integrating one of our backend SDKs on your server. Friendbot is only available in the test environment.

For detailed instructions for using Friendbot check [HERE](/friendbot).

## Horizon Servers

Horizon servers provide REST API access to the Kin Blockchain. There are two Horizon server endpoints: one for the production environment and one for testing. Kin SDKs come preconfigured with variables to pick which blockchain environment to use.

## Keypair

A keypair is a combination of a public key (public address) and private key (private seed) generated when a local (client) account is created.  There is a one-to-one correspondence between the private key and the public key created by means of a cryptographic algorithm. This correspondence is asymmetrical, that is, the public key can be easily derived from the private key, but the private key cannot be obtained from the public key. This property of a keypair is used for securing Kin transactions on the blockchain. 
The private key is supposed to be stored securely by the owner of the account, whereas the public key serves as the identifier of the account on the blockchain and thus can be freely exposed to anyone. 
Each transaction sent from a local account to the blockchain is signed with a signature derived from the private key (without disclosing it). The blockchain uses the public key held by the blockchain account to verify that the signature is valid, i.e., created by the owner of the corresponding private key. 

## Kin Blockchain

The Kin Blockchain is a decentralized service optimized for the Kin Ecosystem. [More...](/kin-architecture-overview#kin-blockchain)

## Kin Client

One of two classes used for access the Kin blockchain. It serves as the entry point to the SDK as well as an account manager for accounts on the client device.

## Kin Rewards Engine (KRE)

The Kin Rewards Engine is a mechanism in which we pay developers in Kin for the the value they bring to the ecosystem (the amount of spend transactions that their users produce.  They payments currently happen on a weekly basis.  To learn more visit the [Kin Rewards Engine Section](https://www.kin.org/kre) on our webite.

## Memo

The memo is a field that can be added to each blockchain transaction.  It can be used for anything you’d like, the same way you can add a memo on a check from your bank.  Kin has a specific use for it, though.  When your start your KinClient using your Kin provided appID, this gets added to the memo field of each transaction produced in your app so we can count the spends that your app produces to track the rewards you’ll receive from the Kin Rewards Engine. The memo can also be used to store additional data for each transaction.

## Network URL (Horizon Endpoint)

The location of a Horizon Server (Node) providing access to the test or production blockchain.

Test - https://horizon-testnet.kininfrastructure.com/

Production - https://horizon.kinfederation.com

## Network Passphrase

A network ID used to distinguish between different blockchain networks; this is hashed into every transaction ID

Test - Kin Testnet ; December 2018

Production - Kin Mainnet ; December 2018

## Onboarding

Before a new account (created on the client) can be used, it must be added to the blockchain in a process called onboarding.  This is accomplished by sending the public address from the key pair you generate on the client device to your server to create the account by sending a dedicated transaction to the blockchain using one of our server SDKs. On the playground/testnet environment, you can do this using friendbot instead of your own server.  To understand the entire flow of creating an account, see [Creating An Account](/terms-and-concepts#creating-an-account).

Before a new account (created on the client) can be used, a corresponding account must be created on the blockchain in a process called onboarding. A new account on the blockchain can be created only by another account that already exists on the blockchain. Any account can perform this action, including any Kin Exchange. 
The onboarding flow consists of the following:
1. The client account sends its public key to the backend server.
2. The server builds a Create Account transaction, has it signed by the operational account and sends it to the blockchain.
3. The blockchain creates a new account with the public key as its identifier and address.

In the playground/testnet environment, onboarding can be done using friendbot {ref} instead of a backend server. 

## Public Key (Public Address)

A public key is the address (identifier) of a user account on the blockchain, which holds the account’s balance and has access to the blockchain data. You can retrieve it using our Blockchain Explorer {ref}.

## Private Key (Private Seed)

A private key is used for authentication and encryption. It allows unlocking and accessing the Kin blockchain account it belongs to. As such, it should be stored securely by the user. To be processed by the blockchain, any transactions on a blockchain account have to be signed with its private key (without actually disclosing it).

## Production Environment (Mainnet)

The Production environment is the public blockchain where all public transactions happen. In the actual SDKs we refer to this as "Mainnet".

## Retrieving a Kin Account

Retreiving a Kin Account is the process of using the [Kin Client](/terms-and-concepts#kin-client) to search and retrieve any account stored on the clients phone. If one exists, then you can use it to perform blockchain actions on behalf of the user. If one does not exist then you will need to [Create An Account](/terms-and-concepts#creating-an-account).

## Sending A [payment] Transaction

Sending a payment transaction happens when a user [spends](/terms-and-concepts#spend) Kin. This can either be a a payment to another user (p2p) or a payment to the app itself (purchasing digital goods or content. These are done in the same way, and the only difference is the public address on the receiving end. Regardless of who is being paid, there are two ways to do this. You can send a whitelisted or non-whitelisted payment transaction. A non-whitelisted payment does not require the transaction to be sent to the server and can be sent directly from the client app and must pay a fee. A whitelisted transaction is build on the client, sent to the server to be [whitelisted](/terms-and-concepts#whitelisting) by the developers [operation account](/terms-and-concepts#operation-account), returned to the client and then sent off to the blockchain.


## Spend

The concept of a spend is when a user sends a payment [transaction](/terms-and-concepts#transaction) to either another user account (p2p) or to the developer’s [Operational Account](/terms-and-concepts#operational-account) (purchasing digital good or content).

## Test Environment (Testnet)

The Test environment is where developers can test their integration of Kin, create accounts freely and execute transactions. This environment might be reset at times. In the actual SDKs we refer to this as "Testnet".

## Transaction

A [blockchain] transaction can contain multiple independent operations (up to 100). 
Most common transaction types are payment transactions and create account transactions (transaction with a single operation of payment/create account)

## Transaction Fee

These are the fees charged by the blockchain for each [transaction](/terms-and-concepts#transaction) by a non-whitelisted account.  By default, transactions on the Kin Blockchain are charged a minimal fee (.001 Kin). The minimum required fee is dictated by the blockchain and can be queried by calling the get_minimum_fee() SDK function.  Fees on the Kin blockchain are an anti-spam feature intended to prevent malicious actors from spamming the network.  Approved Kin apps can be “whitelisted” to exempt them or their users from paying these fees.

## Whitelisted Account

A whitelisted account is an account that is added to a special list on our servers that allows it to send feeless transactions on the Kin blockchain.  An approved Kin app can send its Developer Account public address to us, and we will whitelist it.  Then not only will this account’s transactions be processed by the blockchain free of charge but the account will also be able to sign transactions for the app’s users to make them fee-less as well.

## Whitelisting

This is the process of signing a transaction by a whitelisted account so that there are no fees associated with the given transaction.  Whitelisting a transaction takes place when one of your users is sending a payment to either another user (p2p) or to the app itself (paying for digital content).

Whitelisting a transaction happens on the server using one of our backend SDKs after the transaction has already been built on the client and sent to the server.

You can read more about the full flow of this process in Sending a Transaction.

