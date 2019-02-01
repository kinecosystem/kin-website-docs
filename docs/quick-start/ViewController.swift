//
//  ViewController.swift
//  KinHelloWorld
//
//  Copyright © 2019 Kin Ecosystem. All rights reserved.
//

import UIKit
import KinSDK

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Initialize the Kin client on the playground blockchain
        let kinClient: KinClient! = initializeKinClientOnPlaygroundNetwork()

        // The Kin Account we're going to create and use
        var account: KinAccount! = nil

        // This deletes any stored account so that we recreate one
        deleteFirstAccount(kinClient: kinClient)

        // Get any stored existing user account
        if let existingAccount = getFirstAccount(kinClient: kinClient) {
            print("Current account with address \(existingAccount.publicAddress)")
            account = existingAccount
        }
        // or else create an account with the client
        else if let newAccount = createLocalAccount(kinClient: kinClient) {
            print("Created account with address \(newAccount.publicAddress)")
            account = newAccount
        }

        // Watch for the creation of the account
        watchCreation(forAccount: account)

        // Watch for changes in the balance of the account
        watchBalance(forAccount: account)

        // Print the current status of the account
        printStatus(forAccount: account, completionHandler: nil)

        // Get the minimum fee required to send a transaction
        kinClient.minFee()
                .then { (fee) in
                    print("Minimum fee \(fee)")
                }
                .error { (error: Error) in
                    print("Error getting the minimum fee \(error)" )
                }


        // We use here the asynchronous version of the methods to get the status, and depending on the status (whether
        // the account has been created on the blockchain or not) we create it on the blockchain, fund it, and
        // send a transaction, or just print the balance and send a transaction.

        // Get the status of the account
        account.status { (status: AccountStatus?, error: Error?) in
            guard let status = status else {
                return
            }

            switch status {

            case .notCreated:
                // The account has just been created locally. It needs to be added to the blockchain

                // We create that account on the playground blockchain
                self.createAccountOnPlaygroundBlockchain(account: account) { (result: [String : Any]?) in
                    guard result != nil else {
                        print("The account has not been created")
                        return
                    }
                    print("Account was created successfully")

                    // Get the balance on the account
                    self.getBalance(forAccount: account) { kin in
                        guard let kin = kin,
                              kin > 0.0 else {
                            print("No Kin available in this account")
                            return
                        }
                        print("The account has \(kin) Kin")

                        // Print the account's status again
                        self.printStatus(forAccount: account, completionHandler: nil)

                        // Sends some kinds to another account
                        let toAddress = "GBGOKDBB3PABAGJV233C3LVBIO5HFQUUSML4FTXYCHW2VCEU4QLYL2II"
                        self.sendTransaction(fromAccount: account,
                                toAddress: toAddress,
                                kinAmount: 5,
                                memo: "Testing transaction",
                                fee: 1) { txId in
                            guard let _ = txId else {
                                print("Error sending transaction")
                                return
                            }
                            print("Kin were sent successfully!!!!!")

                            // Get the balance after the transaction
                            self.getBalance(forAccount: account) { kin in
                                guard let kin = kin else {
                                    print("Error getting the balance")
                                    return
                                }
                                print("Now the balance is \(kin) Kin")
                            }
                        }
                    }
                }

            case .created:
                // The account exists on the blockchain - We can send transactions (provided there are enough Kin)

                // Get the balance
                self.getBalance(forAccount: account) { kin in
                    guard let kin = kin,
                          kin > 0.0 else {
                        print("No Kin in this account")
                        return
                    }
                    print("The account is created and can send Kin with a balance of \(kin) Kin")
                    let toAddress = "GBGOKDBB3PABAGJV233C3LVBIO5HFQUUSML4FTXYCHW2VCEU4QLYL2II"
                    self.sendWhitelistTransaction(fromAccount: account,
                            toAddress: toAddress,
                            kinAmount: 4,
                            memo: "Test",
                            fee: 0) { txId in
                        guard let _ = txId else {
                            print("Error sending whitelist transaction")
                            return
                        }
                        print("Kin were sent successfully using a whitelist transaction !!!!!")

                        self.getBalance(forAccount: account) { kin in
                            guard let kin = kin else {
                                print("Error getting the balance")
                                return
                            }
                            print("Now the balance is \(kin) Kin")
                        }
                    }
                }
            }
        }

        // Exports the account to a JSON string with the given passphrase. You can later import the account with the
        // same passphrase and the JSON string.
        let json = try! account.export(passphrase: "a-secret-passphrase-here")
        print("Exported JSON \n\(json)\n")
    }

    /**
    Initializes the Kin Client with the playground environment.
    */
    func initializeKinClientOnPlaygroundNetwork() -> KinClient? {
        let url = "http://horizon-testnet.kininfrastructure.com"
        guard let providerUrl = URL(string: url) else { return nil }

        do {
            let appId = try AppId("test")
            return KinClient(with: providerUrl, network: .testNet, appId: appId)
        }
        catch let error {
            print("Error \(error)")
        }
        return nil
    }

    /**
    Returns the first account stored on the client. The account status will tell whether the account also exists
    on the blockchain or not.
    */
    func getFirstAccount(kinClient: KinClient) -> KinAccount? {
        return kinClient.accounts.first
    }

    /**
    Create a local stored account (does not created it on the blockchain)
    */
    func createLocalAccount(kinClient: KinClient) -> KinAccount? {
        do {
            let account = try kinClient.addAccount()
            return account
        }
        catch let error {
            print("Error creating an account \(error)")
        }
        return nil
    }

    /**
    Delete the first stored account of the client.
    */
    func deleteFirstAccount(kinClient: KinClient) {
        do {
            try kinClient.deleteAccount(at: 0)
            print("First stored account deleted!")
        }
        catch let error {
            print("Could not delete account \(error)")
        }
    }

    /**
    Get the balance using the method with callback.
    */
    func getBalance(forAccount account: KinAccount, completionHandler: ((Kin?) -> ())?) {
        account.balance { (balance: Kin?, error: Error?) in
            if error != nil || balance == nil {
                print("Error getting the balance")
                if let error = error { print("with error: \(error)") }
                completionHandler?(nil)
                return
            }
            completionHandler?(balance!)
        }
    }

    /**
    Watch for the creation of the account. This simply prints a message.
    */
    func watchCreation(forAccount account: KinAccount) {
        do {
            let watch = try account.watchCreation()
            watch.then { (_) in
                print("Account creation watcher update: was created (watch)")
            }
        }
        catch let error {
            print("Error watching account creation \(error)")
        }
    }

    /**
    Watch the balance. This simply prints a message when the balance has changed.
    */
    func watchBalance(forAccount account: KinAccount) {
        let watch = try! account.watchBalance(nil)
        watch.emitter.on { (balance: Kin) in
            print("The account's balance has changed: \(balance)")
        }
    }

    /**
    Get the status of the account using the callback method.
    */
    func printStatus(forAccount account: KinAccount,
                     completionHandler: ((AccountStatus?) -> ())?) {
        account.status { (status: AccountStatus?, error: Error?) in
            if error != nil || status == nil {
                print("Error getting status")
                if let error = error { print ("with error: \(error)") }
                completionHandler?(nil)
                return
            }
            print("Account's status: \(status!)")
            completionHandler?(status!)
        }
    }

    /**
    Create the given stored account on the playground blockchain. When on the Playground blockchain, the account
    is funded with 10000 Kin automatically.
    */
    func createAccountOnPlaygroundBlockchain(account: KinAccount,
                                             completionHandler: @escaping (([String: Any]?) -> ())) {
        // Playground blockchain URL for account creation
        let createUrlString = "http://friendbot-testnet.kininfrastructure.com?addr=\(account.publicAddress)"

        guard let createUrl = URL(string: createUrlString) else { return }

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

    /**
    Sends a transaction to the given account.
    */
    func sendTransaction(fromAccount account: KinAccount,
                         toAddress address: String,
                         kinAmount kin: Kin,
                         memo: String?,
                         fee: Stroop,
                         completionHandler: ((String?) -> ())?) {
        // Get a transaction envelope object
        account.generateTransaction(to: address, kin: kin, memo: memo, fee: fee) { (envelope, error) in
            if error != nil || envelope == nil {
                print("Could not generate the transaction")
                if let error = error { print("with error: \(error)")}
                completionHandler?(nil)
                return
            }

            // Sends the transaction
            account.sendTransaction(envelope!) { (txId, error) in
                if error != nil || txId == nil {
                    print("Error send transaction")
                    if let error = error {
                        print("with error: \(error)")
                    }
                    completionHandler?(nil)
                    return
                }
                print("Transaction was sent successfully for \(kin) Kin - id: \(txId!)")
                completionHandler?(txId!)
            }
        }
    }

    /**
    Sends a transaction to the given account.
    */
    func sendWhitelistTransaction(fromAccount account: KinAccount,
                                  toAddress address: String,
                                  kinAmount kin: Kin,
                                  memo: String?,
                                  fee: Stroop,
                                  completionHandler: ((String?) -> ())?) {
        // Get a transaction envelope object
        account.generateTransaction(to: address, kin: kin, memo: memo, fee: fee) { (envelope, error) in
            if error != nil || envelope == nil {
                print("Could not generate the transaction")
                if let error = error {
                    print("with error: \(error)")
                }
                completionHandler?(nil)
                return
            }

            let networkId = Network.testNet.id
            let whitelistEnvelope = WhitelistEnvelope(transactionEnvelope: envelope!, networkId: networkId)

            self.signWhitelistTransaction(whitelistServiceUrl: "WHITELIST_SERVICE_URL",
                    envelope: whitelistEnvelope) { (signedEnvelope, error) in
                if error != nil || signedEnvelope == nil {
                    print("Error whitelisting the envelope")
                    if let error = error {
                        print("with error: \(error)")
                    }
                    completionHandler?(nil)
                    return
                }
                // send the whitelist transaction
                account.sendTransaction(signedEnvelope!) { (txId, error) in
                    if error != nil || txId == nil {
                        print("Error send whitelist transaction")
                        if let error = error {
                            print("with error: \(error)")
                        }
                        completionHandler?(nil)
                        return
                    }
                    print("Whitelist transaction was sent successfully for \(kin) Kin - id: \(txId!)")
                    completionHandler?(txId!)
                }

            }
        }
    }

    /**
    Sign the given transaction envelope so that the transaction can be submitted with the fee waived
    */
    func signWhitelistTransaction(whitelistServiceUrl: String,
                                  envelope: WhitelistEnvelope,
                                  completionHandler: @escaping ((TransactionEnvelope?, Error?) -> ())) {
        let whitelistingUrl = URL(string: whitelistServiceUrl)!

        var request = URLRequest(url: whitelistingUrl)
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpMethod = "POST"
        request.httpBody = try? JSONEncoder().encode(envelope)

        let task = URLSession.shared.dataTask(with: request) { (data, response, error) in
            do {
                let envelope = try TransactionEnvelope.decodeResponse(data: data, error: error)
                completionHandler(envelope, nil)
            }
            catch {
                completionHandler(nil, error)
            }
        }
        task.resume()
    }

}
