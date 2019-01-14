---
id: hi-kin-python
title: Hello World with the Python SDK
---
# Hello World with the Python SDK
`main.py` is the Hello World script for Kin development with Python. `main.py` implements the most basic functions of the Kin SDK for Python showing you how to create an account on the Kin blockchain, execute a transaction and read the user's current balance.

It operates in the Kin Playground environment dedicated to Kin development where you can develop and test your Kin integration with up to 1000 users.

Please note that the Python SDK is meant to be part of a server-side implementation to pair with one of our client SDK, such as iOS and Android. To better understand the architecture of the Kin Blockchain and the available SDKs look at [Introduction to Kin]

We plan to take you from start to finish in 5 minutes or less, so get ready!

## Disclaimer
This is still a work in progress and some parts might be incomplete or inaccurate.

TODO:
- Correct link to Python SDK repo
- Update download link for `main.py`
- Add link to the Intro to Kin
- add link explaining what the friendbot is
- Add link about fees and whitelisting in the "Send Kin" chapter

## Setup
First of all we need to install the Kin SDK. The Kin SDK requires Python 3, next we use pip:

```bash
pip install kin-sdk
```

## Code walkthrough
In this tutorial we are going to cover all the main elements of the script, but skip a few small parts. See the Download link at the end of the article if you want to skip to the finished work.

The script will simply execute a set of pre-defined commands, no user interaction is required except for the creation of a public address.

### The basics
Now that we have the Kin SDK installed we can create our simple `main.py` script. Let's import `kin`.

```python
# This is the Kin SDK
import kin

# We'll be printing a few things to screen, so we also load pprint
from pprint import pprint
```

### Manage accounts
In this tutorial we are going to create two accounts, one being the main user and the other being the recipient of a transaction.

Here are are going to instantiate the `KinClient` and select in which environment we want to work, in this case we'll work on the Playground (our test environment).

```python
client = kin.KinClient(kin.TEST_ENVIRONMENT)
print('\nEnvironment: ')
# Print environment variables to screen
pprint(vars(client.environment))
```
###### Output:

![](/img/HWPython/1_Py_Environment.png)

#### Get a keypair
Now that the Kin client is properly setup we are ready to either open or create the first account. Accounts always have a keypair of public address (the public address on the blockchain) and the secret seed. These are often also called respectively the public key and private key. *Remember to never share your private keys! ;)*

The code below is self-explanatory. The first time you execute this you likely want to reply "n" to the request to use an existing seed. Feel free to save the secret seed after the first run and use it later for other tests, you'll be able to see your balance change.

```python
existing = input('Use existing seed? [y/n]:  ')
if existing == 'y':
    seed = input('Input your seed: ')
    try:
        keypair = kin.Keypair(seed=seed)
    except kin.KinErrors.StellarSecretInvalidError:
        print('Your seed was not valid')
        raise
else:
    print('\nNext we will generate a keypair')
    keypair = kin.Keypair()

print('We are using the following keypair\n')
pprint(vars(keypair))
```

###### Output:

![](/img/HWPython/2_Py_AccountCreate.png)

#### Check account existence and create
Now that we have a keypair we can check if the account already exists on the blockchain and if not create it. Something important to remember is that creating a keypair does not mean that the account exists or is valid on the blockchain.

```python
print('Using the client, we can check if this account already exists on the blockchain')
exist = client.does_account_exists(keypair.public_address)
if exist:
    print('The account already exist on the blockchain')
else:
    print('The account does not exist on the blockchain')
    print('\nSince we are on the testnet blockchain, we can use the friendbot to create our account...\n')
    client.friendbot(keypair.public_address)

# Init KinAccount
print('We can now create a KinAccount object, we will use it to interact with our account')
account = client.kin_account(keypair.secret_seed)
```

###### Output:

![](/img/HWPython/3_AccountCreated.png)

We are not going to cover the `friendbot` in this tutorial, but when you are ready you should read [this].

### Get balance
Whether we created a new account or we opened an existing one we can now do the most basic action: check the balance. The `account` object provides a few basic methods such as `get_balance()`.

```python
print('We can use our KinAccount object to get our balance')
print('Our balance is {} KIN'.format(account.get_balance()))
```

As you will see a new account doesn't have a 0 balance, the `friendbot` kindly gives us some Kin to get started.

### Create a different account
Let's do something more interesting now, let's get ready to send Kin to another account. For simplicity we are going to create a new account, but of course you can send Kin to any other public address (sending Kin to your own public address won't work).

```python
new_keypair = kin.Keypair()
print('Creating a second account: {}'.format(new_keypair.public_address))
tx_hash = account.create_account(new_keypair.public_address, starting_balance=1000, fee=100, memo_text='Example')
print('\nWe created the account and a confirmation with transaction id: {}'.format(tx_hash))
```

###### Output:

![](/img/HWPython/4_AccountCreate2.png)

### Get the details of a transaction
Every operation on the Kin blockchain is a transaction, so let's print information about the last action we performed.

```python
print('\nWe can now use the client to get info about the transaction we did\n')
transaction = client.get_transaction_data(tx_hash=tx_hash)
# Raw print of the transaction information
transaction.operation = vars(transaction.operation)
pprint(vars(transaction))
```

###### Output:

![](/img/HWPython/5_AccountCreationTxInfo.png)

### Send Kin
Now that we have a destination public address we can send our first Kin. `new_keypair` holds the information of the destination account, we are going to send 10 Kin and in order to execute the transaction we are also going to pay 100 Fee. To learn more about transaction fees and whitelisting see [Whitelist].

```python
tx_hash = account.send_kin(new_keypair.public_address, amount=10, fee=100, memo_text='Hello World')
print('The transaction succeeded with hash {}'.format(tx_hash))
```

###### Output:

![](/img/HWPython/6_SendKinTxHash.png)

Check and print transaction details.

```
transaction = client.get_transaction_data(tx_hash=tx_hash)
# Raw print of the transaction information
transaction.operation = vars(transaction.operation)
print('\nThese are the details of the transaction we just executed sending Kin to our test account')
pprint(vars(transaction))
```

###### Output:

![](/img/HWPython/7_SendKinTxDetail.png)

Lastly, check the updated balance.

```
print('After the transaction the new balance is {}'.format(client.get_account_balance(new_keypair.public_address)))
```

# Conclusions
This was a very short introduction to the Kin SDK for Python. This SDK is meant to run on a server and be the interface between your client apps and the Kin Blockchain and it packs a lot more features such as channels.
