---
id: hi-kin-unity
title: Hello World Unity
sidebar_label: Hello World Unity
---

As you probably expect from the name, this article provides a quick code walk-through demonstrating all the key concepts you need to create Unity clients that allow your users to earn, spend, and manage Kin.

## Import the Kin SDK for Unity from the Unity Asset Store

Navigate to the Unity Asset Store and download the [Kin SDK for Unity](https://assetstore.unity.com/packages/tools/utilities/kin-sdk-for-unity-android-beta-137182).

The Kin SDK for Unity uses the Gradle build system on Android. See the [Building with Gradle for Android](https://docs.unity3d.com/Manual/android-gradle-overview.html) section of Unity's documentation and the [Providing a custom build.gradle template](https://docs.unity3d.com/Manual/android-gradle-overview.html) to enable the use of a custom gradle file.

Open the `Plugins/Android/mainTemplate.gradle` file and add the following:

```gradle
...

allprojects {
    repositories {
        ...
		jcenter()
		google()
		maven { url 'https://jitpack.io' }
    }
}

...

dependencies {

    ...

	implementation 'com.github.kinecosystem:kin-sdk-android:1.0.1'
**DEPS**}

...

android {
    compileOptions {
        sourceCompatibility 1.8
        targetCompatibility 1.8
    }

    ...
}
````

With that out of the way, we can start looking at the code.


## Connecting to Kin Blockchain

One of the first statements executed when the app is created connects to the test environment of the Kin Blockchain.

```csharp
// Kin client is the manager for Kin accounts
kinClient = new KinClient( Environment.Test, "STUB_APP_ID" )
```
`Environment` is an enum that lets you toggle between the `Test` and `Production` blockchain servers.

`STUB_APP_ID` should be replaced with your `appId` once your app is in production. An `appId` is a 4-character string assigned to you by Kin and used to identify your application. It contains only digits and upper and/or lowercase letters. While you are testing your integration in the Kin Playground environment (`Environment.Test`), you can use any string of four characters as long as you only use digits and upper or lowercase letters.

Your `appId` is automatically added to the `memo` field of transactions. For more information, see the [executing a transaction](#executing-a-transaction) section.



## KinClient
The `KinClient` class contains methods for managing accounts on the Kin Blockchain.

## Create KinAccount Object
The KinAccount class deals with specific accounts on the Kin Blockchain.   

```csharp
// Kin account the is the entity that holds Kin
account = kinClient.GetAccount( APP_INDEX );
```

When the above snippet creates the kinAccount object, `GetAccount` will begin the process of adding an account to the Kin Blockchain. When this function finishes, there will be a keypair associated with the new account stored securely on the local client.

```csharp
KinAccount account;
try
{
    if( !kinClient.HasAccount() )
        account = kinClient.AddAccount();
}
catch( Exception e )
{
    Debug.LogError( e );
}
```

## Listen for Account Balance Changes

The Kin SDK for Unity provides a set of listeners that allow you to receive callbacks when certain events take place on the blockchain. For example, you can listen for any change in the balance of Kin held in an account.

**Note:** In a production environment, the newly added account would not yet be live on the Kin Blockchain, and therefore attempting to add a listener to a non-existing account would result in an error. But this is a test environment, and we know the account already exists.

```csharp
// Listener for balance changes
account.AddBalanceListener( this );
```

When the above snippet calls the below function, you will see a log entry reporting the balance of the account on the Kin Blockchain.

```csharp
public void OnEvent( decimal balance )
{
	Debug.Log( "On Balance: " + balance );
}
```

## Onboard KinAccount

Onboarding is the process of sending an async request to the Horizon server requesting a new account be added to the Kin Blockchain. The Hello World code accomplishes two tasks while onboarding. Note the `KinOnboarding.CreateAccount` will only work in the `Test` environment.

```csharp
StartCoroutine( KinOnboarding.CreateAccount( _account.GetPublicAddress(), didSucceed =>
{
	_isAccountCreated = didSucceed;
} ) );
```

## Transfer Kin

After onboarding succeeds, the code transfers 5 KIN to another account. The public address of an account is the public key created when a local keypair is generated.

```csharp
transferKin(account, TARGET_WALLET, 5);
```

## Understanding Balance Results

Note that when the app transfers 5 KIN to another account, the balance in the account decreases by 5.01 KIN. The addition 0.01 KIN is the fee charged by the blockchain for executing the transaction.

Blockchain charges are demoninated in Fee, where 1 KIN = 10E5 FEE.

Not all blockchain transactions are charged a fee. Some apps (identified by `appId`) can be placed on a Whitelist, allowing users to execute transactions without being charged. Whitelisting requires a live app server and is beyond the scope of this Hello World client overview.


## Executing a Transaction

Every transaction added to the Kin Blockchain includes a unique identification that is the hash of the transaction payload.

Notice how the `transferKin` function builds the transaction request locally, records the transaction ID, then sends the transaction to the Horizon server for execution.

Knowing the transaction ID in advance of sending the request is important for exception handling. For example, it is possible to experience a network outage after a request is successfully sent but before any callback is received. When network access is restored you can query the blockchain for the status of the transaction in question to determine next steps.

In this function, we use two methods of the Kin SDK:

- `buildTransaction` builds the transaction locally and expects 4 parameters - the recipient's public address, the amount of Kin to transfer, the fee and a memo
- `sendTransaction` only expects the `transaction` object returned by buildTransaction.

The `memo` field allows developers to add a note to any transaction and accepts up to 21 characters. The `appID` is automatically added to all transactions in the memo field.

```csharp
void transferKin(KinAccount sender, string targetPublicAddress, decimal amountInKin)
{
	sender.BuildTransaction( targetPublicAddress, amountInKin, FEE, MEMO, ( ex, transaction ) =>
	{
		if( ex == null )
		{
			Debug.Log( "Build Transaction result: " + transaction );
			account.SendTransaction( transaction, ( ex, transactionId ) =>
			{
				if( ex == null )
					Debug.Log( "Send Transaction result: " + transactionId );
				else
					Debug.LogError( "Send Transaction Failed. " + ex );
			});
		}
		else
		{
			Debug.LogError( "Build Transaction Failed. " + ex );
		}
	});

```
