---
id: appid
title: appID
---

An `appID` is a unique identifier assigned to you by Kin. When you initialize your Kin SDK clients with your `appID` string, it will be automatically added to the memo field of each transaction added to the Kin Blockchain by your users. When the Kin Rewards Engine goes live your `appID` will be used to track the activity your application generates so you can be rewarded.

The `appID` string consists of three or four UTF-8 characters containing only digits and upper and/or lower case letters. While you are testing your integration in the Kin Playground environment you can use any valid string as long as you only use digits and upper or lower case letters.

If you manage more than one application, you have the option to use a different `appID`for each one.

To receive your `appID` [**join the Kin Developer Program**](https://docs.google.com/forms/d/e/1FAIpQLSc4ugsSDuhU1DI8Ub8qF0lhfQRyFdyM8gGZwAR_GXmgXDt0Rg/viewform). You must implement at least one way for users to earn Kin and at least one way for users to spend Kin in your consumer application to be considered for the program. For more information on how best to implement Kin in your application, check out our [Developer Playbook](https://developers.kinecosystem.com/Kin%20Developer%20Program%20Playbook%202.0.pdf)
