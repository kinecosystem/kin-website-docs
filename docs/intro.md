---
id: intro
title: Getting Started
---

Welcome to the Kin Developer documentation. Here you'll find everything you need to allow your users to earn, spend, and manage Kin. If you are looking to launch an app with Kin, also read about the latest [Kin Developer Program](https://developers.kinecosystem.com), which offers incentives to integrate Kin. If you are already familiar with the program, you can [sign up now](http://bit.ly/2RQpmn3).

## What You Can Build with Kin

Kin helps you create amazing peer-to-peer experiences in your app. Kin is a digital currency, it's money, but it's built in a way that makes it really easy to send micro-transactions between users. Each Kin is worth about 1/1000 of a US Dollar, so you can think of Kin as a way for users to micro-gift each other in your app, kind of like a digital high-five.

What's more, by being built on Kin your app joins a [growing ecosystem](https://www.kin.org/stats/) of other apps that use Kin. That means that your users can earn Kin in one app and spend it in another. Kin doesn’t just live in one app. When you use Kin, your users get access to an entire ecosystem of apps that put them at the center.

## Apps Built on Kin

Looking for inspiration? Here are some of the apps already using Kin for in-app gifting and transactions.

* [MadLipz](https://itunes.apple.com/us/app/madlipz-instant-dub-and-sub/id1056224570?mt=8): An app for making voiceovers and parodies of songs and videos. Uses Kin to let users reward each other for especially funny dubs.
* [Swelly](https://itunes.apple.com/us/app/swelly-whats-your-opinion/id1082808642?mt=8): An app for sharing and collecting opinions between two choices. Uses Kin to let users thank each other for their good advice.
* [ThisThat](https://itunes.apple.com/gb/app/thisthat/id1439596187?mt=8): An app for engaging in fun debates and earning Kin for doing so.
* [PauseFor](https://itunes.apple.com/us/app/pause-for/id1293407815?mt=8): Rewards focused, productive work with donating Kin to charities.
* [Kinit](https://itunes.apple.com/us/app/kinit/id1401266070?mt=8): Take surveys and earn Kin.
* [Perfect365](https://itunes.apple.com/il/app/perfect365/id475976577?mt=8): Earn Kin for sharing beauty tips.

## Using Kin - What Your Users See

Kin is the most widely used cryptocurrency. More than 275,000 people hold and use Kin every month. That's because the experience of using Kin in an app is seamless and hides away all the complexities of other cryptocurrencies, such as wallets, signatures and transaction hashes. What the user sees is just their Kin balance and controls for sending Kin to other users. All of the rest is taken care of by the developer. The app stores their keys and manages and signs their transactions. While this means that the user has to trust the app developers with some custodian responsibilities, it does create a very easy first experience of using digital money.

## Using Kin - What You (the Developer) Sees

Kin is easy to install and use in your app. In pseudo code, it looks like this:

```
# initialize kin
import kin
client = KinClient()

# create an account for a user
account = client.kin_account()

# store that user account in your user database

# show the user their balance
balance = await client.get_account_balance(account.address)

# when the user wants to spend kin, invoke the send kin function
await account.send_kin('destination', 1000, fee=100, memo_text='order123')
```

You can also see real code examples for [Android](/android/sdk), [iOS](/ios/sdk), [Unity](/unity/sdk), [Python](/python/sdk), and [Node.js](/nodejs/sdk).

## Monetizing Your App with Kin

Kin can be a monetization strategy for your app. To monetize your app using Kin, you can collect transaction fees for user transactions using Kin. This is done manually. In your app, you will show the user your transaction fee. Then you will make two Kin transactions - one to the destination address, and one to your app's wallet address with the amount you collect as a fee.
