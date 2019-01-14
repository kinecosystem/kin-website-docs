---
id: unity-sdk
title: Kin SDK for Unity
---
Unity plugin responsible for providing access to the Kin native SDKs for managing Kin balance and transactions.


## Android Setup

The Kin SDK for Unity is a plug-in that uses the Gradle build system on Android. See the [Building with Gradle for Android](https://docs.unity3d.com/Manual/android-gradle-overview.html) section of Unity's documentation and the [Providing a custom build.gradle template](https://docs.unity3d.com/Manual/android-gradle-overview.html) to enable the use of a custom Gradle file.

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

	implementation 'com.github.kinecosystem:kin-sdk-android:0.1.4'
**DEPS**}

...

android {
    compileOptions {
        sourceCompatibility 1.8
        targetCompatibility 1.8
    }

    ...
}
```


## iOS Setup

In the iOS Player Settings, the `Target minimum iOS Version` must be set to 8.1 or newer.


## Get Started

### Connecting to a service provider

Create a new `KinClient`, with an `Environment` enum that provides details of how to access the Kin blockchain end point. Environment provides the predefined `Environment.TEST` and `Environment.PRODUCTION` values.

`appId` is a 4 character string which represent the application id which will be added to each transaction.

`appId` must contain only upper and/or lower case letters and/or digits and that the total string length is exactly 4.

An optional parameter is `storeKey` which can be used to create a multiple sets of Kin accounts.


The example below creates a `KinClient` that will be used to connect to the Kin test environment:

```csharp
kinClient = new KinClient( Environment.TEST, "1acd" )
```

### Creating and retrieving a Kin account

The first time you use `KinClient` you need to create a new Kin wallet and an associated Kin account. The Kin wallet is stored on the user's client device and holds a public/private key pair. The private key remains securely stored in the local wallet while the public key will become the address of the Kin account added to the Kin blockchain. Multiple accounts can be created using `AddAccount`.

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
In the above snippet, if an account does not exist a Wallet and key pair will be created.

Calling `GetAccount` with the existing account index will retrieve the account stored on the device.

```csharp
if( kinClient.HasAccount() )
    account = kinClient.getAccount( 0 );
```

You can delete your account from the device using `DeleteAccount`, but beware! you will lose all your existing KIN if you do this.

```csharp
kinClient.DeleteAccount( int index );
```

## Onboarding

Before a new account can be used it must be added to the blockchain in a process called onboarding. To be of much use the onboarded account will need to receive funds. This step must be performed by a service, see the [Kin SDK documentation](https://github.com/kinecosystem/kin-sdk-android/blob/master/README.md) for details.

The second step is to activate this account on the client side, using `Activate` method. The account will not be able to receive or send Kin before activation.

```csharp
account.Activate( ex =>
{
	if( ex != null )
		Debug.LogError( "Activate Failed. " + ex );
	else
		Debug.Log( "Account activated" );
});
```

## Account Information

### Public Address

Your account can be identified via its public address. To retrieve the account public address use:

```csharp
account.GetPublicAddress();
```

### Query Account Status

Current account status on the blockchain can be queried using `GetStatus` method, status will be one of the following 2 options:

* `AccountStatus.NotCreated` - Account is not created on the blockchain. The account cannot send or receive Kin yet.
* `AccountStatus.Created` - Account was created, account can send and receive Kin.

```csharp
account.GetStatus( ( ex, status ) =>
{
	if( ex == null )
		Debug.Log( "Account status: " + status );
	else
		Debug.LogError( "Get Account Status Failed. " + ex );
});
```

### Retrieving Balance

To retrieve the balance of your account in Kin call the `GetBalance` method: 

```csharp
account.GetBalance( ( ex, balance ) =>
{
	if( ex == null )
		Debug.Log( "Balance: " + balance );
	else
		Debug.LogError( "Get Balance Failed. " + ex );
});
```

## Transactions

### Transferring Kin to another account

To transfer Kin to another account, you need the public address of the account to which you want to transfer Kin.

By default, your user will need to spend Fee to transfer Kin or process any other blockchain transaction. Fee for individual transactions are trivial (1 Fee = 10<sup>-5</sup> Kin).

Some apps can be added to the Kin Whitelist, a set of pre-approved apps whose users will not be charged Fee to execute transactions. If your app is in the  whitelist then refer to [transferring Kin to another account using whitelist service](#transferring-kin-to-another-account-using-whitelist-service).

The snippet [Transfer Kin](#snippet-transfer-kin) will transfer 20 Kin to the recipient account "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO".

###### Snippet: Transfer Kin
```csharp
var toAddress = "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO";
var amountInKin = 20;
var fee = 100;


