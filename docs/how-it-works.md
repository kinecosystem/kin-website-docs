---
id: how-it-works
title: How It Works
---

In the previous section we discussed the overall architecture of Kin.  We learned there are 4 main components.  The Client, Back-End Server, Horizon and the Blockchain.  Horizon and the Blockchain are managed by Kin and it’s partners and you will never interact with them directly. The client and the back-end server are created and managed by the developer.  Each of these developer components will need to integrate one of the Kin SDKs.

You might wonder why it’s necessary to have a Kin SDK integrated on both the client and the backend server. Both of these components serve distinct purposes in the flow of a Kin app.

First you need to understand the core functionality of a Kin app.  What can a Kin integrated app do?  The 3 main features of a Kin app are creating accounts, earning (developers sends payment to user) and spending (user sends payment to another user or to the app) all on the blockchain.  The Kin SDKs allow you to easily leverage blockchain in your app without the need to understand how it works under the hood.  Our SDK handles all the blockchain interaction for you.

Before we go any further we need to touch on a few things first.  Any transaction that takes place on the blockchain must be signed by an account using its private key/secret seed.  This lets the blockchain know which account to deduct the Kin from.  Every user of your app will get one of these keys/seeds when you create their account.  This seed is actually encrypted and stored on the user’s phone.  When one of your users wants to send a payment transaction, this key will be used to sign it, and the specified amount of kin will be deducted from their account.

Your backend server also has an account of its own, just like one of your users, which we refer to this as the operational account.  This account serves many purposes. The private key/secret seed of this account is stored on your server and is used to create new accounts on the blockchain, paying earns to your users and whitelist transactions.  

In order to create a new account on the Kin blockchain you need an existing account to sign the transaction and create it.  This is done by your operational account.

Your operational account is where all of your active Kin is stored so this is how you will also pay earns to your users.

By default all transactions on the Kin blockchain are charged a fee.  Approved Kin apps can have their operational account whitelisted by us making its transactions feeless.  Not only that but it can be used to whitelist the transactions of your users, making them feeless as well.

All of the functions of your operational wallet above require the secret seed of your account.  This is why the server SDK is necessary in the flow of a Kin app.



