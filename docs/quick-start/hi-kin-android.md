---
id: hi-kin-android
title: Hello World Android
sidebar_label: Hello World Android
---

As you probably expect from the name, this article provides a quick code walk-through demonstrating all the key concepts you need to create Android clients that allow your users to earn, spend, and manage Kin. We'll demonstrate it in an Android Studio environment, but the concepts apply regardless of the IDE you use.

## Import project

From Android Studio, select `File > New > Project from Version Control > Git` and enter this URL: 

**URL to repo** 

Navigate to ..... and open the MainActivity.java file. There is no user interface to this develop demo. Everything you need to see and everything you need to do can be accomplished in your IDE. 

## Connect to Kin blockchain

One of the first statements executed when the app is created connects to the test environment of the Kin blockchain. 

```java
        // Kin client is the manager for Kin accounts
        kinClient = new KinClient(this, Environment.TEST, STUB_APP_ID);
```
`Environment.TEST` is a public static variable that includes `networkURL`, `networkPassphrase`, and `issuerAccountID`. `networkURL` is the location of a Horizon server providing access to the test blockchain.

`STUB_APP_ID` is a four-character string added to all transactions posted to the blockchain. It identifies the service to whom that transaction should be credited. Those credits will produce rewards for your organization when the Kin Rewards Engine is live.

The `KinClient` class contains methods for managing accounts on the Kin Blockchain. To explore those methods, place your cursor on `KinClient` and press `ctl-q` in Windows or XXX on Mac to produce:

![](/img/android-sdk-embedded-documentation-1.png)

Then click  the `For more details ...` link to see full documentation: 

![](/img/android-sdk-embedded-documentation-2.png)

## Create kinAccount object

The KinAccount class deals with specific accounts on the Kin Blockchain.   

```java
        // Kin account the is the entity that holds Kin
        kinAccount = getKinAccount(APP_INDEX);
```

When the above snippet creates the kinAccount object, `getKinAccount` will begin the process of adding an account to the Kin Blockchain. When this function completes, there will be a keypair associated with the new account stored securely on the local client. 

```   public KinAccount getKinAccount(int index) {
        // The index that is used to get a specific account from the client manager
        KinAccount kinAccount = kinClient.getAccount(index);
        try {
            // Creates a local keypair
            if (kinAccount == null) {
                kinAccount = kinClient.addAccount();
                Log.d(TAG, "Created new account succeeded");
            }
        } catch (CreateAccountException e) {
            e.printStackTrace();
        }

        return kinAccount;
    }
```

## Listen for account balance changes

Kin SDK for Android provides a set of listeners that allow you to receive callbacks when certain events take place to an account on the blockchain. For example, you can listen for any change in the balance of Kin held in an account.

**Note** In a production environment our account would not yet be live on the Kin Blockchain, and therefore attempting to add a listener to a non-existing account would result in an error. But this is a test environment and we know the account already exists.

```java
        // Listener for balance changes
        addBalanceListeners(kinAccount);
```

When the above snippet calls the below function you will see a log entry reporting the balance of the account on the Kin blockchain.

```java
    public void addBalanceListeners(KinAccount account) {
        account.addBalanceListener(
            balance -> Log.d(TAG, "balance event, new balance is = " + balance.value().toPlainString()));
    }
```

## Onboard kinAccount

Onboarding is the process of sending an async request to the Horizon server requesting a new account be added to the Kin Blockchain. The Hello World code accomplishes two tasks while onboarding.

First, it sends the onboarding request and logs the success upon callback.  

```java
        // Add the account to the Kin blockchain
        onBoardAccount(kinAccount, new Callbacks() {
                Log.d(TAG, "Onboarding succeeded");
...

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Onboarding failed");
            }
        });
    }
```
## Transfer KIN

After onboarding succeeds, the code transfers 5 Kin to another account. The public address of an account is the public key created when a local keypair is generated.

````
        // Add the account to the Kin blockchain
        // As it is an async request, at the callback we will be able to transfer Kin and check the account balance
        onBoardAccount(kinAccount, new Callbacks() {
                Log.d(TAG, "Onboarding succeeded");
            @Override
            public void onSuccess() {
                transferKin(kinAccount, TARGET_WALLET, AMOUNT_KIN);
            }

            @Override
            public void onFailure(Exception e) {
                Log.e(TAG, "Onboarding failed");
            }
        });
    }
```

## Understanding balance results

Note that when the app transfers 5 KIN to another account, the balance in the account decreases by 5.01 KIN. The addition 0.01 KIN is the fee charged by the blockchain for executing the transaction.

Blockchain charges are demoninated in Fee, where 1 KIN = 10<sup>-5</sup> FEE.

Not all blockchain transactions are charged Fee. Some apps (identified by `appID`) can be placed on a Whitelist which  allow users to execute transactions without being charged. Whitelisting requires a live app server and is beyond the scope of this Hello World client overview.

## Transaction ID

Every transaction added to the Kin blockchain includes a unique identification that is the hash of the transaction payload. 

Notice how the `transferKin` function builds the transaction request locally, records the transaction ID, then sends the transaction to the Horizon server for execution.

Knowing the transaction ID in advance of sending the request is important for exception handling. For example, it is possible to experience a network outage after a request is successfully sent but before any callback is received. When network access is restored you can query the blockchain for the status of the transaction in question to determine next steps.

```java
   public void transferKin(KinAccount sender, String targetPublicAddress, BigDecimal amountInKin) {

        // Build the transaction request and run the request asynchronously:
        // The sender is a kin account that transfers Kins to the target public address
        // Each transaction will be charged a fee
        // Memo will state the transaction's reason
        sender.buildTransaction(targetPublicAddress, amountInKin, FEE, MEMO).run(new ResultCallback<Transaction>() {

            @Override
            public void onResult(Transaction transaction) {
                Log.d(TAG, "The transaction id before sending: " + transaction.getId().id());

                sender.sendTransaction(transaction).run(new ResultCallback<TransactionId>() {

                    @Override
                    public void onResult(TransactionId id) {
                        Log.d(TAG, "The transaction id: " + transaction.getId().id());
                        getKinBalance(kinAccount);
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
    }

```


