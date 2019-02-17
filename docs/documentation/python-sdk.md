---
id: python-sdk
title: Kin SDK for Python
---

The Kin SDK for Python is meant to be used as a back-end service. It can perform actions for your client apps (iOS, Android, etc.) and also operate as a server for you to build services on top of the Kin blockchain. The SDK, can for example, take care of communicating with the Kin Blockchain on behalf of the client to create accounts and whitelist transactions. It can also monitor blockchain transactions so that you can implement broader services. It's up to you how to integrate the SDK in your overall architecture and managing server up-time.

## Requirements.

Make sure you have Python 3 >= 3.4 [Don't push this line, but in your travis-cli you only test for python 3.6, but have here python 3.4 and above. I would add this to your travis-cli]

## Installation

```bash
$ pip install kin-sdk
```

Track the development of this SDK on [GitHub](https://github.com/kinecosystem/kin-sdk-python/tree/v2-master).

## Overview

In this introduction we will look at a few basic operations on the Kin Blockchain and some features that are exclusive to the Kin SDK for Python.

You will find:

* Accessing the Kin blockchain
* Managing Kin accounts
* Executing transactions against Kin accounts
* Monitoring Kin Payments (Python SDK can monitor all accounts)
* Channels (unique to the Python SDK)


### Accessing the Kin blockchain

The SDK has two main components, `KinClient` and `KinAccount`.  

- **KinClient** - Is used to query the blockchain and perform actions that don't require authentication (e.g get an account -balance)  
- **KinAccount** - Is used to perform authenticated actions on the blockchain (e.g Send payment)

To initialize the Kin Client, you will need to provide an environment (Test and Production environments are pre-configured)

[Don't push, but no where in your sdk python documentation to I found about importing "TEST_ENVIRONMENT". I assume the production env is "PRODUCTION ENVIRONMENT" , looking at this link: https://kinecosystem.github.io/kin-website-docs/api-ref/python-sdk/_source/kin.html#. Maybe I just can't find it. I do find "import Environment" but not "TEST_ENVIRONMENT" https://kinecosystem.github.io/kin-website-docs/api-ref/python-sdk/_source/kin.blockchain.html#module-kin.blockchain.environment.]

[Don't push, but also include a link to learning more about Environments. You hyperlink "you can find it here, but don't do it for places here and there. fix consistency issue"]

```python
from kin import KinClient, TEST_ENVIRONMENT

client = KinClient(TEST_ENVIRONMENT)
```

Or you can configure a custom environment with your own parameters:  
```python
from kin import Environment

MY_CUSTOM_ENVIRONMENT = Environment('name', 'horizon endpoint', 'network passphrase', 'friendbot url'(optional))
```

Once you have a KinClient, you can use it to get a KinAccount object and its associated keypair. The Kin Python SDK generates a keypair based on a secret `seed`. There is a unique relationship between seed and keypair; if you save a secret seed you can regenerate the associated keypair.

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

[Don't push this, but if the JSON is outdated, update it?] 

```python
# Disclaimer: the below JSON is outdated
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

Most methods provided by the KinClient to query the blockchain about a specific account, can also be used from the KinAccount object to query the blockchain about itself.

[Don't push, hyperlink this https://kinecosystem.github.io/kin-website-docs/api-ref/python-sdk/_source/kin.html#module-kin.account.]

#### Creating and retrieving a Kin account

The very first thing we need to do before you can send or receive Kin is creating an account on the blockchain. This is how you do it:

```python
# the Kin amount can be specified in numbers or as a string
tx_hash = account.create_account('address', starting_balance=1000, fee=100)

# a text memo can also be added; memos cannot exceed 21 characters:
tx_hash = account.create_account('address', starting_balance=1000, fee=100, memo_text='My first account')
```

#### Account Details

 Each account on the Kin blockchain has a public address. The address is identical to the public portion of the keypair created during account creation.

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

There is a lot more about an account besides its balance. You can get that information with `get_account_data`.

```python
account_data = client.get_account_data('address')
```

The output will look something like this:

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 

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

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 

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

Earlier we talked about the relationship between keypairs and secret seeds. Here are a few associated functions.

###### Creating a new keypair

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

By default, your user will need to spend Fee to transfer Kin or process any other blockchain transaction. Fee for individual transactions are trivial 1 Kin = 10E5 Fee.

Some apps can be added to the Kin whitelist, a set of pre-approved apps whose users will not be charged Fee to execute transactions. If your app is in the whitelist then refer to transferring Kin to another account using whitelist service.

The snippet Transfer Kin will transfer 20 Kin to the recipient account "GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO".


In most cases you will want to prepare your parameters ahead of time and execute a transaction in one line, here's how to do it:

```python
# the KIN amount can be specified in numbers or as a string
tx_hash = account.send_kin('destination', 20, fee=100, memo_text='Thank you Kin')
```

If for some reason you need to split the process in multiple steps you can first build the transaction, update any parameters and then execute. Although this is possible in most cases you will not want to do it this way.

Step 1: Build the transaction

```python
destination = 'GDIRGGTBE3H4CUIHNIFZGUECGFQ5MBGIZTPWGUHPIEVOOHFHSCAGMEHO'
builder = account.build_send_kin(destination, 1000, fee=100, memo_text='tx in 3-steps')
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

[Don't push, but shouldn't you show how the transaction looks if it succeeded? Like the raw json output like the accounts you showed up there? I feel like the transaction is one of the most important parts] 

#### Transferring Kin to another account using whitelist service

The Kin Blockchain also allows for transactions to be executed with no fee. Apps and services must first be approved, to learn more see [Going live with Kin](). If your service has been added to the whitelist, you will be able to whitelist transactions for your clients.

Clients will send an http request to your Python app containing their transaction. You can then whitelist it and return it to the client to send to the blockchain.

```python
whitelisted_tx = account.whitelist_transaction(client_transaction)
```

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 

Please note that if you are whitelisted, any payment sent from you (an app developed with the Python SDK) is already considered whitelisted, so there is no need for this step for the server transactions.

### Decode_transaction

When clients send you transactions for whitelisting they will be encoded. You can use `decode_transaction` to read and then verify the contents.

```python
from kin import decode_transaction

decoded_tx = decode_transaction(encoded_tx)
```

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 

#### Getting the minimum acceptable fee from the blockchain

Transactions usually require a fee to be processed.
To know what is the minimum fee that the blockchain will accept, use:

```python
minimum_fee = client.get_minimum_fee()
```

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 


#### Getting Transaction Data

Often times you will want to review a transaction, `get_transaction_data` is here to help you.

The function is pretty simple and expects a transaction hash and a second parameter called `simple`:

[Don't push, but what does 'simple' mean? Isn't this just a boolean?]

* **True** will return the object `kin.RawTransaction`, this is good for debugging and testing, but not for user messages
* **False** will return the object `kin.SimpleTransaction`, this is likely OK to be formatted and showed to end users. Notice: if the transaction if too complex to be simplified, a `CantSimplifyError` will be raised

```python
tx_data = sdk.get_transaction_data(tx_hash, True)
```

[Don't push this, but in your get config example above, you talk about what each json pair means, but in later examples you don't. Please fix the consistency issues] 

### Friendbot

[Don't push, but hyperlink this https://kinecosystem.github.io/kin-website-docs/docs/friendbot]

If a friendbot endpoint is provided when creating the environment (it is provided with the TEST_ENVIRONMENT [Don't push, but add link to Friendbot example]), you will be able to use the friendbot method to call a service that will create an account for you

```python
client.friendbot('address')
```

## Monitoring Kin Payments

These methods can be used to monitor the Kin payment that an account or multiple accounts are sending or receiving.

SDKs designed for client apps such as iOS and Android can monitor the accounts associated with their local users, the Python SDK can monitor other users' accounts. This is currently unique the the Python SDK.
**Currently, due to a bug on the blockchain frontend, the monitor may also return 1 tx that happened before the monitoring request**


The monitor will run in a background thread (accessible via `monitor.thread`), and will call the callback function every time it finds a Kin payment for the given address.

### Monitor a single account

[Don't push add link to monitors in python sdk: https://kinecosystem.github.io/kin-website-docs/api-ref/python-sdk/_source/kin.html#module-kin.monitors] 

Monitoring a single account will continuously get data about this account from the blockchain and filter it.

```python
def callback_fn(address, tx_data, monitor)
	print ('Found tx: {} for address: {}'.format(address,tx_data.id))

monitor = client.monitor_account_payments('address', callback_fn)
```

### Monitor multiple accounts
It is possible to monitor multiple accounts using `monitor_accounts_payments`, the function will continuously get data about **all** accounts on the blockchain, and will filter for the selected accounts.

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

We highly recommend to keep only one KinAccount instance in your application, [Don't push, but this is a weird sentence. You add "having unique channel accounts" out of no where? Is this a unfinished sentence?] having unique channel accounts.

Depending on the nature of your application, here are our recommendations:

1. You have a simple (command line) script that sends transactions on demand or periodically. In this case, the SDK can be instantiated with only the wallet key, the channel accounts are not necessary.

2. You have a single application server that should handle a stream of concurrent transactions. In this case, you need to make sure that only a single instance of a KinAccount is initialized with multiple channel accounts.
This is an important point, because if you use a standard `gunicorn/Flask` setup for example, gunicorn will spawn several *worker processes*, each containing your Flask application, each containing your KinAccount instance, so multiple KinAccount instances will exist, having the same channel accounts. The solution is to use gunicorn *thread workers* instead of *process workers*, for example run gunicorn with `--threads` switch instead of `--workers` switch, so that only one Flask application is created, containing a single KinAccount instance.

3. You have a number of load-balanced application servers. Here, each application server should 
- a) have the setup outlined above, and 
- b) have its own channel accounts. This way, you ensure you will not have any collisions in your transaction sequences.

### Creating Channels

The Kin SDK allows you to create HD (highly deterministic) channels based on your seed and a passphrase to be used as a salt. As long as you use the same seed and passphrase, you will always get the same seeds.

```
import kin.utils

channels = utils.create_channels(master_seed, environment, amount, starting_balance, salt)
```

`channels` will be a list of seeds the sdk created for you, that can be used when initializing the KinAccount object.

If you just wish to get the list of the channels generated from your seed and passphrase combination without creating them

```
channels = utils.get_hd_channels(master_seed, salt, amount)
```

[Don't push, but in your repo you have test cases? Shouldn't you add them here on how to test them?. You have docker compose in your test cases, but you don't ask the user to install docker compose or docker for that matter. ]

[Don't push, but also you should release a docker image for development if you already made one for tests. this would be helpful with flask apps and spinning them up easy for development]

[Don't push, but also you should take all the examples in this documentation and make example code that people can run without copy and pasting in a python file.]

[Dont' push also add a reference to this hello world example https://kinecosystem.github.io/kin-website-docs/docs/quick-start/hi-kin-python.]

## License
The code is currently released under [MIT license](LICENSE).
