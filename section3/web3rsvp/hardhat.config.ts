import "dotenv/config";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const RINKEBY_ENDPOINT = `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_TOKEN}`;
const POLYGON_ENDPOINT = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_TOKEN}`;

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x...";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  solidity: "0.8.9",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    rinkeby: {
      url: RINKEBY_ENDPOINT,
      accounts: [PRIVATE_KEY],
    },
    polygon: {
      url: POLYGON_ENDPOINT,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
