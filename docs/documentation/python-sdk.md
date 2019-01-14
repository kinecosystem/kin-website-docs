---
id: python-sdk
title: Python SDK
---

![Kin Logo](kin.png)

# Kin SDK for Python
[![Build Status](https://travis-ci.org/kinecosystem/kin-core-python.svg?branch=master)](https://travis-ci.org/kinecosystem/kin-core-python) [![Coverage Status](https://codecov.io/gh/kinecosystem/kin-core-python/branch/master/graph/badge.svg)](https://codecov.io/gh/kinecosystem/kin-core-python)

The Kin SDK for Python is meant to be used as a back-end service for your client apps (iOS, Android, etc.) to connect to it. The SDK will take care of communicating with the Kin Blockchain to activate accounts, execute transactions, etc. It's up to you how to integrate the SDK in your overall architecture and managing server up-time.


## Disclaimer

This documentation is still incomplete. TODO:
- review general structure is aligned with other readme files
- review language
- check code samples and calls to the Kin SDK
- Ron to confirm min required version of Python
- remove all references to Stellar and replace with Kin Blockchain

## Requirements.

Make sure you have Python 3 >= 3.4

## Installation

```bash
pip install kin-sdk
```

## Overview

In this introduction we will look at a few basic operations on the Kin Blockchain and some features that are exclusive to the Kin SDK for Python.

You will find:

* Accessing the Kin blockchain
* Managing Kin accounts
* Executing transactions against Kin accounts
* Monitoring Kin Payments (unique to Python)
* Channels (unique to Python)


### Accessing the Kin blockchain

The SDK has two main components, `KinClient` and `KinAccount`.  
**KinClient** - Is used to query the blockchain and perform actions that don't require authentication (e.g get an account balance)  
**KinAccount** - Is used to perform authenticated actions on the blockchain (e.g Send payment)

To initialize the Kin Client you will need to provide an environment (Test and Production environments are pre-configured)


```python
from kin import KinClient, TEST_ENVIRONMENT

client = KinClient(TEST_ENVIRONMENT)
```

Or you can configure a custom environment with your own parameters:  
```python
from kin import Environment

MY_CUSTOM_ENVIRONMENT = Environemnt('name','horizon endpoint','network passphrase','friendbot url'(optional))
```

Once you have a KinClient, you can use it to get a KinAccount object.

The KinAccount object can be initialized in two ways:

```python
# With a single seed:
account = client.kin_account('seed')

# With channels:
account = client.kin_account('seed', channel_secret_keys=['seed1','seed2','seed3'...])

# Additionally, a unique app-id can be provided, this will be added to all your transactions
account = client.kin_account('seed',app_id='unique_app_id')
```
Read more about channels in the ["Channels" section](#Channels)

See [Going live with Kin]() learn more about what an appID is and how to get it.

### Checking configuration
The handy `get_config` method will return some parameters the client was configured with, along with Horizon status:
```python
status = client.get_config()
print status
{
  "horizon": {
    "uri": "https://horizon-playground.kininfrastructure.com",
    "online": true,
    "error": null
  },
  "sdk_version": "2.0.0",
  "environment": "PLAYGROUND",
  "kin_asset": {
    "code": "KIN",
    "issuer": "GBC3SG6NGTSZ2OMH3FFGB7UVRQWILW367U4GSOOF4TFSZONV42UJXUH7"
  },
  "transport": {
    "pool_size": 10,
    "request_timeout": 11,
    "backoff_factor": 0.5,
    "num_retries": 5,
    "retry_statuses": [
      503,
      413,
      429,
      504
    ]
  }
}
```
- `sdk_version` - the version of this SDK.
- `address` - the SDK wallet address.
- `kin_asset` - the KIN asset the SDK was configured with.
- `environment` - the environment the SDK was configured with (TEST/PROD/CUSTOM).
- `horizon`:
  - `uri` - the endpoint URI of the Horizon server.
  - `online` - Horizon online status.
  - `error` - Horizon error (when not `online`) .
- `transport`:
  - `pool_size` - number of pooled connections to Horizon.
  - `num_retries` - number of retries on failed request.
  - `request_timeout` - single request timeout.
  - `retry_statuses` - a list of statuses to retry on.
  - `backoff_factor` - a backoff factor to apply between retry attempts.


### Managing Kin accounts
Most methods provided by the KinClient to query the blockchain about a specific account, can also be used from the KinAccount object to query the blockchain about itself

#### Creating and retrieving a Kin account

The very first thing we need to do before you can send or receive Kin is creating an account on the blockchain. This is how you do it:

```python
# the KIN amount can be specified in numbers or as a string
tx_hash = account.create_account('address', starting_balance=1000, fee=100)

# a text memo can also be provided:
tx_hash = account.create_account('address', starting_balance=1000, fee=100, memo_text='Account creation example')
```

#### Account Details
 Each account on the Kin blockchain is composed of the public address and a secret seed (often also referred as public and private key).
```python
address = account.get_public_address()
```

#### Checking if an account exists on the blockchain
There is one thing you can do even without an account, it's checking if an account already existing on the blockchain.

```python
client.does_account_exists('address')
```

#### Account balance and data
Now that you have an account you can check its balance.

```python
balance = client.get_account_balance('address')
```

There is of course a lot more about an account besides its balance. You can get that information with `get_account_data`.

```python
account_data = client.get_account_data('address')
```

The output will look something like this:

```
{'_data':
  {
    'id': 'GDNGBE7S3ZHXAUAGSMVDNUM2FRTIRNDT3QHRMR5CVPI4YYSLL5ZUM2ME',
    'account_id': 'GDNGBE7S3ZHXAUAGSMVDNUM2FRTIRNDT3QHRMR5CVPI4YYSLL5ZUM2ME',
    'sequence': '15167341998374912',
    'data': {},
    'thresholds': 	_data='{
      'low_threshold': 0,
      'med_threshold': 0,
      'high_threshold': 0
    }',
    'balances': [	_data='{
      asset_type': 'native',
      'asset_code': None,
      'asset_issuer': None,
      'balance': 100.0,
      'limit': None
    }'],
    'flags': 	_data='{
      'auth_required': False,
      'auth_revocable': False
    }',
    'paging_token': '',
    'subentry_count': 0,
    'signers': [	_data='{
      'public_key': 'GDNGBE7S3ZHXAUAGSMVDNUM2FRTIRNDT3QHRMR5CVPI4YYSLL5ZUM2ME',
      'key': 'GDNGBE7S3ZHXAUAGSMVDNUM2FRTIRNDT3QHRMR5CVPI4YYSLL5ZUM2ME',
      'weight': 1,
      'signature_type':
      'ed25519_public_key'
    }']
  }
}
```

### Get account status
Often times you will want to know the status of an account, you can do this easily with `get_status`. The function expects a single parameter, boolean, if set to `True` all channels and statuses will be printed.

```python
account.get_status(True)
```

```json
{
  "client": {
    "sdk_version": "2.2.0",
    "environment": "LOCAL",
    "horizon": {
      "uri": "http://localhost:8000",
      "online": true,
      "error": null
    },
    "transport": {
      "pool_size": 10,
      "num_retries": 5,
      "request_timeout": 11,
      "retry_statuses": [
        503,
        413,
        429,
        504
      ],
      "backoff_factor": 0.5
    }
  },
  "account": {
    "app_id": "anon",
    "public_address": "GCLBBAIDP34M4JACPQJUYNSPZCQK7IRHV7ETKV6U53JPYYUIIVDVJJFQ",
    "balance": 9999989999199.979,
    "channels": {
      "total_channels": 5,
      "free_channels": 4,
      "non_free_channels": 1,
      "channels": {
        "SBS3O5BGCPDIYWTTOV7TGLXFRPFSD6ACBEAEHJUMMPF5DUDF732MX6LL": "free",
        "SC65CIJCAWJEJX5IVHDJK6FO6DM5BVPIUX5F7EULIC3C4PF7KTAUHHE2": "free",
        "SABWFQ2HOYPQGCWN7INIV2RNZZLAZDOX67R3VHMGQAFF6FA3JIA2E7BB": "free",
        "SBBQJTYF6K2TDUJ2LBUSXICUEEX75RXAQZRP6LLVF3JDXK5D4SVYX3X4": "taken",
        "SCD36QIV3SFEGZDHRZZXO7MICNMOHSRAOV6L2MQKSW4TO4OTCR4IF2FD": "free"
      }
    }
  }
}
```

#### Keypairs
Earlier we talked about public address and secret seed, here are a few convenient functions to generate the keypairs.

###### Create a new keypair
```python
from kin import Keypair

my_keypair = Keypair()
# Or, you can create a keypair from an existing seed
my_keypair = Keypair('seed')
```

###### Getting the public address from a seed
```python
public_address = Keypair.address_from_seed('seed')
```

###### Generate a new random seed
```python
seed = Keypair.generate_seed()
```

###### Generate a deterministic seed
```python
# Given the same seed and salt, the same seed will always be generated
seed = Keypair.generate_hd_seed('seed','salt')
```

###### Generate a mnemonic seed:
**Not implemented yet**

### Transactions
Transactions are executed on the Kin blockchain in a two-step process.

* **Build** the transaction, including calculation of the transaction hash. The hash is used as a transaction ID and is necessary to query the status of the transaction.
* **Send** the transaction to servers for execution on the blockchain.


#### Transferring Kin to another account
To transfer Kin to another account, you need the public address of the account to which you want to transfer Kin.

By default, your user will need to spend Fee to transfer Kin or process any other blockchain transaction. Fee for individual transactions are trivial (1 Fee = 10-5 Kin).

Some apps can be added to the Kin whitelist, a set of pre-approved apps whose users will not be charged Fee to execute transactions. If your app is in the whitelist then refer to transferring Kin to another account using whitelist service.

The snippet Transfer Kin will transfer 20 Kin to the recipient account "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO".


While the previous methods build and send the transaction for you, there is another way to send transactions

Step 1: Build the transaction
```python
destination = 'GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO'
builder = account.build_send_kin(destination, 1000, fee=100, memo_text='My first transaction on the Kin Blockchain')
```
Step 2: Update the transaction
```python
# Configure additional parameters
with account.channel_manager.get_channel() as channel:
    builder.set_channel(channel)
    builder.sign(channel)
    # If you used additional channels apart from your main account,
    # sign with your main account
    builder.sign(account.keypair.secret_seed)
```
Step 3: Send the transaction
```python
    tx_hash = account.submit_transaction(builder)
```

If you are pressed for time or you like your code to be compact you can execute the transaction in one line of code.
```python
# the KIN amount can be specified in numbers or as a string
tx_hash = account.send_kin('destination', 20, fee=100, memo_text='I like my transactions short')
```

#### Transferring Kin to another account using whitelist service
The Kin Blockchain also allows for transactions to be executed with no fee. Apps and services must first be approved, to learn more see [Going live with Kin](). If your service has been added to the whitelist you will be able to whitelist transactions for your clients.

Clients will send an http request to your Python app containing their transaction, you can then whitelist it and return it to the client to send to the blockchain.

```python
whitelisted_tx = account.whitelist_transaction(client_transaction)
```

Please note that if you are whitelisted, any payment sent from you (an app developed with the Python SDK) is already considered whitelisted, so there is no need for this step for the server transactions.

### Decode_transaction
When clients send you transactions for whitelisting they will be encoded. You can use `decode_transaction` to read and then verify the contents.

```python
from kin import decode_transaction

decoded_tx = decode_transaction(encoded_tx)
```

#### Getting the minimum acceptable fee from the blockchain
Transactions usually require a fee to be processed.
To know what is the minimum fee that the blockchain will accept, use:

```python
minimum_fee = client.get_minimum_fee()
```

#### Getting Transaction Data
Often times you will want to review a transaction, `get_transaction_data` is here to help you.

The function is pretty simple and expects a transaction hash and a second parameter called `simple`:
* **True** will return the object `kin.RawTransaction`, this is good for debugging and testing, but not for user messages
* **False** will return the object `kin.SimpleTransaction`, this is likely OK to be formatted and showed to end users. Notice: if the transaction if too complex to be simplified, a `CantSimplifyError` will be raised

```python
tx_data = sdk.get_transaction_data(tx_hash, True)
```

### Verify a transaction
This method provides an easy way to verify that a transaction is what you expect it to be. `verify_kin_payment` expects 6 parameters, the transaction hash, the sender's public address, the recipient's public address, the amount of the transaction, the memo (optional) and a boolean to say if you want to check the memo or not. The function returns a boolean.

Below you can see the outcome of a verification for a transaction in which addr1 paid 15 KIN to add2, with the memo 'Enjoy!'.

```python
client.verify_kin_payment('tx_hash','addr1','addr2',15,'Enjoy!',True) >> True
client.verify_kin_payment('tx_hash','addr1','addr2',15,'Hello',True) >> False
client.verify_kin_payment('tx_hash','addr1','addr2',15) >> True
client.verify_kin_payment('tx_hash','addr1','addr2',10) >> False
client.verify_kin_payment('tx_hash','addr1','addr3',10) >> False
```

### Friendbot
If a friendbot endpoint is provided when creating the environment (it is provided with the TEST_ENVIRONMENT), you will be able to use the friendbot method to call a service that will create an account for you

```python
client.friendbot('address')
```


## Monitoring Kin Payments
These methods can be used to monitor the Kin payment that an account or multiple accounts are sending or receiving.
**Currently, due to a bug on the blockchain frontend, the monitor may also return 1 tx that happened before the monitoring request**


The monitor will run in a background thread (accessible via `monitor.thread`), and will call the callback function every time it finds a kin payment for the given address.

### Monitor a single account
Monitoring a single account will continuously get data about this account from the blockchain and filter it.

```python
def callback_fn(address, tx_data, monitor)
	print ('Found tx: {} for address: {}'.format(address,tx_data.id))

monitor = client.monitor_account_payments('address', callback_fn)
```

### Monitor multiple accounts
Monitoring multiple accounts will continuously get data about **all** the selected accounts on the blockchain, and will filter it.

```python
def callback_fn(address, tx_data, monitor)
	print ('Found tx: {} for address: {}'.format(address,tx_data.id))

monitor = client.monitor_accounts_payments(['address1','address2'], callback_fn)
```

You can freely add or remove accounts to this monitor

```python
monitor.add_address('address3')
monitor.remove_address('address1')
```

### Stopping a monitor
When you are done monitoring, make sure to stop the monitor, to terminate the thread and the connection to the blockchain.

```python
monitor.stop()
```


## Channels

The Kin Blockchain is based on the the Stellar blockchain. One of the most sensitive points in Stellar is [transaction sequence](https://www.stellar.org/developers/guides/concepts/transactions.html#sequence-number).
In order for a transaction to be submitted successfully, this number should be correct. However, if you have several SDK instances, each working with the same wallet account or channel accounts, sequence collisions will occur.

We highly recommend to keep only one KinAccount instance in your application, having unique channel accounts.
Depending on the nature of your application, here are our recommendations:

1. You have a simple (command line) script that sends transactions on demand or only once in a while. In this case, the SDK can be instantiated with only the wallet key, the channel accounts are not necessary.

2. You have a single application server that should handle a stream of concurrent transactions. In this case, you need to make sure that only a single instance of a KinAccount initialized with multiple channel accounts.
This is an important point, because if you use a standard `gunicorn/Flask` setup for example, gunicorn will spawn several *worker processes*, each containing your Flask application, each containing your KinAccount instance, so multiple KinAccount instances will exist, having the same channel accounts. The solution is to use gunicorn *thread workers* instead of *process workers*, for example run gunicorn with `--threads` switch instead of `--workers` switch, so that only one Flask application is created, containing a single KinAccount instance.

3. You have a number of load-balanced application servers. Here, each application server should a) have the setup outlined above, and b) have its own channel accounts. This way, you ensure you will not have any collisions in your transaction sequences.

### Creating Channels
The kin sdk allows you to create HD (highly deterministic) channels based on your seed and a passphrase to be used as a salt. As long as you use the same seed and passphrase, you will always get the same seeds.

```
import kin.utils

channels = utils.create_channels(master_seed, environment, amount, starting_balance, salt)
```

`channels` will be a list of seeds the sdk created for you, that can be used when initializing the KinAccount object.

If you just wish to get the list of the channels generated from your seed + passphrase combination without creating them

```
channels = utils.get_hd_channels(master_seed, salt, amount)
```


## License
The code is currently released under [MIT license](LICENSE).


## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for SDK contributing guidelines.
