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
