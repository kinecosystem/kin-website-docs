---
id: appreciation-options-menu
title: Appreciation Module 'Options Menu' for iOS
---

This module provides an interface for users to show their appreciation for other users through gifting them Kin. The module is independent from the Kin SDK, however it provides Kin branding. The UI presents a half-screen view with several gifting amount options. After choosing an option, a thank you animation will play before dismissing the view.

## Quick Links

- [The appreciation module on GitHub](https://github.com/kinecosystem/kin-appreciation-module-options-menu-ios)

## Installation

The Kin appreciation module for iOS can be included in your project with CocoaPods.

### CocoaPods

Add the following to your `Podfile`:

```ruby
pod 'KinAppreciationModuleOptionsMenu'
```

## Setting Up the Appreciation Module

### Step 1 - Create the View Controller

The initializer requires two parameters:
- `balance`: The current user's balance of Kin
- `theme`: The theme to be used with the module

The theme options are `.light` and `.dark`.

```swift
let appreciationViewController = KinAppreciationViewController(balance: 100, theme: .light)
```

### Step 2 - Set up the Delegate

The delegate provides life cycle information for the appreciation module.

```swift
appreciationViewController.delegate = self
```

#### Protocol Stubs

```swift
extension SomeController: KinAppreciationViewControllerDelegate {
    func kinAppreciationViewControllerDidPresent(_ viewController: KinAppreciationViewController) {

    }

    func kinAppreciationViewController(_ viewController: KinAppreciationViewController, didDismissWith reason: KinAppreciationCancelReason) {

    }

    func kinAppreciationViewController(_ viewController: KinAppreciationViewController, didSelect amount: Decimal) {
        
    }
}
```

> The appreciation module does not send the payment. It is your responsibility to provide this functionality in the `didSelectAmount` function.

### Step 3 - Present the View Controller

The appreciation module inherits from `UIViewController`, so you will present it like any other view controller.

```swift
viewController.present(appreciationViewController, animated: true)
```

### Dismissing the View Controller

The appreciation module will automatically dismiss itself in the following ways:

- Background Tap: Tapping outside of the appreciation view controller bounds
- Close Button: Tapping the close button in the appreciation view controller
- Select Amount: Tapping one of the gifting buttons in the appreciation view controller

## BI Events

Optionally, a BI events delegate is provided for you to log user interactions.

```swift
appreciationViewController.biDelegate = self
```

### Protocol Stubs

```swift
extension SomeController: KinAppreciationBIDelegate {
    func kinAppreciationDidAppear() {
        
    }

    func kinAppreciationDidSelect(amount: Decimal) {
        
    }

    func kinAppreciationDidCancel(reason: KinAppreciationCancelReason) {
        
    }

    func kinAppreciationDidComplete() {
        
    }
}
```

## Sample App

`KinAppreciationModuleOptionsMenuSampleApp` covers the entire functionality of `KinAppreciationModuleOptionsMenu` and serves as a detailed example of how to use the module. The sample app source code can be found [here](https://github.com/kinecosystem/kin-appreciation-module-options-menu-ios/tree/master/KinAppreciationModuleOptionsMenuSampleApp).

The sample app can also be installed through CocoaPods.

```ruby
pod 'KinAppreciationModuleOptionsMenu', :appspecs => ['SampleApp']
```
