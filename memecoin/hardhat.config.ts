import hardhatToolboxMochaEthersPlugin from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import dotenv from "dotenv";
import { configVariable, defineConfig } from "hardhat/config";

// Carga las variables del archivo .env (nombre del token, RPCs, etc.).
dotenv.config({ quiet: true });

// La clave privada se lee de la variable de entorno DEPLOYER_PRIVATE_KEY o,
// mejor aún, del keystore cifrado de Hardhat:
//   npx hardhat keystore set DEPLOYER_PRIVATE_KEY
const deployer = configVariable("DEPLOYER_PRIVATE_KEY");

export default defineConfig({
  plugins: [hardhatToolboxMochaEthersPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      evmVersion: "cancun",
      optimizer: { enabled: true, runs: 200 },
    },
  },
  networks: {
    // Redes de prueba (usa estas primero; el ETH/BNB es gratis vía faucet).
    baseSepolia: {
      type: "http",
      chainType: "op",
      chainId: 84532,
      url: configVariable("BASE_SEPOLIA_RPC_URL", { default: "https://sepolia.base.org" }),
      accounts: [deployer],
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      chainId: 11155111,
      url: configVariable("SEPOLIA_RPC_URL", {
        default: "https://ethereum-sepolia-rpc.publicnode.com",
      }),
      accounts: [deployer],
    },
    bscTestnet: {
      type: "http",
      chainType: "generic",
      chainId: 97,
      url: configVariable("BSC_TESTNET_RPC_URL", {
        default: "https://bsc-testnet-rpc.publicnode.com",
      }),
      accounts: [deployer],
    },

    // Redes principales (dinero real).
    base: {
      type: "http",
      chainType: "op",
      chainId: 8453,
      url: configVariable("BASE_RPC_URL", { default: "https://mainnet.base.org" }),
      accounts: [deployer],
    },
    mainnet: {
      type: "http",
      chainType: "l1",
      chainId: 1,
      url: configVariable("MAINNET_RPC_URL", { default: "https://ethereum-rpc.publicnode.com" }),
      accounts: [deployer],
    },
    bsc: {
      type: "http",
      chainType: "generic",
      chainId: 56,
      url: configVariable("BSC_RPC_URL", { default: "https://bsc-dataseed.bnbchain.org" }),
      accounts: [deployer],
    },
  },
  verify: {
    etherscan: {
      // Una sola API key de Etherscan (API v2) sirve para Ethereum, Base y BNB Chain.
      apiKey: configVariable("ETHERSCAN_API_KEY"),
    },
  },
});