// we could use here some custom fee or we can can call the blockchain in order to retrieve
// the current minimum fee by calling kinClient.getMinimumFee(). Then when you get the minimum
// fee returned and you can start the 'send transaction flow' with this fee.
account.BuildTransaction( toAddress, amountInKin, fee, ( ex, transaction ) =>
{
	if( ex == null )
	{
        // Here we already got a Transaction object before actually sending the transaction. This means
        // that we can, for example, send the transaction id to our servers or save it locally  
        // in order to use it later. For example if we lose network just after sending 
        // the transaction then we will not know what happened with this transaction. 
        // So when the network is back we can check what is the status of this transaction.
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


### Transferring Kin to another account using Whitelist service

The flow is very similar to the above code but here there is a middle stage in which you get the WhitelistableTransaction details from the 'Transaction' object just after you build the transaction and you send it to the whitelist service. Then you just use the method 'sendWhitelistTransaction( string whitelist )' and the parameter for that method is what you got from that service.

The flow is very similar to [Transfer Kin](#snippet-transfer-kin) but adds a step in which you:

- Get the 'WhitelistableTransaction' object from the 'Transaction' object you create. 
- Send 'WhitelistableTransaction' to the whitelist service to create string 'whitelistTransaction'.
- Use method 'sendWhitelistTransaction(String whitelist)' where 'String whitelist' = 'whitelistTransaction'.


###### Snippet: Whitelist service
```csharp
account.BuildTransaction( toAddress, amountInKin, fee, ( ex, transaction ) =>
{
	if( ex == null )
	{
		Debug.Log( "Build Transaction result: " + transaction );

		var whitelistTransaction = YourWhitelistService.WhitelistTransaction( transaction );
		account.SendWhitelistTransaction( transaction.Id, whitelistTransaction, ( ex, transactionId ) =>
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


#### Memo

Arbitrary data can be added to a transfer operation using the `memo` parameter containing a UTF-8 string up to 21 bytes in length. A typical usage is to include an order number that a service can use to verify payment.

```csharp
var memo = "arbitrary data";

account.BuildTransaction( toAddress, amountInKin, fee, memo, ( ex, transaction ) =>
{
	if( ex == null )
	{
        // Here we already got a Transaction object before actually sending the transaction. This means
        // that we can, for example, send the transaction id to our servers or save it locally  
        // in order to use it later. For example if we lose network just after sending 
        // the transaction then we will not know what happened with this transaction. 
        // So when the network is back we can check what is the status of this transaction.
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

account.SendTransaction( toAddress, amountInKin, memo, ( ex, transactionId ) =>
{
	if( ex == null )
		Debug.Log( "Send Transaction: " + transactionId );
	else
		Debug.LogError( "Send Transaction Failed. " + ex );
});
```

## Account Listeners

Your Unity game can respond to payments, balance changes and account creation using listeners.

### Listening to payments

Ongoing payments in Kin, from or to an account, can be observed with a payment listener:

```csharp
account.AddPaymentListener( this );

...

public void OnEvent( PaymentInfo payment )
{
	Debug.Log( "On Payment: " + payment );
}
```

### Listening to balance changes

Account balance changes can be observed with a balance listener:

```csharp
account.AddBalanceListener( this );

...

public void OnEvent( decimal balance )
{
	Debug.Log( "On Balance: " + balance );
}
```

### Listening to account creation

Account creation on the blockchain network can be observed by adding and account creation listener:

```csharp
account.AddAccountCreationListener( this );

...

public void OnEvent()
{
	Debug.Log( "On Account Created" );
}
```

To unregister any listener use `RemovePaymentListener`, `RemoveBalanceListener` or `RemoveAccountCreationListener` methods.


## Error Handling

The Kin SDK Unity Plugin wraps Kin native exceptions in the C# KinException class. It provides a `NativeType` field that will contain the native error type, some of which are in the Common Error section that follows.


### Common Errors

`AccountNotFoundException` - Account is not created (funded with native asset) on the network.  
`AccountNotActivatedException` - Account was created but not activated yet, the account cannot send or receive Kin yet.  
`InsufficientKinException` - Account has not enough kin funds to perform the transaction.


## Demo Scene

The demo scene included with the Kin Unity Plugin covers the functionality of the plugin, and serves as a detailed example on how to use it.
