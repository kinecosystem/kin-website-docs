---
id: kin-architecture-overview
title: Kin Architecture Overview
---

Welcome to the Kin Developer Architecture Overview. Here you'll learn about all the high level components necessary for your Kin apps to function.  Some of these are maintined by Kin and others will require you to implement them.

In this diagram you'll see the [Kin Blockchain Service](#kin-blockchain-service) team is responsible for managing the [Kin Blockchain](#kin-blockchain) and [Horizon servers](#horizon-servers), while you are responsible for your [Back-end Server](#back-end-server) using one of our back-end Kin SDKs and [Client App(s)](#client-app) using one of our client Kin SDKs. For clarity and simplicity this is not a complete architecture, but only the parts meaningful to developing an app that uses Kin.

![](../img/kin-architecture-overview.png)

Let's discuss the elements of Kin architecture from the bottom up, beginning with the two [Developer Service](#developer-service).  The developer service is just a general terms for the components that you (the developer) are directly responsible for creating.


## Developer Service

Every developer that plans build a Kin app in a production enviroment is responsible for implementing and maintaining their own developer service (client and back-end).  Each of these components will require a Kin SDK to be integrated into it.

### Client app

Your client app provides an interface for your users, allowing them to create and manage Kin accounts. Kin provides client SDKs including the [Kin SDK for Android](/android/sdk), [Kin SDK for iOS](/ios/sdk) and [Kin SDK for Unity](/unity/sdk).

Opening a user account on the Kin Blockchain begins with the client app. The SDK provides classes and methods to create and securely store a keypair required for accessing the account. The keypair consists of a public address (sometimes called public key) and a private key.

The client SDK also provides classes and methods for managing the account, including such key actions as:

- Obtaining account balance
- Sending Kin from the user's account to another account on the Kin Blockchain.
- Listening for events on the user's account.

For a quick code introduction to client apps, see the [Hello World Client](/android/hi-kin) for Android or the [Hello World Client](/unity/hi-kin) for Unity.

### Back-end server

When you're in production, your back-end server will provide crucial Kin services to your users. Kin provides the [Kin SDK for Python](/python/sdk) and the [Kin SDK for Node.js](/nodejs/sdk) for your use.

After a client app begins the process of account creation, they'll send a request to your server to add the account to the Kin Blockchain. Our back-end Kin SDKs allow you to process those requests with high throughput. You will in turn send a request to a Horizon server managed by the Kin Blockchain service. The Kin Blockchain service will process the request and return a result, which could include error codes.

The back-end server Kin SDKs provide such key actions as:

- Functions to create accounts, send transactions and read account balances
- Authorizing your users to execute transactions on the blockchain without being charged Fee (whitelisting). (This requires prior approval from Kin.)
- Monitoring multiple accounts
- Creating channels to process multiple transactions at the same time

For a quick introduction to back-end server coding, apps, see the [Hello Server World](/python/hi-kin) for Python.

## Kin Blockchain Service

The Kin Foundation (and its partners) are responsible for managing two key components in the Kin architecture.

### Horizon servers

Horizon servers provide REST API access to the Kin Blockchain. There are two Horizon server endpoints: one for the production environment and one for testing. Kin SDKs come preconfigured with variables to pick which blockchain environment to use.

### Kin Blockchain

The Kin Blockchain is a decentralized service optimized for the Kin Ecosystem. Key attributes include:

- **High throughput.** It's our goal to build with you the most used blockchain in the world, and we made sure our blockchain has the capacity to grow.
- **Kin Rewards Engine (KRE)**. Each participating developer is compensated by the Kin Foundation for their contribution to the growth of the Kin ecosystem. When the rewards engine goes live it will transfer Kin directly from the foundation to your account on the Kin Blockchain.
- **Low transaction cost.** Like most blockchains, Kin Blockchain by default charges a very small fee to execute a transaction. This helps prevent spam and denial of service attacks on the blockchain by unknown and untrusted participants. Kin Blockchain technology allows your users to avoid blockchain fees if you label all of their transactions with an `appID` and get your app approved by Kin to participate in the Whitelist service.

## Environments
Kin has two environments available to developers.

The **Test environment** is where developers can test their integration of Kin, create accounts freely and execute transactions. This environment might be reset at times. In the actual SDKs we refer to this as "testnet".

The **Production environment** is the public blockchain where all public transactions happen. The environment is never reset.

The two environments should be as similar as possible although we normally push updates to the Test environment first. In the Test environment we also have the friendbot available to developers.  In the actual SDKs we refer to this as "mainnet".

## Next steps
Now that you have a better understanding of the architecture, now we can begin to tie it all together in the next section.
