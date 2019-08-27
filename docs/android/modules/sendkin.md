---
id: sendkin
title: Send Kin Module for Android
---
The Send Kin module provides a ready-made UI for the Send Kin functionality of the Kin SDK for Android. The UI enables any user to send Kin to any account on the blockchain. The UI contains an address book that allows the user to save public addresses of his/her contacts and to choose any address to send Kin to. In addition, the module includes a listener that allows the developer to monitor events in the module.


## Installation
To include the library in your project, do the following:
1. Add jitpack to your *build.gradle* project file:

```gradle
allprojects {
    repositories {
        ...
        maven { url 'https://jitpack.io' }
    }
}
```

2. Add the latest sendKin version to your *build.gradle* file:

```gradle
dependencies {
    ...
    implementation ‘com.github.kinecosystem.kin-sendkin-module-android:kin-sendkin-lib:<sendkin latest release>’
    implementation ‘com.github.kinecosystem.kin-sdk-android:kin-sdk-lib:<kin sdk latest release>’
}
```

For the latest sendKin release, go to [https://github.com/kinecosystem/kin-sendkin-module-android/releases](https://github.com/kinecosystem/kin-sendkin-module-android/releases).

For the latest Kin SDK release, go to [https://github.com/kinecosystem/kin-sdk-android/releases](https://github.com/kinecosystem/kin-sdk-android/releases).
  



## Initializing *KinSenderManager*
KinSenderManager is the base object that opens the UI and performs Kin transactions.

Two constructors can be used for KinSenderManager:
* Constructor with 2 parameters:
```java
        public KinSenderManager(@NonNull KinClient kinClient, @NonNull KinAccount kinAccount)
```
* Constructor with 3 parameters (if the developer wants to include the listener): 


```java
    public KinSenderManager(@NonNull KinClient kinClient, @NonNull KinAccount kinAccount, @Nullable SendKinEventsListener listener)
```
Example of how to get callbacks for events that occur in the module:

```java
 final KinSenderManager kinSenderManager = new KinSenderManager(kinClient, kinAccount, new SendKinEventsListener() {
            @Override
            public void onViewPage(@NonNull SendKinPages page) {
                Log.d(TAG, "Event onViewPage " + page.name());
            }

            @Override
            public void onTransferFailed() {
                Log.d(TAG, "Event onTransferFailed");
            }

            @Override
            public void onTransferSuccess(@NonNull String transactionId) {
                Log.d(TAG, "Event onTransferSuccess transactionId " + transactionId);
            }

            @Override
            public void onTransactionTimeout() {
                Log.d(TAG, "Event onTransactionTimeout");

            }
        });
```

## Starting the Module Flow
To start the module flow, the developer needs to call method startSendingContactFlow of the KinSenderManager object:

```java
     public void startSendingContactFlow(Context context)
```

Example:
```java
    private void startSendKinFlow() {
            kinSenderManager.startSendingContactFlow(this);
        }
```



## Adding *SendKinLauncherButton* Button(Optional) 
You can use any clickable object of your own for starting the module flow. Here, we provide you with an option of using a ready-made button. You can embed the button in any of your layout XML files.

Example of adding the button to your layout:
```xml
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout>
    ...
   <kin.sendkin.view.SendKinLauncherButton
           android:id="@+id/sendKinBtn"
           android:layout_width="wrap_content"
           android:layout_height="wrap_content"
           app:layout_constraintBottom_toBottomOf="parent"
           app:layout_constraintLeft_toLeftOf="parent"
           app:layout_constraintRight_toRightOf="parent"
           app:layout_constraintTop_toTopOf="parent" />


</android.support.constraint.ConstraintLayout>
```

**Keep in mind that the button will not start the flow automatically. You have to connect it to the module flow first.**    

Example of connecting the button to the module flow:

```java
  findViewById(R.id.sendKinBtn).setOnClickListener(new View.OnClickListener() {
             @Override
             public void onClick(View view) {
                 startSendKinFlow();
             }
         });
    ....
    private void startSendKinFlow() {
            kinSenderManager.startSendingContactFlow(this);
        }
```
