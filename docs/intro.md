---
id: intro
title: Getting Started
---

Welcome to the Kin Developer documentation. Here you'll find everything you need to integrate Kin into your new or existing application.  These tools will allow your users to earn, spend, and manage Kin.

## What You’ll Need to Get Started

Kin is a cryptocurrency that runs on a fork of the Stellar blockchain.  We currently have both a Test and Production environment.  Each of these environments has its own separate blockchain and a list of required parts to build with them.

### Test Environment

Our test environment gives you the ability to quickly dive into building and sending transactions using one of our Hello World applications for iOS, Android or Unity.  You can even verify your transactions using our [Blockchain Explorer](https://kin.org/blockchainExplorer).  When you are building an app on our test environment, you really only need two things:

* __Client App__ - uses one of our client SDKs (for iOS, Android or Unity)
  * For creating accounts locally on the client
  * For building and sending transactions
  * For listening to balance updates
  * For listening to payments
  * For listening to account creations
* __Friendbot__ - simulates your backend server
  * For creating accounts on the test blockchain
  * For funding user accounts on the blockchain
  * For simulating paying earns to your users on the blockchain

### Production Environment

When transitioning from a test to production, you’ll need some additional parts in order to go live. It is important to remember is that in production, instead of calling Friendbot, your client app will call your own backend server, which has to use one of our backend SDKs.

This means that in order to have a fully functioning Kin app in production you will need to use BOTH a client Kin SDK and a backend (server) Kin SDK.  Each of these SDKs serves its own purpose, and without the server SDK you would not be able to create accounts, pay earns,  or whitelist transactions (making them fee-less for your users).

These are the components you need to have in order to set up a fully functioning Kin application:

* __Client App__ - uses one of our client SDKs (for iOS, Android or Unity)
  * For creating accounts locally on the client
  * For building and sending transactions
  * For listening to balance updates
  * For listening to payments
  * For listening to account creations
*__Backend Server__ - you will set it up using one of our backend SDKs (for NodeJS or Python)
  * Replaces Friendbot that you used for the Test Environment
  * For creating user accounts on the blockchain
  * For whitelisting transactions on the blockchain
  * For paying earns to your users
  * For listening to accounts and transactions on the blockchain
*__Operational Account__ - 
  * You can create this using [Kin Laboratory](https://laboratory.kin.org/)
  * For signing transactions
  * For receiving payments from your users
  * For paying earns to your users
  * For whitelisting transactions and making them feeless for your users (account must be whitelisted by us first)
  * To get your account whitelisted you must send us the public address of the account
*__Cold Storage Account__ -
  * You can create this using [Kin Laboratory](https://laboratory.kin.org/)
  * For receiving KRE rewards
  * For storing large amounts of Kin offline (not connected to server)
*__App ID__
  * It is not required (only for KRE rewards)
  * You can obtain this when you join one of our Developer Programs
  * Parameter used when starting the client and server SDKs
  * Is added to the memo field for each transaction
  * To track every transaction in your app
  * To track the spends in your app to pay your KRE Rewards
  * Stats will be publicly available on our stats page

  


