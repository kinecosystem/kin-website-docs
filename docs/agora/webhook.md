---
id: webhook
title: Agora Webhook Reference
---

## Authentication

### Agora Authentication

Apps making use of webhooks are required to [configure a webhook secret](/app-registration#configurable-options). Every webhook request from Agora includes a base64-encoded `X-Agora-HMAC-SHA-256` header, which contains a signature generated using the configured secret and the request body data. 

Apps are strongly recommended to verify the signature by computing the HMAC digest of the secret and request body using the SHA-256 algorithm, then comparing it to the signature (after decoding) included in the request. If they match, they can be confident that the request was sent from Agora. 

The [server SDKs](/intro#server) provide support for handling this signature verification. Developers can make use of the server SDKs or write their own verification logic.

### App User Authentication

Agora supports passthrough `X-App-User-ID` and `X-App-User-Passkey` headers for `SubmitTransaction` requests. These headers can be used by apps to pass app user identity information through Agora to their [Sign Transaction](/how-it-works#sign-transaction) webhook. 

To make use of these passthrough headers, they can simply be included in the headers of the `SubmitTransaction` gRPC request as `app-user-id` and `app-user-passkey` - requests must contain either both of the headers or neither of them. If only one is included, the request will be rejected by Agora. Upon receiving the headers, Agora then passes them through to the app in the headers of the Sign Transaction webhook request as `X-App-User-ID` and `X-App-User-Passkey`.

Both client SDKs include support for including these headers when submitting payments. For more details, please refer to the [client SDK](/intro#client) documentation.

## Swagger

A swagger specification of all available webhooks can be found [here](https://github.com/kinecosystem/agora-api/blob/master/swagger/webhooks.yaml).

## Events Webhook

The events webhook is used by Agora to deliver blockchain events related to an app to the app's backend server. When a transaction containing an app index in the memo on the blockchain occurs and the related app has their [Events URL configured](/app-registration#configurable-options), the URL will be called with a JSON array of events with this structure:

```jsx
[
  {
    "transaction_event": {
      "kin_version": 0,
      "tx_hash": "string",
      "invoice_list": "string",
      "stellar_data": {
        "result_xdr": "string",
        "envelope_xdr": "string"
      }
    }
  }
]
```

An event object acts as a container for a specific type of event. The type of an event can be determined by which fields are set inside the event object.

**Fields**

- `transaction_event`: ([Transaction Event](/agora/webhook#transaction-event) object) Present if the event is a transaction event.

### Webhook Response

When the app backend server returns a `200` status code, Agora considers the event delivered. Agora does not guarantee any retrying or delivery of an event to a webhook, even if the app backend server responds with a non-`200` response.

### Transaction Event

Currently, Agora only supports sending transaction events. Transaction events are sent when a transaction has completed (either successfully or unsuccessfully) on the blockchain. These events can be identified by the presence of a `transaction_event` field in a given event object. The `transaction_event` field is an object containing the fields outlined below.

**Fields**

- `kin_version`: (integer) The version of the Kin blockchain this transaction occurred on.
- `tx_hash`: (string) The base64-encoded transaction hash.
- `invoice_list`: (string, optional) The base64-encoded protobuf InvoiceList related to a transaction. Each invoice in the list corresponds to an operation in the transaction.
- `stellar_data`: ([Stellar Data](/agora/webhook#stellar-data) object, optional) Stellar-specific data related to a transaction. Will be included if the transaction occurred on a version of Kin based on Stellar.

## Sign Transaction Webhook

The sign transaction webhook is used by Agora to forward submitted transactions to the backend server of the app index in the transaction memo for the app to sign (for example, to remove fees by signing with the app's whitelisted account). Developers are responsible for ensuring their app properly verifies the transaction contents before signing it with their account's private key and can reject it if the transaction is not one they wish to sign. 

When Agora receives a [`SubmitTransaction`](/agora/api#submit-transaction) request with a transaction containing an app index in the memo and the related app has their Sign Transaction URL [configured](/app-registration#configurable-options), the URL will be called with a JSON payload with this structure:

```jsx
{
  "kin_version": 0,
  "envelope_xdr": "string",
  "invoice_list": "string"
}
```

**Fields**

- `kin_version`: (integer) The version of the Kin blockchain this transaction occurred on.
- `envelope_xdr`: (string) The base64-encoded transaction envelope XDR that is being requested for signature.
- `invoice_list`: (string, optional) The base64-encoded protobuf InvoiceList related to a transaction. Each invoice in the list corresponds to an operation in the transaction.

### Webhook Response

**`200 OK`**

Indicates that the app server has signed the requested transaction. Expected to include a JSON payload containing the requested `envelope_xdr`, signed by the app server's account, in the following structure:

```jsx
{
  "envelope_xdr": "string"
}
```

**Fields**

- `envelope_xdr`: (string) The base64-encoded transaction envelope XDR included in the original request, now signed by the app account.

**`403 Forbidden`**

Indicates that the app server refused to sign the transaction. Expected to include a JSON payload with the following structure:

```jsx
{
  "invoice_errors": [
    {
      "operation_index": 0,
      "reason": "already_paid"
    }
  ]
}
```

**Fields**

- `invoice_errors`: (array, optional) A list of invoice error objects indicating why the transaction was rejected. If included, these errors will be returned to the client that originally submitted the [`SubmitTransaction`](/agora/api#submit-transaction) request. Each invoice error object contains the following fields:
    - `operation_index`: (integer) the index of the transaction operation the error pertains to
    - `reason`: (string) the reason this operation was rejected. Can be one of the following values:
        - `already_paid`: the user has already paid for the submitted invoice
        - `wrong_destination`: the destination account was incorrect
        - `sku_not_found`: one or more SKUs in the invoice was not found

## Shared Objects

### Stellar Data

Stellar-specific data related to a transaction.

**Fields**

- `result_xdr`: (string) A base64-encoded transaction result XDR.
- `envelope_xdr`: (string) A base64-encoded transaction envelope XDR.
