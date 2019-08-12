---
id: sdk	
title: Kin SDK for Python	
---

The Kin SDK for Python is meant to be used as a back-end service. It can perform actions for your client apps (iOS, Android, etc.) and also operate as a server for you to build services on top of the Kin blockchain. The SDK can, for example, take care of communicating with the Kin Blockchain on behalf of the client to create accounts and whitelist transactions. It can also monitor blockchain transactions so that you can implement broader services. It's up to you how to integrate the SDK in your overall architecture and managing server up-time.

## Requirements

Python 3.6 or higher

## Installation 

```bash
pip install kin-sdk
```

## Initialization

The SDK has two main components, KinClient and KinAccount.
**KinClient** - used to query the blockchain and perform actions that don't require authentication (e.g., Get account balance)
**KinAccount** - used to perform authenticated actions on the blockchain (e.g., Send payment)

### KinClient Initialization

To initialize KinClient, you need to specify an environment. There are 2 pre-configured environments: Test and Production.
The KinClient object can be used with a context manager, or closed manually, to close the connection to the blockchain.

```python
from kin import KinClient, TEST_ENVIRONMENT

async with KinClient(TEST_ENVIRONMENT) as client:
   ...

OR

client = KinClient(TEST_ENVIRONMENT)
try:
   ...
finally:
   client.close()

```

A custom environment can also be used:  
```python
from kin import Environment

MY_CUSTOM_ENVIRONMENT = Environemnt('name','horizon endpoint','network passphrase','friendbot url'(optional))
```
### KinObject Initialization 
Once you have a KinClient, you can use it to initialize a KinAccount object: 
A KinAccount object can be initizlied in two ways:
- With a single seed (private key):
```python
account = client.kin_account('seed')
```
- With channels:
```python
account = client.kin_account('seed', channel_secret_keys=['seed1','seed2','seed3'...])
```
- A unique app-id is provided for your application by the Kin Ecosystem. This ID will mark all your transactions and allow the Kin Ecosystem to track the Kin usage of your app.

