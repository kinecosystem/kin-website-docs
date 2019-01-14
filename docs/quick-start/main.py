"""Simple example of the kin-sdk usage"""
from pprint import pprint

import kin

# Init client
print('First we will create our KinClient object, and direct it to our test environment')
client = kin.KinClient(kin.TEST_ENVIRONMENT)
print('\nEnvironment: ')
pprint(vars(client.environment))

# Get keypair
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

# Check account status
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

# Get balance
print('We can use our KinAccount object to get our balance')
print('Our balance is {} KIN'.format(account.get_balance()))

# Create a different account
print('\nWe will now create a different account')
new_keypair = kin.Keypair()
print('Creating account: {}'.format(new_keypair.public_address))
tx_hash = account.create_account(new_keypair.public_address, starting_balance=1000, fee=100, memo_text='Example')
print('\nWe created the account and got the transaction id: {}'.format(tx_hash))

# Get info about a tx
print('\nWe can now use the client to get info about the transaction we did\n')
transaction = client.get_transaction_data(tx_hash=tx_hash)
# We don't have __str__ for the transaction class, so we print it like this till we add it
transaction.operation = vars(transaction.operation)
pprint(vars(transaction))

print('\nSince we created that account, we can now send kin to it')
tx_hash = account.send_kin(new_keypair.public_address, amount=10, fee=100, memo_text='Hello World')
print('The transaction succeeded with the hash {}'.format(tx_hash))

transaction = client.get_transaction_data(tx_hash=tx_hash)
# We don't have __str__ for the transaction class, so we print it like this till we add it
transaction.operation = vars(transaction.operation)
print('\nThese are the details of the transaction we just executed sending Kin to our test account')
pprint(vars(transaction))

print('\nNow we can check the balance of that account to see it\'s updated balance')
print('Updated balance is {}'.format(client.get_account_balance(new_keypair.public_address)))
