---
id: developer-checklist
title: Developer Checklist
---

So now you've read through the "Kin Architecture Overview" and "How It Works" and you're ready to start building with Kin? Before you jump into our technical docs please take some time to check out our different environments and what you need for each of them.  We currently have both a Test and Production environment.  Each of these environments has its own separate blockchain and a list of required parts to build with them.

### Test Environment

Our test environment gives you the ability to quickly dive into building and sending [transactions](/terms-and-concepts#transaction) using one of our Hello World applications for iOS, Android or Unity.  You can even verify your [transactions](/terms-and-concepts#transaction) using our [Blockchain Explorer](https://www.kin.org/blockchainExplorer).  When you are building an app on our test environment, only need two things:

* __Client App__
  * Using one of our client SDKs (for iOS, Android or Unity)
  * For [creating accounts](/terms-and-concepts#creating-accounts) locally on the client
  * For building and sending [transactions](/terms-and-concepts#transaction)
  * For listening to balance updates
  * For listening to payments
  * For listening to account creations
* __Friendbot__
  * Simulates your backend server
  * For creating [accounts](/terms-and-concepts#accounts) on the test blockchain
  * For funding user [accounts](/terms-and-concepts#accounts)on the blockchain
  * For simulating paying [earns](/terms-and-concepts#earn) to your users on the blockchain

### Production Environment

When transitioning from a test to production, you’ll need some additional parts in order to go live. It is important to remember is that in production, instead of calling [Friendbot](/terms-and-concepts#friendbot), your client app will call your own backend server, which has to use one of our backend SDKs.

This means that in order to have a fully functioning Kin app in production you will need to use BOTH a client Kin SDK and a backend (server) Kin SDK.  Each of these SDKs serves its own purpose, and without the server SDK you would not be able to create accounts, pay earns,  or whitelist transactions (making them fee-less for your users).

These are the components you need to have in order to set up a fully functioning Kin application:

* __Client App__
  * uses one of our client SDKs (for iOS, Android or Unity)
  * For [creating accounts](/terms-and-concepts#creating-accounts) locally on the client
  * For building and sending [transactions](/terms-and-concepts#transaction)
  * For listening to balance updates
  * For listening to payments
  * For listening to account creations
* __Backend Server__
  * You will set it up using one of our backend SDKs (for NodeJS or Python)
  * Replaces [Friendbot](terms-and-concepts#friendbot) that you used for the Test Environment
  * For [creating accounts](/terms-and-concepts#creating-accounts) on the blockchain
  * For [whitelisting transactions](/terms-and-concepts#whitelisting) on the blockchain
  * For paying [earns](/terms-and-concepts#earn) to your users
  * For listening to [accounts](/terms-and-concepts#accounts) and [transactions](/terms-and-concepts#transaction) on the blockchain
* __Operational Account__
  * You can create this using [Kin Laboratory](https://laboratory.kin.org/)
  * For signing [transactions](/terms-and-concepts#transaction)
  * For receiving payments from your users
  * For paying [earns](/terms-and-concepts#earn) to your users
  * For [whitelisting transactions](/terms-and-concepts#whitelisting) and making them feeless for your users ([accounts](/terms-and-concepts#account) must be [whitelisted](/terms-and-concepts#whitelisted-account) by us first)
  * To get your account [whitelisted](/terms-and-concepts#whitelisted-account) you must send us the [public address](/terms-and-concepts#public-key-public-address) of the [account](/terms-and-concepts#accounts)
* __Cold Storage Account__
  * You can create this using [Kin Laboratory](https://laboratory.kin.org/)
  * For receiving KRE rewards
  * For storing large amounts of Kin offline (not connected to server)
* [__App ID__](/terms-and-concepts#appid)
  * It is not required (only for [KRE](/terms-and-concepts#kin-rewards-engine-kre) rewards)
  * You can obtain this when you join one of our Developer Programs
  * Parameter used when starting the client and server SDKs
  * Is added to the [memo](/terms-and-concepts#memo) field for each [transaction](/terms-and-concepts#transaction)
  * To track every [transaction](/terms-and-concepts#transaction) in your app
  * To track the [spends](/terms-and-concepts#spend) in your app to pay your [KRE](/terms-and-concepts#kin-rewards-engine-kre) Rewards
  * Stats will be publicly available on our [stats page](https://www.kin.org/stats)

  


