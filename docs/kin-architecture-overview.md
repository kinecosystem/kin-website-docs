---
id: kin-architecture-overview
title: Kin architecture overview
---

Welcome to the Kin Developer documentation. Here you'll find everything you need to allow your users to earn, spend, and manage Kin.

If you're looking for code samples or something specific you can jump right to the [**Quick Start**](quick-start/quick-start.md) or [**Documentation**](documentation/documentation.md) sections.

Making Kin work for your users is a cooperative effort. In this diagram you'll see the [Kin Blockchain Service](#kin-blockchain-service) team is responsible for managing the [Kin Blockchain](#kin-blockchain) and [Horizon servers](#horizon-servers), while you will add features to your [Back-end Server](#back-end-server) and [Client App(s)](#client-app). For clarity and simplicity this is not a complete architecture, but only the parts meaningful to developing an app that uses Kin.

![](/img/kin-architecture-overview.png)

Let's discuss the elements of Kin architecture from the bottom up, beginning with the two [Developer Service](#developer-service) elements you're directly responsible for developing.


## Developer Service

You have direct control over developing one or more client apps and for maintaining a back-end server.

### Client app

Your client app provides an interface for your users, allowing them to create and manage Kin accounts. Kin provides client SDKs including the [Kin SDK for Android](documentation/android-sdk.md) and [Kin SDK for iOS](documentation/ios-sdk.md).

Opening a user account on the Kin blockchain begins with the client app. The SDK provides classes and methods to create and securely store a keypair required for accessing the account. The keypair consists of a public address (sometimes called public key) and a private key.

The client SDK also provides classes and methods for managing the account, including such key actions as:

- Obtaining account balance
- Sending Kin from the user's account to another account on the Kin blockchain.
- Listening for events on the user's account.

For a quick code introduction to client apps, see the [Hello Client World](quick-start/hi-kin-android) for Android.

### Back-end server

When you're in production, all communication with your users are handled by your back-end server. Kin provides the [Kin SDK for Python](documentation/python-sdk.md) for your use.

After a client app begins the process of account creation, they'll send a request to your server to add the account to the Kin blockchain. The Kin SDK for Python includes scripts that allow you to process those requests with high throughput. You will in turn send a request to a Horizon server managed by the Kin Blockchain service. The Kin Blockchain service will process the request and return a result including error codes.

The Kin SDK for Python provides such key actions as:

- Functions to create accounts, send transactions and read account balances
- Authorizing your users to execute transactions on the blockchain without being charged Fee. (This requires prior approval from Kin.)
- Monitoring multiple accounts
- Creating your own server account on the Kin blockchain. This account will be used to receive your rewards once the Kin Rewards Engine is live.

For a quick introduction to back-end server coding, apps, see the [Hello Server World](quick-start/hi-kin-python) for Python.

## Kin Blockchain Service

The Kin Foundation (and its partners) is responsible for managing two key components in the Kin architecture.

### Horizon servers

Horizon servers provide REST API access to the Kin Blockchain. There are two Horizon server endpoints: one for the production environment and one for testing. SDKs come preconfigured with variables to pick which blockchain environment to use.

### Kin Blockchain

The Kin Blockchain is a decentralized service optimized for the Kin Ecosystem. Key attributes include:

- **High throughput.** It's our goal to build with you the most used cryptocurrency in the world, and we made sure our blockchain has the capacity to grow.
- **Kin Rewards Engine (KRE)**. Each participating developer is compensated by the Kin Foundation for their contribution to the growth of the Kin ecosystem. When the rewards engine goes live it will transfer Kin direction from the foundation to your account on the Kin blockchain.
- **Low transaction cost.** Like most blockchains, Kin blockchain by default charges a very small fee to execute a transaction. This helps prevent spam and denial of service attacks on the blockchain by unknown and untrusted participants. Kin blockchain technology allows users to avoid blockchain fees if you label all of their transactions with an `appID` and get your app approved by Kin to participate in the Whitelist service.

## Next steps
That covers the big picture of the Kin Blockchain architecture. From here we suggest you go to:

- [The Quick Start section](quick-start/quick-start.md)
- [The Documentation section](documentation/documentation.md)
- [Directly to our GitHub repository](https://github.com/kinecosystem/)
