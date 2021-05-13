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
