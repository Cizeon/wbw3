import hre from "hardhat";

const main = async () => {
  await hre.ethers.provider.ready;
  const [deployer] = await hre.ethers.getSigners();
  let balance = await deployer.getBalance();
  console.log(`[+] Deployer balance: ${balance.toString()}`);

  /* Deploy the smart contract */
  const rsvpContractFactory = await hre.ethers.getContractFactory("Web3RSVP");
  const rsvpContract = await rsvpContractFactory.deploy();
  await rsvpContract.deployed();
  console.log("Contract deployed to:", rsvpContract.address);

  balance = await deployer.getBalance();
  console.log(`[+] Deployer balance: ${balance.toString()}`);

  // try {
  //   await run("verify:verify", {
  //     address: rsvpContract.address,
  //     contract: "contracts/Web3RSVP.sol:Web3RSVP",
  //   });
  // } catch {
  //   console.log("Verification problem (Web3RSVP)");
  // }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