```python
account = client.kin_account('seed',app_id='unique_app_id')
```
Read more about channels in the ["Channels" section](#Channels)
## Usage
### KinClient Usage

Most methods provided by KinClient to query the blockchain about a specific account can also be used from the KinAccount object to query the blockchain about itself.

#### Getting Account Balance
```python
# Get KIN balance
balance = await client.get_account_balance('address')
```

#### Getting Account Data
This method returns all the account data stored on the blockchain. 
```python
account_data = await client.get_account_data('address')
```

#### Checking If an Account Exists on the Blockchain
This method returns a True/False response.
```python
await client.does_account_exists('address')
```

#### Getting the Minimum Acceptable Fee from the Blockchain
Transactions usually require a fee to be processed. The fee depends on how fast the transaction will be processed by the blockchain. 
To find out what the minimum acceptable fee is, use:
```python
minimum_fee = await client.get_minimum_fee()
```

#### Getting Transaction Data
This method returns information about a specific transaction.
```python
tx_data = await sdk.get_transaction_data(tx_hash, simple=True/False)
```
The 'simple' flag is enabled by default and determines what object will be returned.
If simple=False: A 'kin.RawTransaction' object is returned. It contains some fields that may be confusing and of no use to the user.

If simple=True: A 'kin.SimpleTransaction' object is returned. It contains only the data that the user needs:
- Sender
- Destination
- Amount
- Memo
- Timestamp

However, in the following cases the transaction cannot be simplified:
- The transaction contains a memo that is not a text memo.
- The transaction contains multiple operations.
- The transaction contains a payment that is not of KIN.
- Its operation type is neither 'Payment' nor 'Create account'.
In the above cases, if the ‘simple’flag is set to True, an error will be returned (CantSimplifyError).
However, given the use case of our blockchain and the tools that we currently provide to interact with it, these conditions should not usually occur.

#### Checking Configuration
The handy `get_config` method returns some parameters (see the code sample below) the client was configured with, along with Horizon status:
```python
status = client.get_config()
```

```json
    {
  "sdk_version": "2.4.0",
  "environment": "TEST",
  "horizon": {
    "uri": "https://horizon-testnet.kininfrastructure.com",
    "online": true,
    "error": null
  },
  "transport": {
    "pool_size": 100,
    "num_retries": 3,
    "request_timeout": 11,
    "backoff_factor": 0.5
  }
}
```
Where
- `sdk_version` - the version of this SDK
- `environment` - the environment the SDK was configured with (TEST/PROD/CUSTOM)
- `horizon`:
  - `uri` - the endpoint URI of the Horizon server
  - `online` - Horizon online status
  - `error` - Horizon error (when not `online`) 
- `transport`:
  - `pool_size` - number of pooled connections to Horizon
  - `num_retries` - number of retries on failed request
  - `request_timeout` - single request timeout
  - `backoff_factor` - a backoff factor to apply between retry attempts


#### Friendbot
Friendbot is a service that creates an account. A friendbot endpoint is provided with the TEST_ENVIRONMENT.

```python
await client.friendbot('address')
```


### Account Usage

#### Getting Account Details
This method returns the public address of an account. The address is derived from the seed (private key) the account was created with.
```python
address = account.get_public_address()
```

#### Creating a New Account
This method creates a new account; it can be used in both the Test and Production environments.
The KIN amount can be specified in numbers or as a string.
```python
tx_hash = await account.create_account('address', starting_balance=1000, fee=100)
```
A text memo can also be added (it will appear in the account creation transaction):
```python
tx_hash = await account.create_account('address', starting_balance=1000, fee=100, memo_text='Account creation')
```
The transaction hash (txid) will be returned. 

#### Sending KIN
This method # sends KIN to a specified destination.
The KIN amount can be given in numbers or as a string.
```python
tx_hash = await account.send_kin('destination', 1000, fee=100, memo_text='order123')
```
The transaction hash (txid) will be returned.

#### Build/Submit Transactions
While the previous above methods build and send the transactions for you, there is another way to send transactions. It can be useful if you want to get the transaction ID before actually performing the transaction.

Step 1: Build the transaction
```python
builder = account.build_send_kin('destination', 1000, fee=100, memo_text='order123')
```
Step 2: Update the transaction
```python
# do whatever you want with the builder
async with account.channel_manager.get_channel() as channel:
    await builder.set_channel(channel)
    builder.sign(channel)
    # If you used additional channels apart from your main account,
    # sign with your main account
    builder.sign(account.keypair.secret_seed)
```
Step 3: Send the transaction
```python
    tx_hash = await account.submit_transaction(builder)
```

#### Whitelist a Transaction
Assuming you are registered with the Kin Ecosystem as a whitelisted digital service (exact details TBD), you can whitelist transactions for your clients, so that they are not charged the fees.
Your clients will send you HTTP requests containing their transaction.
You can then whitelist them and return them to the clients to send to the blockchain.
```python
whitelisted_tx = account.whitelist_transaction(client_transaction)

# By default, any payment sent from you is already considered whitelisted,
# so there is no need for this step for server transactions.
```

#### Get Account Status
This method gets the status and configuration of the account.
If verbose is set to True, all channels and statuses will be printed.
```python
account.get_status(verbose=False/True)
```

```json
{
  "client": {
    "sdk_version": "2.4.0",
    "environment": "TEST",
    "horizon": {
      "uri": "https://horizon-testnet.kininfrastructure.com",
      "online": true,
      "error": null
    },
    "transport": {
      "pool_size": 100,
      "num_retries": 3,
      "request_timeout": 11,
      "backoff_factor": 0.5
    }
  },
  "account": {
    "app_id": "anon",
    "public_address": "GBQLWHAH5BRB3PTJEXIKGKI3YYM2DJI32ZOZBR4O5WE7FE2GNSUTF6RP",
    "balance": 10000,
    "channels": {
      "total_channels": 5,
      "free_channels": 4,
      "non_free_channels": 1,
      "channels": {
        "SBRHUVGBCXDM2HDSTQ5Y5QLMBCTOTK6GIQ4PDZIMCD3SG3A7MU22ASRV": "free",
        "SA6XIHKGWVGUNOWUPCEA2SWBII5JEHK7Q54I2ESZ42NKUX5NYNXPTA4P": "free",
        "SB57K5N2JUVXBF3S56OND4WXLZAXMBB7WFV5E5ZQTHOGQQTGCY4ZBWGL": "free",
        "SCFXWAXZHM3OJA5XJNW4MIDPRYZHTECXJEOYY5O6JJB523M32OJXD756": "taken",
        "SA6YK4SR2KS2RXV7SN6HFVXNO44AA7IQTZ7QKWAWS6TPJ2NCND2JMLY3": "free"
      }
    }
  }
}
```

## Transactions
This method is relevant to transactions.

### Decode Transaction
When the client sends you a transaction for whitelisting, it will be encoded.
It is recommended to decode each transaction and verify its details before whitelisting it. To do that:

```python
from kin import decode_transaction

decoded_tx = decode_transaction(encoded_tx)
```

## Keypair
This set of methods allows you to create new keypairs.

### Create a New Keypair
From Kin import keypair:

```python
my_keypair = Keypair()
```
From an existing seed:
```python
my_keypair = Keypair('seed')
```

### Getting the Public Address from a Seed
```python
public_address = Keypair.address_from_seed('seed')
```

### Generate a New Random Seed
```python
seed = Keypair.generate_seed()
```

### Generate a Deterministic Seed
Given the same seed and salt, the same seed will always be generated.
```python
seed = Keypair.generate_hd_seed('seed','salt')
```

## Monitoring Kin Payments
These methods can be used to monitor Kin payments that an account or accounts is sending/receiving.
### Monitor a Single Account
This method continuously receives data about a particular account from the blockchain.
An additional "timeout" parameter can be passed to raise a "TimeoutError" if too much time passes between transactions.
```python
async for tx in client.monitor_account_payments('address'):
   ...
```

### Monitor Multiple Accounts
This method continuously receives data about **all** accounts on the blockchain, and you can specify which accounts you want to monitor.
Since this monitor receives a set of addresses, you can freely add/remove address to/from it at any point.
```python
addresses = set(['address1','address2'])
async for address, tx in client.monitor_accounts_payments(addresses):
   ...
```

## Channels

One of the most sensitive points in Stellar is [transaction sequence](https://www.stellar.org/developers/guides/concepts/transactions.html#sequence-number).
For a transaction to be submitted successfully, its sequence number should be correct. However, if you have several 
SDK instances, each working with the same account or channel accounts, sequence collisions will occur. 
 
We highly recommend to keep only one KinAccount instance in your application and to have unique channel accounts.
Depending on the nature of your application, here are our recommendations:

1. You have a simple (command line) script that sends transactions on demand or only once in a while. 
In this case, the SDK can be instantiated with only the wallet key, and the channel accounts are not necessary.

2. You have a single application server that handles a stream of concurrent transactions. In this case, 
you need to make sure that only a single instance of a KinAccount is initialized with multiple channel accounts.

3. You have a number of load-balanced application servers. Each application server should have the setup outlined
above and its own channel accounts. This way, you ensure that there are no collisions in your transaction
sequences.

### Creating Channels
The Kin SDK allows you to create HD (highly deterministic) channels based on your seed and a passphrase to be used as a salt.
As long as you use the same seed and passphrase, you will always get the same list of seeds.

```
import kin.utils

channels = utils.create_channels(master_seed, environment, amount, starting_balance, salt)

# "channels" will be a list of seeds the sdk created for you, that can be used when initializing the KinAccount object.
```
If you just wish to get the list of the channels generated from your seed + passphrase combination without creating them
```python
channels = utils.get_hd_channels(master_seed, salt, amount)
```


## License

This repository is licensed under the [Kin Ecosystem SDK License](https://github.com/kinecosystem/kin-sdk-python/blob/v2-master/LICENSE.pdf).


## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for SDK contributing guidelines. 
