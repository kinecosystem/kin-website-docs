---
id: terms-and-concepts
title: Terms & Concepts
---

## Account

Accounts are a fundamental component of Kin - it holds Kin balances and allows its owners to send and receive payments. An account is associated with a keypair: the keypair's public address is used as the identifier for the account, while its private seed is used to authenticate transactions for the account. 

## App Index

An app index is a unique index assigned to apps who are registered. When you initialize your Kin SDK with your app index, it automatically gets included in the memo of transactions sent by your users and/or backend server. It gets used to track the activity your application generates so you can be rewarded from the [Kin Rewards engine](https://www.kin.org/kre/). An app index is an unsigned 16-bit integer.

## Backend Server

See [Backend Server](/kin-architecture-overview#backend-server).

## Client App

See [Client App](/kin-architecture-overview#client-app).

## Commitment

Describes how finalized a block is at a point in time. Clients can specify a commitment level in their requests to Agora depending on how certain they want the returned state to be. See [Commitment](/solana#commitment) for more details. 

## Earn

An earn is a payment from an app to a user (e.g. as a reward for a specific behaviour).

## Keypair

A keypair is a combination of a public key (i.e. public address) and private key (i.e. private/secret seed). There is a one-to-one correspondence between the private key and the public key created by means of a cryptographic algorithm. This correspondence is asymmetrical, that is, the public key can be easily derived from the private key, but the private key cannot be obtained from the public key. This property of a keypair is used for securing Kin transactions on the blockchain. The private key is supposed to be stored securely by the owner of the account (this is handled by the [client SDKs](/intro#client)), while the public key serves as the identifier of the account on the blockchain and thus can be freely exposed to anyone. Each transaction sent from an account to the blockchain is signed with a signature derived from the private key (without disclosing it). The blockchain then uses the public key held by the blockchain account to verify that the signature is valid, i.e. created by the owner of the corresponding private key.

## Kin

Kin is token on the Solana blockchain. 1 Kin = 100000 [Quarks](/terms-and-concepts#quark).

Kin is a token on the Solana blockchain. Solana is a consumer grade blockchain built for scale. It can currently handle 65,000 transactions per second, on par with Visa. Solana transaction times are roughly 400 milliseconds making it perfect for the consumer applications of  all sizes. Solana is also extremely decentralized and secure. Read more at [Solana](http://www.solana.com).

## Kin Rewards Engine

Each participating developer is compensated by the Kin Foundation for their contribution to the growth of the Kin ecosystem. When the rewards engine goes live it will transfer Kin directly from the foundation to the app account on the Kin Blockchain. For more information, please visit https://www.kin.org/kre/.

## Memo

The memo is a field that can be added to each blockchain transaction. It can be used for anything you’d like, the same way you can add a memo on a check from your bank. However, to make full use of Agora features, submitted transactions should include memos adhering to the [Kin Binary Memo Format](/how-it-works#kin-binary-memo-format). The format allows apps to associate additional information about the context of a transaction without being limited by the memo size. Additionally, the format allows transactions to get attributed to different apps in order to calculate rewards from the [Kin Rewards Engine](https://www.kin.org/kre/).

## Payment

A payment in Agora simply refers to a transfer of money from one account to another. Payments do not necessarily correspond 1:1 to transactions - a transaction can sometimes contain multiple payments.

## P2P

A P2P transaction is a payment from a user to another user.

## Public Key (Public Address)

A public key is the address (identifier) of an account on the blockchain, which holds the account’s balance and has access to the blockchain data. 

## Private Key (Private Seed)

A private key is used for authentication and encryption. It allows unlocking and accessing the Kin blockchain account it belongs to. As such, it should be stored securely by the user or their client device. To be processed by the blockchain, any transactions on a blockchain account have to be signed with its private key (without disclosing the private key itself).

## Production Environment

The environment that should be used by applications released to users. It interacts with the production blockchain, which is where all public transactions occur.

## Quark
The smallest currency denomination of the Kin blockchain. 1 Quark = 0.00001 [Kin](/terms-and-concepts#kin).

## Spend

A spend is a payment from a user to an app (e.g. to purchase something).

## Solana

The blockchain on which the Kin 4 token is stored and transacted.

## Test Environment

The environment that should be used by developers to test their integration of Kin/the SDKs. It interacts with a test version of the blockchain. Developers can create accounts and execute transactions freely using this environment.

## Token Account

An account that holds token balances. On Solana, a wallet can own multiple token accounts, which may have different addresses from the owner wallet. Kin 4 is a token on Solana, so Kin 4 balances are held in token accounts.

## Transaction

A transaction modifies the state of a blockchain ledger. A Kin transaction can contain multiple independent operations. Most transactions are used to create accounts or submit payments.

## Transaction Fee

These are the fees (in SOL) charged by Solana the blockchain for every transaction. The minimum required fee is dictated by the blockchain. Fees on the Solana are used to:

- provide unit compensation to the validator network for the CPU/GPU resources necessary to process the state transaction
- reduce network spam by introducing real cost to transactions
- open avenues for a transaction market to incentivize validation-client to collect and process submitted transactions in their function as leader
- and provide potential long-term economic stability of the network through a protocol-captured minimum fee amount per transaction, as described below.

Registered Kin apps currently have their fees subsidized by the Kin Foundation when approving transactions via the Sign Transaction webhook. At some point in the future the apps will be responsible for these fees but will be notified well in advance.

