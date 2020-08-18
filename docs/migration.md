---
id: migration
title: Migration to New SDKs
---

This section of the documentation is for developers of previously approved Kin apps and outlines some key changes from previously offered SDKs. 

## Memo Format and App Index

Previously, approved apps were given app IDs to include inside their transactions using a text memo, which has a max length of 28 bytes. The memo format used was `1-{app_id}-{other_data}`, where `app_id` consisted of 3-4 UTF-8 characters (limited to digits and upper/lowercase letters. This format took up 6-7 bytes in total, leaving developers with only 21-22 bytes for additional data.

To address the limitation of how much "extra data" can be attached to a transaction, Agora uses a new [memo format](/how-it-works#kin-binary-memo-format). Instead of text memos, hash memos are used, which have a slightly larger max size of 32 bytes. The new format contains the following fields:

- Version: the memo encoding version (primarily used by the SDKs for interpreting memos).
- Transaction Type: the 'type' of the transaction the memo is embedded in.
- App Index: a 16-bit value that refers to the app the transaction is related to. Replaces app IDs.
- Foreign Key: the identifier in an auxiliary transaction service that contains metadata about what a transaction is for.

Similar to the app IDs of the past, the **app index** field, in conjunction with **transaction type** field, will be used for KRE reward calculations. However, it is also used by Agora to route [webhooks](/how-it-works#webhooks) requests based on app. Instead of the UTF-8 app ID, registered apps will be issued a numeric app index that they can include in their transaction memos. 

**Note: To assist with migration, previously approved apps will have app indices pre-generated for them. Additionally, Agora will support routing transactions of previously-approved apps containing the old memo format to any configured [webhooks](/how-it-works#webhooks).**

The new **foreign key** field primarily serves as a way for apps to include a reference to some other data stored off-chain, to help address memo space limitations. This field has a max limit of 230 bits. One option available to developers for storing off-chain data is [invoices](/how-it-works#invoices), which can help developers provide their users with richer transaction data and history. However, developers are free to use the foreign key to reference data hosted by their own services.

## Signing Transactions with Whitelisted Accounts

Approved/registered apps typically have their app account "whitelisted", which makes their account's transactions and any transactions signed by their operation account feeless. The previous process for submitting a transaction without a fee required app mobile clients to oversee the process from start to finish, making requests to both their app backend server and Horizon to ensure a given transaction went through:

1. The client builds a transaction.
2. The client signs the transaction with its account's private key and sends the transaction to the backend server.
3. The app account signs the transaction to make it feeless.
4. The app backend server returns the transaction to the client account.
5. The client sends the transaction to the blockchain.
6. The blockchain verifies the transaction against the corresponding blockchain account and processes it.
7. The specified amount of Kin is deducted from the sending account’s balance and added to the destination account’s balance.
8. A transaction ID is returned to the client.

Typically, to action on a completed transaction, either the backend server would handle monitoring the transaction after signing it, or the client would make another request the app backend server containing the transaction ID after it completes.

However, mobile clients can be unreliable for ensuring the whole transaction process completes (due to unstable internet connection, users closing the app, etc.). Agora introduces a new [Sign Transaction webhook](/how-it-works#sign-transaction) that apps can configure, so that mobile clients are no longer relied upon for submitting the transaction. With this webhook, the process for sending a feeless transaction is as follows:

1. The client builds a transaction.
2. The client signs the transaction with its private key and sends it to Agora. The transaction contains the app's [registered app index](/app-registration) in the memo.
3. Agora uses the app index to identify which app the transaction is from and makes a request to the app's [configured Sign Transaction URL](/app-registration#configurable-options) with the submitted transaction in the request body.
4. The app backend server verifies the contents of the transaction (e.g. that the sender, destination and amounts are valid) before either signing the transaction with their app account and responding with the signed transaction, or responding with a rejection.
5. Agora submits the transaction to the blockchain and responds or responds to the SubmitTransaction request with the provided rejection.

This, in conjunction with backend server transaction monitoring, allows the transaction process to happen almost entirely on the backend between Agora and the app backend server. Developers can refer to the [Webhook Reference](/agora/webhook) for implementation details.

## Transaction Monitoring

In the past, developers were not provided with a way for their backend servers to get notified of transactions completing. Developers often had to resort to two different ways of monitoring their users' transactions. Typically, this would involve pre-computing transaction hashes, then either:

- periodically fetching the transaction from Horizon to see its status, or
- streaming all completed transactions from Horizon and waiting for a transaction with a specific hash to complete.

To address this, Agora introduces a new [Events webhook](/how-it-works#events) that apps can configure. With this webhook, apps no longer need to monitor completed transactions themselves. Instead, Agora handles monitoring the blockchain for all completed transactions, then uses the app index inside the transaction memo to make a request to the app's [configured Events URL](/app-registration#configurable-options) with hashes of completed transactions (in Kin 3, the full transaction envelope XDR is also included).
