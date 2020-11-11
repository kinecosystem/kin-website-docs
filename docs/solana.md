---
id: solana
title: Solana
---

Unlike prior versions of Kin, Kin 4 will be a token on the Solana blockchain. This section highlights some of the concepts that might be unfamiliar to existing Kin developers and some of the differences between the Solana (Kin 4) and Stellar (Kin 2 & Kin 3) versions of Kin.

## Subsidization

On Kin 3, transactions signed with by a “whitelisted” account would not have any fees incurred. This was a custom change to the Stellar validators run by the Kin foundation. On Kin 4 (and Kin 2), fees are required to be paid for every transaction.

To help solve the problem of bootstrapping new accounts, as well as ease the transition from Kin 3, Agora provides a mechanism whereby the service can be configured to fund transactions by being a signer (called a subsidizer). Since the subsidizer account must be present inside the transaction payload, clients must be aware of the account subsidizing their transactions. This is available via the `GetServiceConfig` RPC. SDKs pull this information automatically.

Agora may wish to rate limit the subsidization of transactions, notably in the case of bad actors. In this case, the service will refuse to subsidize a specific transaction. The submitter may then choose to subsidize the transaction themselves, or back off to respect the rate limit.

In addition to subsidizing transaction fees, the subsidizer also provides [rent](https://docs.solana.com/implemented-proposals/rent) for each account, in order to prevent them from being garbage collected. In order to avoid malicious actors attempting to farm Sol from these accounts, Agora requires that the Close Authority of accounts being subsidized to be the subsidizer account. When an account is closed, the Sol left in the account is returned to the Close Authority. It also permits the Close Authority to close the account, only if the token balance is zero.

Since signing by a “whitelisted” account is no longer necessary for fee subsidization, apps using the [sign transaction webhook](/how-it-works#sign-transaction) should not sign Kin 4 transactions sent to their webhook (calling `SignTransactionResponse.sign` in the server SDKs for a Kin 4 transaction is currently a no-op). Although signing by the app’s wallet is no longer a required step for fee subsidization, the webhook can still be used by an app to approve or reject a transaction submitted using their app index. As before, if the webhook responds with a 403, Agora will respond to the client that submitted the transaction with a `REJECTED` response (or `INVOICE_ERROR` if invoice errors are present). If the webhook responds with a 200, Agora will sign and submit the transaction. 

## Token Accounts

With Kin 4 and the [migration to Solana](/solana#migration), the concept of a token account is introduced. On Solana, a token account is an account that holds token balances. A given wallet can own multiple token accounts, which each may have a different address from the wallet/owner. Kin, being a token on Solana, is held and transacted using token accounts. 

Previously, on Kin 2/3, a transaction containing a Kin payment operation from a wallet would use the wallet’s address as the source of the payment and require a signature from the wallet’s private key. However, on Kin 4, a transaction containing a Kin transfer instruction from a wallet requires one of its owned token accounts holding Kin to be the source of a transfer. A signature is still required from the owner/wallet’s private key.

The [Solana Explorer](https://explorer.solana.com/) can be used to view a wallet (by searching for its address) and its token accounts. [Here](https://explorer.solana.com/address/B4XkfPBCwChCHoVg45FXvX4ko3GfxBCpJFDWpxyK3uZ7?cluster=devnet) is an example of a token account on the Solana Explorer, where the token’s address, [mint](https://spl.solana.com/token#creating-a-new-token-type) of the token and the owner of the token account are all displayed.

In Agora, the `ResolveTokenAccounts` v4 Agora API can be used to fetch all the token accounts for a given wallet.

For more details about tokens on Solana, see [https://spl.solana.com/token](https://spl.solana.com/token). 

## Commitment

On Stellar (Kin 2/3), receiving an OK response when submitting a transaction indicates that the transaction was successfully committed. On Solana, this is not necessarily the case due to [fork generation](https://docs.solana.com/cluster/fork-generation). Solana RPCs allow the specification of commitment, which dictates which [bank state](https://docs.solana.com/terminology#bank-state) to use while processing the request. 

For read requests, lower commitments return a more up-to-date state (as seen by the RPC node). However, there is a higher chance that the state may become rolled back.

For write requests (i.e. submitting transactions), the commitment parameter dictates how long the RPC should block before returning. Higher commitments take longer (up to 30 seconds), but have lower probabilities of being rolled back (if a success was returned). To ensure that transactions are processed successfully, the GetTransaction RPC can be used. Additionally, all items returned in GetHistory are final (both successful and failed transactions).

Commitment Levels (in ascending order of commitment)
- **Recent**: query its most recent block. The block may not be complete.
- **Single**: query the most recent block that has been voted on by supermajority of the cluster.
- **Root**: query the most recent block that has reached maximum lockout on the RPC node, meaning the node has recognized this block as finalized.
- **Max**: query the most recent block confirmed by supermajority of the cluster as having reached maximum lockout, meaning the cluster has recognized this block as finalized

In most cases, `recent` or `single` is sufficient. Both will return relatively quickly (a few seconds or less), and in most cases will succeed. Mobile SDKs are configured to listen and check the status of the transaction until it has reached a finalized block. Server applications may use the events webhook in combination with the `GetTransaction` API to emulate this behaviour.

If you are chaining dependent transactions (e.g. a create account followed by a send to said account), using `single` or higher is generally required. This is because it is possible for the `transfer` instruction to get processed by another RPC node before the block that the `create` instruction was in gets propagated. This would result in an “account not found” type of error.

In cases where you want the RPC to block until the state has been finalized, using `root` or `max` is sufficient. However, the delay will be on the order of magnitude of 30 seconds or more. This is generally recommended for users like exchanges. However, since long-lived RPCs are more likely to fail (timeouts, terminated connections, etc), it is recommended that callers check the transaction status to be sure.

## Key Encoding

Keys and AccountIds used on Kin 3 have followed a Base32 encoding in the format of:

**Public Keys** - e.g. GBE2BNHYB4...
`Base32(version byte + 32 byte ed25519 PublicKey + 2 byte checksum(ed25519 PublicKey)`

**Key Seeds** - e.g. SDJCSVU2GF...
`Base32(version byte + 32 byte ed25519 Seed + 2 byte checksum(ed25519 Seed))`

With the release of Kin 4 support, these encodings are still available for use in the public interface of the SDKs. However, in many other Solana tools, including the Solana block explorer and the Solana jsonRPC API, a base58 encoding of the public key is typically used. It’s important to recognize that despite the difference in encoding, the keys are the same. Base58 is used in other projects, including Bitcoin, to represent their keys and there are many open source libraries and tools available for performing this encoding. Conversion functions for both Stellar base32 encoding and base58 encoding of keys are included in all of the Kin SDKs (see each [respective SDK's docs](/intro#available-sdks) for specific details).

**NOTE: It is never advisable to input your private key into a web tool to convert it to a different encoding in case the website owner logs or maliciously copies it. You have been warned. Public Keys are safer to use in online tools to convert encodings since there is no risk of losing funds from your account if someone has it.**

## Recent Blockhash

When a transaction is submitted on Stellar (Kin 2 and Kin 3), it contains a unique sequence number per transaction per account that must be different between each transaction. On the Stellar blockchain, this ensures that each transaction hash (and therefore signature) is different even if it’s between the same accounts and for the same amount. On Kin 4, transaction idempotency is ensured differently: the equivalent piece of differentiating data, generally and functionally known as a nonce, is a recent blockhash, which needs to be ‘recent enough’ (i.e. within the last two minutes), but does not necessarily need to be different between transactions. 

Developers should note, this means that on Kin 4 it is not possible to submit multiple transactions with the same data if they also have the same recent blockhash. Transactions with the same data and same blockhash will return with a status of `ALREADY_SUBMITTED`, indicating that the transaction was already submitted.  While it is unlikely to occur, a possible solution to avoid running into `ALREADY_SUBMITTED` is to coalesce identical transactions together. For example, instead of sending a user 10 kin multiple times within a few minutes of each other, send them a larger amount in a single transaction.

**Note**: on Stellar, [channels](/how-it-works#channels) were used as a method of increasing the rate of transactions being sent from a particular account. Since Solana uses recent blockhash, which is not account-specific, channels will no longer be relevant for Kin 4.

## Migration
To date, there have been two ways to query/submit transactions or account data to/from the Kin 2 and Kin 3 blockchains.
1. Query/submit via Horizon REST API
2. Query/submit via the v3 gRPC APIs to Agora (what the modern Kin SDKs use today)

On migration day, Kin hosted Horizon servers will start returning 410’s, and the Agora v3 APIs will start returning the gRPC error `PRECONDITION_FAILED`, which will both indicate to the respective client libraries that an API upgrade is required to continue to query or submit data.

Kin 4 will require the use of the v4 gRPC APIs to query or submit via Agora.

All of the client SDKs are capable of interacting with Agora over both the v3 and v4 apis and, upon receiving the cue of the aforementioned error states on migration day, will take the following steps:
1. Query the getMinimumBlockchainVersion RPC (link)
2. Transition all inflight requests to retry on the returned API version (v4 in our current migration’s case) 

This means that once the migration has been triggered, all account query, transaction submission and history requests submitted to v3 Agora APIs will be rebuilt and resubmitted to the v4 APIs.

The migration will be run in two distinct processes
1. Offline Migration: iterate over all Kin 2 and Kin 3 accounts and migrate them to Kin 4
2. On-Demand Migration: when required, prioritize certain accounts for migration to Kin 4 immediately.

When a client upgrades to the v4 APIs for the first time and submits a request to SubmitTransaction, GetAccount, or GetHistory an on-demand migration will be triggered for the account and any associated accounts (in the case of destination accounts specified in a submitTransaction call) unless they were already migrated. Retry mechanisms in the client should be sufficient to then complete the request after the migration for the specified accounts completes. This will result in longer than normal response times until the migration is fully completed, which is expected to take a couple days. It is also possible, and should be expected, that on the day of migration this on-demand migration + retry process may result in additional transient failures, because account migration is not guaranteed to always happen fast enough to be completed within the retry window.

One of the features of Agora is that it is a history collector that straddles both the Kin 3 and Kin 4 blockchains. This allows it to serve transaction history from both chains for a given migrated account.
