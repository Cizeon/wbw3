This is section 3 of the 30 Days of Web3 course: https://www.30daysofweb3.xyz/en/curriculum/3-writing-your-smart-contract/6-checkpoint
This course was offered by https://www.womenbuildweb3.com/#30dw3.

# Compile

```console
$ npx hardhat compile
Generating typings for: 1 artifacts in dir: typechain-types for target: ethers-v5
Successfully generated 6 typings!
Compiled 1 Solidity file successfully
```

# Test

```console
$ npx hardhat run scripts/run.ts
Contract deployed to: 0x8B108C0916393c925c9985F4B3Ee26503536e8ad
NEW EVENT CREATED: NewEventCreated [
  '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  BigNumber { value: "1718926200" },
  BigNumber { value: "3" },
  BigNumber { value: "1000000000000000000" },
  'bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi',
  eventID: '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  creatorAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  eventTimestamp: BigNumber { value: "1718926200" },
  maxCapacity: BigNumber { value: "3" },
  deposit: BigNumber { value: "1000000000000000000" },
  eventDataCID: 'bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi'
]
EVENT ID: 0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738
NEW RSVP: NewRSVP [
  '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  eventID: '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  attendeeAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
]
NEW RSVP: NewRSVP [
  '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  eventID: '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  attendeeAddress: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
]
NEW RSVP: NewRSVP [
  '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
  eventID: '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  attendeeAddress: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
]
CONFIRMED: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
CONFIRMED: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
CONFIRMED: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
WITHDRAWN: DepositsPaidOut [
  '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738',
  eventID: '0xe7780ffa0e52df280b2ef1e1d92fe2032e9ad8c2a1837fd3e5cd34133538b738'
]
```
