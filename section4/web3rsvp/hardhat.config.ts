import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-gas-reporter";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";

const POLYGON_ENDPOINT = process.env.POLYGON_ENDPOINT || "";
const MUMBAI_ENDPOINT = process.env.MUMBAI_ENDPOINT || "";

const POLYGONSCAN_KEY = process.env.POLYGONSCAN_KEY || "";

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x...";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: { version: "0.8.9", settings: { optimizer: { enabled: true, runs: 200 } } },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: { chainId: 1337 },
    polygon: {
      url: POLYGON_ENDPOINT,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: MUMBAI_ENDPOINT,
      accounts: [PRIVATE_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      polygon: POLYGONSCAN_KEY,
      polygonMumbai: POLYGONSCAN_KEY,
    },
  },
};

export default config;
