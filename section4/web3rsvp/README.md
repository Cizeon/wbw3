This is section 4 of the 30 Days of Web3 course: https://www.30daysofweb3.xyz/en/curriculum/4-deploying-your-smart-contract/3-checkpoint
This course was offered by https://www.womenbuildweb3.com/#30dw3.

# Mumbai Deployment

- Contract deployed at address:0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6
- Polygonscan: https://mumbai.polygonscan.com/address/0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6#code

# Notes

- I used hardhat with TypeScript to complete this section.
- I created a scripts folder and wrote a test script using chai: see test/index.ts.
- I tried to cover as much as possible in the test case.

I found a bug in the smart contract. It does not check if an event already exists.
See scripts/exploit.ts for a proof-of-concept.
If someone creates an event and someone subscribes. If the event owner creates the same event again (same parameters), all attendee's money is lost forever since confirmedRSVPs is reset.

I fixed it this way:

```solidity
    bytes32 eventId = keccak256(abi.encodePacked(msg.sender, address(this), eventTimestamp, deposit, maxCapacity));
    require(idToEvent[eventId].eventTimestamp == 0, "ALREADY REGISTERED");
```

I found a second bug there:

```solidity
    // if this fails
    if (!sent) {
      myEvent.paidOut == false;
    }
```

it should be

```solidity
      myEvent.paidOut = false;
```

# Compile

```console
$ hh compile
Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 6 typings!
Compiled 1 Solidity file successfully
```

# Testing

```console
$ hh test

  Web3RSVP
    createNewEvent()
      ✓ should emit a NewEventCreated event
      ✓ should fail to overwrite an event
      ✓ should create the correct event id
      ✓ should set the correct values to the event
      createNewRSVP()
        ✓ should emit a NewRSVP event
        ✓ should not register to an event that does not exist
        ✓ should only accept deposits of the correct amount
        ✓ should confirm all attendees
        ✓ should emit a ConfirmedAttendee event
        ✓ should not be confirmed by someone else than the event owner
        ✓ should not confirm someone not part of the event
        ✓ should not confirm someone twice
        ✓ should not be paid out before the event date
        ✓ should be paid out before the event date + delay
        ✓ should be paid back
        ✓ should to register to and event that is over
        ✓ should not be paid out if not the owner

·------------------------------------------|---------------------------|-------------|-----------------------------·
|           Solc version: 0.8.9            ·  Optimizer enabled: true  ·  Runs: 200  ·  Block limit: 30000000 gas  │
···········································|···························|·············|······························
|  Methods                                                                                                         │
·············|·····························|·············|·············|·············|···············|··············
|  Contract  ·  Method                     ·  Min        ·  Max        ·  Avg        ·  # calls      ·  usd (avg)  │
·············|·····························|·············|·············|·············|···············|··············
|  Web3RSVP  ·  confirmAllAttendees        ·          -  ·          -  ·     143081  ·            2  ·          -  │
·············|·····························|·············|·············|·············|···············|··············
|  Web3RSVP  ·  confirmAttendee            ·      89101  ·      89113  ·      89107  ·            4  ·          -  │
·············|·····························|·············|·············|·············|···············|··············
|  Web3RSVP  ·  createNewEvent             ·          -  ·          -  ·     212198  ·           20  ·          -  │
·············|·····························|·············|·············|·············|···············|··············
|  Web3RSVP  ·  createNewRSVP              ·      59651  ·      74152  ·      72539  ·           18  ·          -  │
·············|·····························|·············|·············|·············|···············|··············
|  Web3RSVP  ·  withdrawUnclaimedDeposits  ·          -  ·          -  ·      48195  ·            2  ·          -  │
·············|·····························|·············|·············|·············|···············|··············
|  Deployments                             ·                                         ·  % of limit   ·             │
···········································|·············|·············|·············|···············|··············
|  Web3RSVP                                ·          -  ·          -  ·    1149122  ·        3.8 %  ·          -  │
·------------------------------------------|-------------|-------------|-------------|---------------|-------------·

  17 passing (1s)
```

# Deploy

```console
$ hh run scripts/deploy.ts --network mumbai
[+] Deployer balance: 400000000000000000
Contract deployed to: 0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6
[+] Deployer balance: 390807024000000000
$ hh verify --network mumbai 0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6
Nothing to compile
No need to generate any newer typings.
Successfully submitted source code for contract
contracts/Web3RSVP.sol:Web3RSVP at 0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6
for verification on the block explorer. Waiting for verification result...

Successfully verified contract Web3RSVP on Etherscan.
https://mumbai.polygonscan.com/address/0xd0aA26df1F1142b713c67FE55ceeebE2AA9cd7C6#code
```
