---
id: sdk
title: Kin SDK for iOS
---

With the Kin SDK for iOS you can give your users fun ways to earn and spend Kin in your app, and help us build a whole new digital world.

Kin SDK for iOS is implemented as a library that can be incorporated into your code. If you’re just getting started with Kin ecosystem, we suggest you spend a few minutes reading this [overview of the Kin architecture](/kin-architecture-overview).

## Installation

### CocoaPods

Add the following to your `Podfile`:

```ruby
pod 'KinSDK'
```

See the latest releases at [github.com/kinecosystem/kin-sdk-ios/releases](https://github.com/kinecosystem/kin-sdk-ios/releases).

The main repository is at [github.com/kinecosystem/kin-sdk-ios](https://github.com/kinecosystem/kin-sdk-ios).

### Sub-Project

1. Clone this repo (as a submodule or in a different directory, it's up to you):
```bash
git clone --recursive https://github.com/kinecosystem/kin-sdk-ios
```
2. Drag `KinSDK.xcodeproj` into your xcode project as a subproject.
3. In your main `.xcodeproj` file, select the desired target(s).
4. Go to **Build Phases**, expand Target Dependencies, and add `KinSDK`.
5. In Swift, `import KinSDK` and you are good to go! (We haven't yet tested Objective-C.)

## Using the Kin SDK

Integrating the Kin SDK into your app enables your iOS client to perform the following actions:

- Accessing the Kin Blockchain
- Managing Kin accounts
- Executing transactions against Kin accounts



### Accessing the Kin Blockchain
The two main classes of the Kin SDK for iOS used for accessing the Kin blockchain are `KinClient` and `KinAccount`.

#### Creating kinClient Object

iOS apps that allow users to earn, spend, and manage Kin are considered clients in the Kin architecture. The following statement creates a `KinClient` object, which includes methods to manage accounts on the Kin Blockchain.

A `KinClient` object is initialized for a specific Kin environment and network and it manages `KinAccount` objects for that environment.

```swift
KinClient(with: URL, network: Network, appId: AppId)
```

- `with` - the URL of the Horizon server providing access to the Kin Blockchain
- `network` - you declare which Kin Blockchain network you want to work with using the predefined enum value `Network.mainNet` or `Network.playground`.
- `appId` - a 4-character string assigned to you by Kin and used to identify your application. It contains only digits and upper and/or lowercase letters.

For instance, to initialize a Kin Client to use the Playground network, do the following:
```swift
let url = "http://horizon-testnet.kininfrastructure.com"
guard let providerUrl = URL(string: url) else {
    return nil
}
do {
    let appId = try AppId("test")
    let kinClient = KinClient(with: providerUrl, network: .testNet, appId: appId)
}
catch let error {
    print("Error \(error)")
}
```
#### Creating kinAccount Object

Once the `KinClient` object is initialized, you need at least one `KinAccount` object to use the features from the Kin ecosystem.
Every account created with `KinClient` contains a unique identifier - a public/private keypair. The private key remains securely stored in the local account while the public key will become the address of the Kin account added to the Kin blockchain (see Creating an Account on the Kin Blockchain below).

To create an account:

```swift
do {
    let account = try kinClient.addAccount()
}
catch let error {
    print("Error creating an account \(error)")
}
```
#### Creating an Account on the Kin Blockchain 

When you create an account using `kinClient.addAccount`, you have created and securely stored a keypair locally but have not yet created an account on the Kin Blockchain.

The following snippet creates the account on the testnet.

```swift
/**
Create the given stored account on the testnet.
*/
func createPlaygroundAccountOnBlockchain(account: KinAccount, completionHandler: @escaping (([String: Any]?) -> ())) {
    // Playground blockchain URL for account creation
    let createUrlString = "http://friendbot-testnet.kininfrastructure.com?addr=\(account.publicAddress)"

    guard let createUrl = URL(string: createUrlString) else {
        return
    }
    let request = URLRequest(url: createUrl)
    let task = URLSession.shared.dataTask(with: request) { (data: Data?, response: URLResponse?, error: Error?) in
        if let error = error {
            print("Account creation on playground blockchain failed with error: \(error)")
            completionHandler(nil)
            return
        }
        guard let data = data,
              let json = try? JSONSerialization.jsonObject(with: data, options: []),
              let result = json as? [String: Any] else {
            print("Account creation on playground blockchain failed with no parsable JSON")
            completionHandler(nil)
            return
        }
        // check if there's a bad status
        guard result["status"] == nil else {
            print("Error status \(result)")
            completionHandler(nil)
            return
        }
        print("Account creation on playground blockchain was successful with response data: \(result)")
        completionHandler(result)
    }

    task.resume()
}
```
### Managing Accounts
#### KinAccount

With a `KinClient` object, it is possible to add a new account, delete or import an account and access a list of accounts using a `KinAccount` object.

```swift
var accounts: KinAccounts

func addAccount() throws -> KinAccount

func deleteAccount(at index: Int) throws

func importAccount(_ jsonString: String, passphrase: String) throws -> KinAccount

```

#### Accessing Existing Accounts

The list of Kin accounts of a KinClient is available via its attribute `accounts`.

```swift
var accounts: KinAccounts
```

To get the first account: `let account = kinClient.accounts.first`

or `let account = kinClient.accounts[0]`

To print the public address of each stored account:

```swift
kinClient.accounts.forEach { account in
    print("--> \(account?.publicAddress)")
}
```



#### Deleting an Account

Deleting an account means removing the account data stored locally.

**Warning:** If the account has not been backed up previously by exporting it, the locally-stored keypair will be lost and the Kin stored in the account will be inaccessible.

Deleting the first account:
```swift
do {
    try kinClient.deleteAccount(at: 0)
}
catch let error {
    print("Could not delete account \(error)")
}
```

#### Importing/Exporting Accounts

The Kin SDK allows you to import and export accounts. This can be used, for instance, for backing up and/or restoring an account.

#### Export

TBD

#### Import

The following snippet adds to the list of accounts managed by `KinClient`. The passphrase `a-secret-passphrase-here` must be identical to the one used when exporting the account(s).

```swift
let json = "{\"pkey\":\"GBKN6ATMTFQOKDIJOUUP6G7A7GFAQ6XHJBV3HJ5QAQH3NCUQNXISH3AR\"," +
        "\"seed\":\"61381366f4af2c57c55e2c23411e26d5a85eae18a9e1c91e01fa7e9967f3d2b9e0f8a412c9147d7abe1529adcaef21a84ebc266da0a86b0f6a9adf2b3007652811ceaa4156834620\",\"salt\":\"a663ec77c54bb2c9efdffabb5685cda9\"}"
do {
    try kinClient.importAccount(json, passphrase: "a-secret-passphrase-here")
}
catch let error {
    print("Error importing the account \(error)")
}
```




#### Retrieving Kin Account Identification (Public Address)

A Kin account is identified via the public-address half of its keypair. Retrieve this string with `publicAddress`.

```swift
var publicAddress: String = account.publicAddress
```

#### Intitial Funding of a Kin Account

Before an account can be used on the blockchain, it must be funded with some Kin. When working in the playground environment, funding occurs via the Friendbot service. In the production environment, initial funding of user accounts is typically provided by developers like you from funds provided by Kin Foundation. For more information, see [Friendbot](/kin-architecture-overview#friendbot)

#### Checking Account Status

The current account status on the blockchain is queried with `status`.

```swift
func status(completion: @escaping (AccountStatus?, Error?) -> Void)
```
An account’s status is either `.created` or `.notCreated`. If an account only exists locally after a call to `kinClient.addAccount()`, its status will still be `.notCreated`.

#### Retrieving Kin Balance

To retrieve the account's current balance in Kin:

```swift
func balance(completion: @escaping BalanceCompletion)
```

- `completion` - callback method called with `Kin`, `Error`

### Transactions


#### Transaction Fees

By default, every transaction on the Kin Blockchain is charged a fee to be processed. This discourages blockchain spam and denial-of-service attacks.  Fees for individual transactions are trivial.
Some apps can be added to the Kin whitelist, a set of pre-approved apps whose users will not be charged fees to execute transactions. If your app is in the whitelist, refer [Send Whitelisted Transaction](#send-kin-with-a-whitelist-transaction-fee-waived) for an example..

Whitelisting a transaction is a function provided by the Kin SDK for Python and should be implemented by developers as a back-end service. Developers are responsible of creating and maintaining their back-end services. 


#### Transferring Kin to Another Account (No Whitelisting)

To transfer Kin to another account, you need the public address of the account to which you want to transfer Kin.

These transactions are executed on the Kin Blockchain in a two-step process:

1. **Build** the transaction, which includes the calculation of the transaction hash. The transaction hash is used as an ID and is necessary to query the status of the transaction.
2. **Send** the transaction for execution on the blockchain.
Below are the steps for transferring a specified amount of Kin to a recipient account.

##### Build the Transaction

```swift
func generateTransaction(to recipient: String,
                             kin: Kin,
                             memo: String?,
                             fee: Stroop,
                             completion: @escaping GenerateTransactionCompletion)
```

- `recipient` - the recipient's public address.
- `kin` - the amount of Kin to be sent.
- `memo` - a UTF-8 string with 21 bytes dedicated to developer use. Developers are free to enter any information that is useful to them, for instance, to specify an order number. The `appId` is automatically added to the memo field.
- `fee` - the fee in `Stroop` used if the transaction is not whitelisted. (1 KIN = 10E5 Stroop.)
- `completion` - the callback method called with the `TransactionEnvelope` and `Error`.

##### Send the Transaction

```swift
func sendTransaction(_ transactionEnvelope: TransactionEnvelope,
                       completion: @escaping SendTransactionCompletion)
```

- `transactionEnvelope` -the `TransactionEnvelope` object to send.
- `completion` - the completion callback method with the `TransactionId` or `Error`.

#### Transferring Kin to Another Account Using Whitelist Service
The following paragraphs describe the process of whitelisting a transaction. If you want to skip the explanation and jump straight to a code example, see [Send Kin with a whitelist transaction](/ios/hi-kin#send-kin-with-a-whitelist-transaction) code included in the [Hello World for iOS](/ios/hi-kin) tutorial.

Executing whitelisted transactions adds two steps to the process:

1. **Build** the transaction, which includes the calculation of the transaction hash. The transaction hash is used as an ID and is necessary to query the status of the transaction.
2. Create a `WhitelistEnvelope`
3. **Send** the `WhitelistEnvelope` to a whitelist service, which will sign and return a new `TransactionEnvelope`.
4. **Send** the transaction for execution on the blockchain.


Here's how you create a `WhitelistEnvelope` from a `TransactionEnvelope` and Network ID:

```swift
init(transactionEnvelope: TransactionEnvelope, networkId: Network.Id)
```

Then you send the `WhitelistEnvelope` to a server for signing. The server response should be a  `TransactionEnvelope` with a second signature, which can then be sent to a Horizon server for execution on the blockchain.  


**Note:** In a production environment, the server to which you send the `WhitelistEnvelope` for signing is your back-end server running the Kin SDK for Python. See [Transferring Kin to another account using whitelist service](/python/sdk#transferring-kin-to-another-account-using-whitelist-service) for more information.

```swift
func sendTransaction(_ transactionEnvelope: TransactionEnvelope,
                       completion: @escaping SendTransactionCompletion)
```

## Details

### Asynchronous Programming Styles

Several asynchronous methods of `KinClient` and `KinAccount` come in two styles:

- **Callback parameter** - a completion handler is passed as a parameter to the method.
- **Promise** - a `Promise` object is returned by the method. The `Promise` class comes with the Kin Util library, which is included in the SDK. Promises are a way to simplify asynchronous programming and make asynchronous method calls composable.

Obtain `KinAccount` status using the completion parameter:
```swift
func status(completion: @escaping (AccountStatus?, Error?) -> Void)
```

Obtain `KinAccount` status using promises:

```swift
func status() -> Promise<AccountStatus>
```

A more complete example:

```swift
account.status()
    .then { (status: AccountStatus) in
        print("Account's status is: \(status)")
    }
    .error { (error: Error) in
        print("Error getting the account's status: \(error)")
    }
```

### `KinAccount` Watcher Objects

To be notified of changes on a `KinAccount`, you can also use watcher objects. The watcher object will emit an event whenever a change occurs.

Watcher objects are available for:

- Account creation
```swift
func watchCreation() throws -> Promise<Void>
```
- Balance changes
```swift
func watchBalance(_ balance: Kin?) throws -> BalanceWatch
```
- Payments
```swift
func watchPayments(cursor: String?) throws -> PaymentWatch
```

### Error Handling

Kin SDK for iOS wraps errors in extensions of methods of `KinAccount`, for example `StellarError.missingAccount`.

The underlying error is the actual cause of failure.

#### Common Errors

`StellarError.missingAccount`: The account does not exist on the Kin Blockchain.
You must create the account by issuing an operation with `KinAccount.publicAddress` as the destination.
This is done using an app-specific service and is outside the scope of this SDK.

### Testing
TBD
## License

This repository is licensed under the [Kin Ecosystem SDK License](https://github.com/kinecosystem/kin-sdk-ios/blob/master/LICENSE.md).
