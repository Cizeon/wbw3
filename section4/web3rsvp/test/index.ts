import { expect } from "chai";
import { Contract } from "ethers";
import hre from "hardhat";

describe("Web3RSVP", () => {
  let rsvpContract: Contract;
  let owner: any;
  let account1: any;
  let account2: any;

  beforeEach(async () => {
    const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
    rsvpContract = await rsvpContractFactory.deploy();
    await rsvpContract.deployed();
    [owner, account1, account2] = await hre.ethers.getSigners();
  });

  describe("createNewEvent()", async () => {
    const maxCapacity = 3;
    let timestamp = 1718926200;
    const eventDataCID = "bafybeibhwfzx6oo5rymsxmkdxpmkfwyvbjrrwcl7cekmbzlupmp5ypkyfi";
    let wait: any;
    let txn: any;
    let deposit: any;
    let eventId: any;

    beforeEach(async () => {
      deposit = hre.ethers.utils.parseEther("1");
      txn = await rsvpContract.createNewEvent(timestamp, deposit, maxCapacity, eventDataCID);
      eventId = hre.ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256"],
        [owner.address, rsvpContract.address, timestamp, deposit, maxCapacity],
      );
    });

    it("should emit a NewEventCreated event", async () => {
      await expect(rsvpContract.createNewEvent(timestamp + 1, deposit, maxCapacity, eventDataCID)).to.emit(
        rsvpContract,
        "NewEventCreated",
      );
    });

    it("should fail to overwrite an event", async () => {
      await expect(rsvpContract.createNewEvent(timestamp, deposit, maxCapacity, eventDataCID)).to.be.revertedWith(
        "ALREADY REGISTERED",
      );
    });

    it("should create the correct event id", async () => {
      wait = await txn.wait();
      expect(wait.events![0].args!.eventID).to.equal(eventId);
    });

    it("should set the correct values to the event", async () => {
      let event = await rsvpContract.idToEvent(eventId);
      expect(event.eventTimestamp).to.equal(timestamp);
      expect(event.deposit).to.equal(deposit);
      expect(event.maxCapacity).to.equal(maxCapacity);
      expect(event.eventDataCID).to.equal(eventDataCID);
    });

    describe("createNewRSVP()", async () => {
      it("should emit a NewRSVP event", async () => {
        await expect(rsvpContract.createNewRSVP(eventId, { value: deposit })).to.emit(rsvpContract, "NewRSVP");
      });

      it("should not register to an event that does not exist", async () => {
        let fake_event = hre.ethers.utils.solidityKeccak256(
          ["address", "address", "uint256", "uint256", "uint256"],
          [account1.address, rsvpContract.address, timestamp, deposit, maxCapacity],
        );

        await expect(rsvpContract.createNewRSVP(fake_event, { value: deposit })).to.be.revertedWith("NOT ENOUGH");
      });

      it("should only accept deposits of the correct amount", async () => {
        await expect(rsvpContract.createNewRSVP(eventId, { value: 0 })).to.be.revertedWith("NOT ENOUGH");
        await expect(
          rsvpContract.createNewRSVP(eventId, { value: hre.ethers.utils.parseEther("2") }),
        ).to.be.revertedWith("NOT ENOUGH");
      });

      it("should confirm all attendees", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );
        await expect(rsvpContract.connect(account2).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        const tx = await rsvpContract.confirmAllAttendees(eventId);
        const wait = await tx.wait();

        expect(wait.events[0].args.attendeeAddress).to.equal(account1.address);
        expect(wait.events[1].args.attendeeAddress).to.equal(account2.address);
      });

      it("should emit a ConfirmedAttendee event", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.confirmAttendee(eventId, account1.address)).to.emit(
          rsvpContract,
          "ConfirmedAttendee",
        );
      });

      it("should not be confirmed by someone else than the event owner", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.connect(account1).confirmAllAttendees(eventId)).to.be.revertedWith("NOT AUTHORIZED");
      });

      it("should not confirm someone not part of the event", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.confirmAttendee(eventId, account2.address)).to.be.revertedWith("NO RSVP TO CONFIRM");
      });

      it("should not confirm someone twice", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.confirmAttendee(eventId, account1.address)).to.not.be.reverted;
        await expect(rsvpContract.confirmAttendee(eventId, account1.address)).to.be.revertedWith("ALREADY CLAIMED");
      });

      it("should not be paid out before the event date", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.withdrawUnclaimedDeposits(eventId)).to.be.revertedWith("TOO EARLY");
      });

      it("should be paid out before the event date + delay", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.emit(
          rsvpContract,
          "NewRSVP",
        );

        await expect(rsvpContract.withdrawUnclaimedDeposits(eventId)).to.be.revertedWith("TOO EARLY");
      });

      /* We cannot go back in the past :-( 
         We are in the future after that. */
      it("should be paid back", async () => {
        await hre.network.provider.send("evm_increaseTime", [15778800000000]);
        await expect(rsvpContract.withdrawUnclaimedDeposits(eventId)).to.emit(rsvpContract, "DepositsPaidOut");
      });

      it("should to register to and event that is over", async () => {
        await expect(rsvpContract.connect(account1).createNewRSVP(eventId, { value: deposit })).to.be.revertedWith(
          "ALREADY HAPPENED",
        );
      });

      it("should not be paid out if not the owner", async () => {
        await expect(rsvpContract.connect(account1).withdrawUnclaimedDeposits(eventId)).to.be.revertedWith(
          "MUST BE EVENT OWNER",
        );
      });
    });
  });
});
