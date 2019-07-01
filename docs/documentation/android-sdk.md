---
id: android-sdk
title: Kin SDK for Android
---
With the Kin SDK for Android, you can give your users fun ways to earn and spend Kin in your app, and help us build a whole new digital world.

Kin SDK for Android is implemented as an Android library that can be incorporated into your code. If you’re just getting started with Kin ecosystem, we suggest you spend a few minutes reading this [overview of the Kin architecture.](../kin-architecture-overview.md)

## Installation

Kin SDK for Android is implemented as an Android library. To include the library in your project, add these two statements to your `build.gradle` files.

###### Snippet: Modify project build file
**For release 1.0.4 and higher, use this:**

```gradle
...
dependencies {
    ...

    implementation 'com.github.kinecosystem.kin-sdk-android:kin-sdk-lib:<latest release>'
}
```

**For releases before 1.0.4, use this:**

```gradle
...
dependencies {
    ...

    implementation 'com.github.kinecosystem:kin-sdk-android:<only before release 1.0.4>'
}
```

For the latest release version, go to [https://github.com/kinecosystem/kin-sdk-android/releases](https://github.com/kinecosystem/kin-sdk-android/releases).

The main repository is at [github.com/kinecosystem/kin-sdk-android](https://github.com/kinecosystem/kin-sdk-android).


## Overview

Adding Kin features to your Android client requires these three steps:

1. Accessing the Kin blockchain
2. Managing Kin accounts
3. Executing transactions against Kin accounts   

### Accessing the Kin Blockchain

Android apps that allow users to earn, spend, and manage Kin are considered clients in the Kin architecture. The following statement creates `kinClient`, which includes methods to manage accounts on the Kin blockchain.


```java
kinClient = new KinClient(context, Environment.TEST, "1acd")
```

You declare *which* Kin blockchain environment you want to work with using the predefined static variable `Environment.TEST` or  `Environment.PRODUCTION`.

Each environment variable includes:

- `networkURL` - the Kin blockchain node URL
- `networkPassphrase` - a network ID used to distinguish between different blockchain networks; this is hashed into every transaction ID

`1acd` in the example is an `appId`, a 4-character string that will be added automatically to each transaction to identify your application. `appId` must contain only digits and upper and/or lowercase letters. String length must be exactly 4. `appID` is automatically added to transaction memos.

### Managing Accounts

#### Creating and Retrieving a Kin Account

The first time you use `KinClient`, you need to create a new Kin wallet and an associated Kin account. The Kin wallet is stored on the user's client device and holds a public/private keypair. The private key remains securely stored in the local wallet while the public key will become the address of the Kin account added to the Kin blockchain.

Code snippet [Create Kin account](#snippet-create-kin-account) creates a new Kin account if one is not present, while [Retrieve Kin account](#snippet-retrieve-kin-account) retrieves an existing account.

###### Snippet: Create Kin account

```java
KinAccount account;
try {
    if (!kinClient.hasAccount()) {
        account = kinClient.addAccount();
    }
} catch (CreateAccountException e) {
    e.printStackTrace();
}
```

###### Snippet: Retrieve Kin account

```java
if (kinClient.hasAccount()) {
    account = kinClient.getAccount(0);
}
```

Calling `getAccount` with the existing account index will retrieve the account stored on the device.

```java
kinClient.deleteAccount(int index);
```

**Warning:** You can delete an account from the device using `deleteAccount`, but beware! The account will lose access to the account's private key and subsequently will lose access to the Kin stored in the account.

#### Onboarding

Before a new account can be used, it must be added to the blockchain in a process called onboarding. The process of onboarding consists of two steps, first creating a keypair on the client as we did before, then creating the public address on the Kin Blockchain. You normally onboard an account by communicating to a server running the [Kin SDK for Python](python-sdk.md). On the testnet, this is done automatically for you. Also remember that new accounts are created with 0 Kin, so you will have to fund them. On the Playground, you can fund accounts using the `friendbot`.

For code details see the [Sample App](https://github.com/kinecosystem/kin-sdk-android/tree/master/sample)'s [OnBoarding](https://github.com/kinecosystem/kin-sdk-android/blob/master/sample/src/main/java/kin/sdk/sample/OnBoarding.java) class.

#### Public Address

Your account can be identified via its public address. To retrieve the account public address use:

```java
account.getPublicAddress();
```

#### Query Account Status

Current account status on the blockchain can be queried using the `getStatus` method, which will return one of the following two options:

* `AccountStatus.NOT_CREATED` - Account is not created on the network.
* `AccountStatus.CREATED` - Account was created, account can send and receive Kin.

###### Snippet: Query account status

```java
Request<Integer> statusRequest = account.getStatus();
statusRequest.run(new ResultCallback<Integer>() {
    @Override
    public void onResult(Integer result) {
        switch (result) {
            case AccountStatus.CREATED:
                //you're good to go!!!
                break;
            case AccountStatus.NOT_CREATED:
                //first create an account on the blockchain.
                break;
        }
    }

    @Override
    public void onError(Exception e) {

    }
});
```

The `Request` object in [Query account status](#snippet-query-account-status) creates an asynchronous request with callback. You can also create synchronous requests that will throw exceptions. For details, see [Sync vs Async](#sync-vs-async)

#### Retrieving Balance

To retrieve the balance of your account in Kin, call the `getBalance` method:

###### Snippet: Get Kin account balance

```java
Request<Balance> balanceRequest = account.getBalance();
balanceRequest.run(new ResultCallback<Balance>() {

    @Override
    public void onResult(Balance result) {
        Log.d("example", "The balance is: " + result.value(2));
    }

    @Override
        public void onError(Exception e) {
            e.printStackTrace();
        }
});
```

By using `result.value(2)` in the example above, we print the balance with a precision of 2 decimal points. This is a required parameter of `value()`.

### Transactions

Transactions are executed on the Kin blockchain in a two-step process.

1. **Build** the transaction, including calculation of the transaction hash. The hash is used as a transaction ID and is necessary to query the status of the transaction.
2. **Send** the transaction to servers for execution on the blockchain.

Snippets [Transfer Kin](#snippet-transfer-kin) and [Whitelist service](#snippet-whitelist-service) illustrate this two-step process.

#### Transaction Fees
It is important to note that by default all transactions on the Kin blockchain are charged a fee. Fees for individual transactions are trivial (1 Kin = 10E5 Fee).

Some apps can be added to the Kin whitelist, a set of pre-approved apps whose users will not be charged Fee to execute transactions. If your app is in the  whitelist, refer to [transferring Kin to another account using whitelist service](#transferring-kin-to-another-account-using-whitelist-service).

Whitelisting a transaction is a function provided by the [Kin SDK for Python](python-sdk.md) and should be implemented by developers as a back-end service. Developers (you) are responsible of creating and maintaining their back-end services.

#### Transferring Kin to Another Account

To transfer Kin to another account, you need the public address of the account to which you want to transfer Kin.

Below are the steps for transferring 20 Kin to a recipient account. For the full code snippet, go to [Transfer Kin](#snippet-transfer-kin).

1. Specify the recipient address and the amount to transfer:
```java
String toAddress = "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO";
BigDecimal amountInKin = new BigDecimal("20");
```

2. Set the amount of `fee` you are prepared to pay. It is recommended to query `kinClient.getMinimumFee()` or `kinClient.getMinimumFeeSync()` to get the current minimum fee. Set an amount equal or higher to the minimum fee or you can set a fixed amount. If `fee` is too low, the transaction might fail and you will get an `InsufficientFeeException` error.

```java
int fee = 100;
```

3. Build the transaction and get a `Request<Transaction>` object.
```java
buildTransactionRequest = account.buildTransaction(toAddress, amountInKin, fee);
```

To keep the UI smooth, you want to build and later send the transaction in background threads. To do that, you also need to have some callbacks. Build the transaction and define the callback. (The code below is incomplete, [continue for the complete snippet.](#snippet-transfer-kin))
```java
buildTransactionRequest.run(new ResultCallback<TransactionId>() {

  @Override
    public void onResult(Transaction transaction) {
      Log.d("example", "The transaction id before sending: " + transaction.getId().id());
      ...
    }
  ...
}
```

When `onResult` is called, you will log the transaction hash, which is the unique identifier of each transaction. It is always good practice to store this in case you need to review at a later stage.

Now that you built the transaction and have the hash, create a send request and then actually send it, in background.
```java
sendTransactionRequest = account.sendTransaction(transaction);
sendTransactionRequest.run(new ResultCallback<TransactionId>() {...}
```

And to be safe, log the Transaction ID returned by the blockchain.

```java
@Override
  public void onResult(TransactionId id) {
    Log.d("example", "The transaction id: " + id);
  }
```

A quick `printStackTrace` in case of errors sending the transaction:
```java
            @Override
            public void onError(Exception e) {
                e.printStackTrace();
            }
        });
    }
```

And the same if we had an error building the transaction:
```java
    @Override
    public void onError(Exception e) {
        e.printStackTrace();
    }
});

```

Breaking it down may make the process look complex, but it really isn't. Here is the full snippet:

###### Snippet: Transfer Kin

```java

String toAddress = "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO";
BigDecimal amountInKin = new BigDecimal("20");

// set a fixed fee, because I'm lazy
int fee = 100;

// Build the transaction and get a Request<Transaction> object.
buildTransactionRequest = account.buildTransaction(toAddress, amountInKin, fee);
// Actually run the build transaction code in a background thread
buildTransactionRequest.run(new ResultCallback<TransactionId>() {

    @Override
    public void onResult(Transaction transaction) {
        // Here we got a Transaction object before actually sending the
				// transaction this way we can save information for later if anything goes wrong
        Log.d("example", "The transaction id before sending: " + transaction.getId().id());

        // Create the send transaction request
        sendTransactionRequest = account.sendTransaction(transaction);
        // Actually send the transaction in a background thread.
        sendTransactionRequest.run(new ResultCallback<TransactionId>() {

            @Override
            public void onResult(TransactionId id) {
                Log.d("example", "The transaction id: " + id);
            }

            @Override
            public void onError(Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void onError(Exception e) {
        e.printStackTrace();
    }
});

```
#### Transferring Kin to Another Account Using Whitelist Service

The flow is very similar to [Transfer Kin](#snippet-transfer-kin) but adds steps in which you:

1. Get the 'WhitelistableTransaction' object from the 'Transaction' object you create.
2. Send 'WhitelistableTransaction' to the whitelist service to create string 'whitelistTransaction'.
3. Use method 'sendWhitelistTransaction(String whitelist)' where 'String whitelist' = 'whitelistTransaction'.

Remember that you will need a server to whitelist your transactions. You build that with the [Kin SDK for Python](python-sdk.md).

###### Snippet: Whitelist service

```java
String toAddress = "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO";
BigDecimal amountInKin = new BigDecimal("20");
// because it is whitelisted no fee is needed.
// even if the user enters an amount larger then zero it will not be deducted from her balance.
int fee = 0

buildTransactionRequest = account.buildTransaction(toAddress, amountInKin, fee);
buildTransactionRequest.run(new ResultCallback<TransactionId>() {

    @Override
    public void onResult(Transaction transaction) {
        Log.d("example", "The transaction id before sending: " + transaction.getId().id());

       // depends on your service but you could probably do it this way
       // or give it some listener or some other way.
        String whitelistTransaction = whitelistService.whitelistTransaction(transaction.getWhitelistableTransaction())

        // Create the send the whitelist transaction request
        sendTransactionRequest = account.sendWhitelistTransaction(whitelistTransaction);
        sendTransactionRequest.run(new ResultCallback<TransactionId>() {

            @Override
            public void onResult(TransactionId id) {
                Log.d("example", "The transaction id: " + id);
            }

            @Override
            public void onError(Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void onError(Exception e) {
        e.printStackTrace();
    }
});

```


#### Memo

Arbitrary data that can be added to a transfer operation using the `memo` parameter may contain a UTF-8 string up to 21 bytes in length. A typical usage is to include an order number that a service can use to verify the payment.

The value of `appID` is automatically added to the transaction memo. This is required for the Kin Developer Program and in the future for KRE calculations.


###### Snippet: Add memo to transaction

```java
String memo = "arbitrary data";

buildTransactionRequest = account.buildTransaction(toAddress, amountInKin, fee, memo);
buildTransactionRequest.run(new ResultCallback<TransactionId>() {

    @Override
    public void onResult(Transaction transaction) {
        Log.d("example", "The transaction id before sending: " + transaction.getId.().id());

        sendTransactionRequest = account.sendTransaction(transaction);
        sendTransactionRequest.run(new ResultCallback<TransactionId>() {

            @Override
            public void onResult(TransactionId id) {
                Log.d("example", "The transaction id: " + id);
            }

            @Override
            public void onError(Exception e) {
                e.printStackTrace();
            }
        });
    }

    @Override
    public void onError(Exception e) {
        e.printStackTrace();
    }

});
```

## Details

With the basics out of the way, let's look at some details.

### Sync vs Async

Asynchronous requests are supported by our `Request` object. The `request.run()` method will perform requests sequentially on a single background thread and notify of success/failure using `ResultCallback` on the Android main thread.
The `cancel(boolean)` method can be used to safely cancel requests and detach callbacks.

A synchronous version (with the 'Sync' suffix) of these methods is also provided. As SDK requests perform network I/O operations, make sure you call synchronous requests in a background thread.

See [Snippet: Query account status](#snippet-query-account-status) for usage.

### Account Listeners

With Kin SDK for Android your service can respond to payments, balance changes and account creation using `BlockchainEvents`.

###### Snippet: Payment listener

```java
ListenerRegistration listenerRegistration = account.addPaymentListener(new EventListener<PaymentInfo>() {
    @Override
    public void onEvent(PaymentInfo payment) {
      Log.d("example", String.format("payment event, to = %s, from = %s, amount = %s", payment.sourcePublicKey(),
              payment.destinationPublicKey(), payment.amount().toPlainString());
    }
});
```

###### Snippet: Balance listener

```java
ListenerRegistration listenerRegistration = account.addBalanceListener(new EventListener<Balance>() {
  @Override
    public void onEvent(Balance balance) {
      Log.d("example", "balance event, new balance is = " + balance.value().toPlainString());
    }
});
```

###### Snippet: Account creation listener

```java
ListenerRegistration listenerRegistration = account.addAccountCreationListener(new EventListener<Void>() {
  @Override
  public void onEvent(Void result) {Log.d("example", "Account has been created.");}
});
```

To unregister any listener, use the `listenerRegistration.remove()` method.

### Import/Export

The Kin SDK allows you to import and export accounts. This can be used, for instance, for backing up and/or restoring an account.  
This feature works as follows:  
* Export: You can export an account using its corresponding `KinAccount` object. It will return the account data as a JSON string. You just need to pass a passphrase, which will be used to encrypt the the private key. This passphrase will be later needed to import the account.  

###### Snippet: Export account

```java
String exportedAccount = account.export(passphrase);
```

* Import: You can import an account using the `KinClient` object.  
You need to pass the JSON string that was received when the account was exported and the passphrase that was used to export the account.

###### Snippet: Import account

```java
KinAccount importedAccount = kinClient.importAccount(exportedJson, passphrase);
```
Note that the encryption strength depends on the strength of the passphrase.  
Also, we recommend to save the JSON string in a private place. 
### Error Handling

`kin-sdk` wraps errors with exceptions. Synchronous methods can throw exceptions and asynchronous requests have `onError(Exception e)` callbacks.

#### Common Errors

`AccountNotFoundException` - Account was not created on the blockchain.  
`InsufficientKinException` - Account has not enough Kin funds to perform the transaction.  
`InsufficientFeeException` - Transaction has not enough Fee to perform the transaction.

Here's a link to [all exceptions.](https://github.com/kinecosystem/kin-sdk-android/tree/master/kin-sdk/src/main/java/kin/sdk/exception/).

### Testing

Both unit tests and instrumented tests are provided.

Android tests include integration tests that run on a remote test network. Because they are time consuming (depending on network), they are marked as `@LargeTest`.

For a full list of tests see

- https://github.com/kinecosystem/kin-sdk-android/tree/master/kin-sdk/src/test
- https://github.com/kinecosystem/kin-sdk-android/tree/master/kin-sdk/src/androidTest


### Running Tests

For running both unit tests and instrumented tests and generating a code coverage report using Jacoco, use those scripts one after another.
```bash
$ ./gradlew :kin-sdk:kin-sdk-lib:connectedAndroidTest
$ ./gradlew :kin-sdk:kin-sdk-lib:jacocoTestReport
```

A report is generated and can be found at:
`kin-sdk/kin-sdk-lib/build/reports/jacoco/jacocoTestReport/html/index.html`.

### Building from Source

To build from source, clone the repo:

```bash
$ git clone https://github.com/kinecosystem/kin-sdk-android.git
```
Now you can build the library using gradle or open the project using Android Studio.

## Sample Code

`Sample` app covers the entire functionality of `kin-sdk` and serves as a detailed example on how to use the library.

The sample app source code can be found [here](https://github.com/kinecosystem/kin-sdk-android/tree/dev/sample/).


