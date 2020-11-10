---
id: api
title: Agora API Reference
---

Agora uses [gRPC and protocol buffers](https://grpc.io/docs/what-is-grpc/introduction/). To make requests to Agora, developers (particularly those unfamiliar with gRPC and protobuf) can make use of one of the [SDKs that include Agora integration](/intro#available-sdks). Alternatively, developers can also opt to use the protobuf models and generated code in [kinecosystem/agora-api](http://github.com/kinecosystem/agora-api) to make requests to Agora without using the SDKs. 

**All of the up-to-date source protobuf models, including all service specifications and field validations used by Agora, can be found [here](https://github.com/kinecosystem/agora-api/tree/master/proto).** The following is only a brief overview of some of the available APIs and what they're used for.

## Account

The `Account` service contains methods for creating and getting information related to Kin accounts. The account service protobuf definition can be found here: [v3](https://github.com/kinecosystem/agora-api/blob/master/proto/account/v3/account_service.proto), [v4](https://github.com/kinecosystem/agora-api/blob/master/proto/account/v4/account_service.proto).

### Create Account

The `CreateAccount` RPC creates a new Kin account with the specified account ID. 

The response includes a result that is either `OK` or `EXISTS`, depending on if the account was created successfully or if it already exists. In both cases the account's information will also be returned.

### Get Account Info

The `GetAccountInfo` RPC returns the account information of the specified account. 

The response includes a result that is either `OK` or `NOT_FOUND`, depending on if the account was found. Account info only if the result was `OK`.

### Get Events

The `GetEvents` RPC returns a stream of events related to the specified account. This includes both events related to the account itself (e.g. sequence number or balance), as well as events related to transactions affecting the account. 

Stream responses include a result that is either `OK` or `NOT_FOUND`, depending on if the account was found. The stream will be terminated by Agora if the result is `NOT_FOUND`.

### Resolve Token Accounts

The `ResolveTokenAccounts` returns the [token accounts](/solana#token-accounts) associated with the requested account.

## Transaction

The `Transaction` service contains methods for submitting and fetching transactions. The transaction service protobuf definition can be found here: [v3](https://github.com/kinecosystem/agora-api/blob/master/proto/transaction/v3/transaction_service.proto), [v4](https://github.com/kinecosystem/agora-api/blob/master/proto/transaction/v4/transaction_service.proto).

### Submit Transaction

The `SubmitTransaction` RPC submits a transaction. If the transaction contains a memo adhering to the [Kin binary memo format](/how-it-works#kin-binary-memo-format), Agora will handle storing any included invoices and forwarding the transaction to the app server's [Sign Transaction webhook](/how-it-works#sign-transaction), the app is configured to use those features.

The response includes a result that can be one of the following values:

- `OK`: The transaction was submitted successfully
- `FAILED`: There was an issue with submitting the transaction to the blockchain. Clients should retry with a rebuilt transaction in case there is temporal issues with the transaction, such as sequence number or some other chain-specific errors. The detail of the error is present in the result XDR.
- `REJECTED`: Indicates that the configured webhook for this transaction rejected the transaction without a specified reason. This is only a possible result if the transaction has a memo adhering to the [Kin binary memo format](/how-it-works#kin-binary-memo-format) and the app corresponding to the memo app index has their [Sign Transaction webhook](/how-it-works#sign-transaction) configured.
- `INVOICE_ERROR`: Indicates that there was an error with one or more of the supplied invoices. The details of this error are present in the list of `invoice_errors` in the response. This is only a possible result if the transaction has a memo adhering to the [Kin binary memo format](/how-it-works#kin-binary-memo-format) and the app corresponding to the memo app index has their [Sign Transaction webhook](/how-it-works#sign-transaction) configured.

### Get Transaction

The `GetTransaction` RPC returns the blockchain data of a transaction, as well as any off-chain invoice data stored in Agora. 

The response does not contain a result, only a state. The state can be one of the following options:

- `UNKNOWN`: Indicates that the system is not yet aware of the transaction. This can occur if the transaction is still pending, or has been dropped.
- `FAILED`: Indicates that the transaction failed. The failure reason can be found inside the included `HistoryItem`'s result XDR.
- `SUCCESS`: Indicates that the transaction succeeded.

### Get Service Config (v4 only)

The `GetServiceConfig` RPC returns the service and token parameters for the token.

### Get Minimum Kin Version (v4 only)

The `GetMinimumKinVersion` RPC returns the minimum Kin version that is supported by the service. An increase in the value returned by this RPC indicates a global migration has occurred.

For more information on the migration to Kin 4, see [here](/solana#migration).

### Get Recent Blockhash (v4 only)

The `GetRecentBlockhash` RPC returns a recent block hash from the underlying network, which should be used when crafting transactions.

### Get Minimum Balance For Rent Exemption (v4 only)

The `GetMinimumBalanceForRentExemption` RPC returns the minimum amount of lamports that must be present in an account for it not to be garbage collected.

### Get History

The `GetHistory` RPC returns the transaction history for an account, including any off-chain invoice data stored in Agora related to those transactions. Callers can use the `cursor` field to retrieve history starting from a specific point.

The response includes a result that can be one of the following values:

- `OK`: The request was successfully completed.
- `NOT_FOUND`: No account could be found for the requested account ID.

## Airdrop (v4 only)

The `Airdrop` service contains RPCs for sending Kin to accounts for free. It is only available on development networks. The airdrop service protobuf definition can be found here: [v4](https://github.com/kinecosystem/agora-api/blob/master/proto/transaction/v4/transaction_service.proto).

### Request Airdrop

The `RequestAirdrop` RPC requests an air drop of Kin to the target account. 

The response includes a result that can be one of the following values:
- `OK`: The airdrop transaction was submitted.
- `NOT_FOUND`: The target account does not exist.
- `INSUFFICIENT_KIN`: The airdrop service does not have enough Kin for the request.
