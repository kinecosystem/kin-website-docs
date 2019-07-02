---
id: discovery-module-android
title: Discovery Module for Android
---
This repository contains the Ecosystem Apps Discovery module. The module displays some of the ecosystem's applications and enables users to send/receive Kin between your application and other applications in the ecosystem.
This enables users to become familiar with other applications available in the ecosystem.


## Installation
To include the library in your project, do the following:
1. Add jitpack to your *build.gradle* project file.

```gradle
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}
```

2. Add the latest appsDiscovery version to your *build.gradle* file.

```gradle
dependencies {
    ...
    implementation 'com.github.kinecosystem.move-kin-android:appsDiscovery:<latest release>'
}
```

For the latest appsDiscovery release, go to [https://github.com/kinecosystem/move-kin-android/releases](https://github.com/kinecosystem/move-kin-android/releases).


## Exploring the Ecosystem
To allow users to explore the ecosystem, the module displays other ecosystem applications on a single screen. From that screen, users can get more information about each application, install the application if they don't have it yet, and send Kin from their account in the app, to their account on another ecosystem app. 

We provide the following two ways of opening the screen that displays the applications: 
- Adding a button (*AppsDiscoveryButton*) that opens the screen (*AppsDiscoveryActivity*)  
- Adding a pop-up dialog (*AppsDiscoveryAlertDialog*) that suggests opening the screen (*AppsDiscoveryActivity*).  


### Adding *AppsDiscoveryButton* Button  
You can embed the button in any of your layout xml files.  

```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout>
    ...
    <org.kinecosystem.appsdiscovery.view.customView.AppsDiscoveryButton
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            />

</android.support.constraint.ConstraintLayout>
```

### Showing *AppsDiscoveryAlertDialog* Pop-up Dialog  
Showing the *AppsDiscoveryAlertDialog* pop-up dialog can be triggered by some action performed by the user. The user can then choose to click the button in the dialog to open the screen (*AppsDiscoveryActivity*) and to start exploring the ecosystem.

```java
    AppsDiscoveryAlertDialog dialog = new AppsDiscoveryAlertDialog(context);
    dialog.show();
```

### Opening *AppsDiscoveryActivity*  
You can open the *AppsDiscoveryActivity* directly with a button of your choice in your application.

```java
yourButton.setOnClickListener(v -> {
            Intent intent = AppsDiscoveryActivity.Companion.getIntent(context)
            startActivity(intent);
        });
```


## Enabling Kin Transactions Between Applications

### Send Kin
To enable your app to send Kin to another application, do the following:

1. In your root project, add a new package named *kindiscover*.
2. In the *kindiscover* directory, create a service class named *SendKinService* and declare it in your *manifest.xml*.
3. **Important!** Make sure the service is declared as 'exported - false'.

```xml
<application>
    ...
    <service android:name=".kindiscover.SendKinService"
             android:exported="false" />
</application>
```

4. The *SendKinService* class must extend the abstract service *SendKinServiceBase* and implement these two abstract methods:
    - *transferKin* - performs Kin transfer with given parameters
    - *getCurrentBalance* - returns the user wallet's current balance


```java
public class SendKinService extends SendKinServiceBase {
    @NonNull
    @Override
    public KinTransferComplete transferKin(@NonNull String toAddress, int amount, @NonNull String memo) throws KinTransferException {

        // perform the transaction
    }

    @Override
    public BigDecimal getCurrentBalance() throws BalanceException {
        
        //get balance from the wallet
       
       double balance = ...getBalance();
       
       
    }
}
```
In the *transferKin* method, you should use the Kin SDK to create a `Transaction` object and send it to the blockchain. If the transaction is completed successfully, return *KinTransferComplete*. If the transaction fails, throw *KinTransferException*.

In the *getCurrentBalance* method, you should access the user's wallet and return its current balance. 
If retrieving the balance fails, throw *BalanceException*.
    
The *transferKin* and *getCurrentBalance* methods are called on a background thread, so you need to use the Kin SDK `sendTransactionSync` and `sendBalanceSync` to send the transaction and retrieve the balance.


### Receive Kin
To enable your app to receive Kin from other apps in the ecosystem, do the following:

1. In your root project, add a new package named *kindiscover*.
2. In the kindiscover directory, create an activity *AccountInfoActivity* and declare it in your *manifest.xml*. 
3. **Important!** Make sure the activity is declared as 'exported - true'.

```xml
<application>
    ...
    <activity android:name=".kindiscover.AccountInfoActivity"
              android:exported="true"/>       
</application>
```
4. The *AccountInfoActivity* class must extend the abstract activity *AccountInfoActivityBase* and implement the abstract method:
    - *getData*


```java
public class AccountInfoActivity extends AccountInfoActivityBase {

    @Override
    public String getData() {
        
        //get user public address
        
    }
    
}
```
This method returns the public address of the user's wallet. 
It is called on a background thread and can perform long operations.


## Receive Transfer Notifications from Other Apps  
To get notifications from other apps when they send Kin to your app, do the following:

1. In your root project, add a new package named *kindiscover*.
2. In the kindiscover directory, create a service class named *ReceiveKinService* and declare it in your *manifest.xml*.
3. **Important!** Configure the service as 'exported - true'.

```xml
<application>
    ...
    <service android:name=".kindiscover.ReceiveKinService"
             android:exported="true" />
</application>
```


3. The *ReceiveKinService* class must extend the abstract service *ReceiveKinServiceBase* and implement these two abstract methods:
    - *onTransactionCompleted* (called when any app completes a Kin transfer to your app)
    - *onTransactionFailed* (called when any app fails to transfer Kin to your app)


```java
public class ReceiveKinService extends ReceiveKinServiceBase {

    public ReceiveKinService() {
        super();
    }

    @Override
    public void onTransactionCompleted(@NonNull String fromAddress, @NonNull String senderAppName, @NonNull String toAddress, int amount, @NonNull String transactionId, @NonNull String memo) {
        
    }

    @Override
    public void onTransactionFailed(@NonNull String error, @NonNull String fromAddress, @NonNull String senderAppName, @NonNull String toAddress, int amount, @NonNull String memo) {
        
    }
    
}
```
These methods are called when another application in the ecosystem transfers Kin to your application.
If the transaction is completed successfully, the *onTransactionCompleted* will be called.
If the transaction fails, the *onTransactionFailed* will be called.
When an app gets a notification of a completed transfer, it is recommended to call the app local server to verify this transaction info on the blockchain. After the transaction is verified on the blockchain, the app server can add an entry of this transaction info to its transactions history database.

These methods are called on the UI thread.
If you wish to perform network or long-running operations, you need to start your own background thread. The service will keep itself alive for 10 seconds after the method is called. 


## Design and UX
For design and UX recommendations and tips on how to give your users the best experience, see  [https://discover.kin.org/ux_guidlines_v1.pdf](https://discover.kin.org/ux_guidlines_v1.pdf).

## Sample Code
You can see sample apps for the module usage here:

+ [Sender Sample App](https://github.com/kinecosystem/move-kin-android/tree/master/senderSampleApp/) demonstrates how to implement the discovery of other ecosystem apps and how to send Kin to another app.
+ [Receiver Sample App](https://github.com/kinecosystem/move-kin-android/tree/master/receiverSampleApp/) demonstrates how to implement receiving Kin in your app from another ecosystem app and how to get notified about it.
