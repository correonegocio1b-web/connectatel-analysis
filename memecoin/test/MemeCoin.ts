import { expect } from "chai";
import { network } from "hardhat";

const { ethers, networkHelpers } = await network.create();

const NAME = "Ping Doge";
const SYMBOL = "PING";
const SUPPLY = 1_000_000_000n;
const SUPPLY_WEI = ethers.parseUnits(SUPPLY.toString(), 18);

describe("MemeCoin", function () {
  async function deployFixture() {
    const [deployer, alice, bob] = await ethers.getSigners();
    const token = await ethers.deployContract("MemeCoin", [
      NAME,
      SYMBOL,
      SUPPLY,
      deployer.address,
    ]);
    return { token, deployer, alice, bob };
  }

  describe("Despliegue", function () {
    it("configura nombre, ticker y 18 decimales", async function () {
      const { token } = await networkHelpers.loadFixture(deployFixture);

      expect(await token.name()).to.equal(NAME);
      expect(await token.symbol()).to.equal(SYMBOL);
      expect(await token.decimals()).to.equal(18n);
    });

    it("acuña todo el suministro al destinatario", async function () {
      const { token, deployer } = await networkHelpers.loadFixture(deployFixture);

      expect(await token.totalSupply()).to.equal(SUPPLY_WEI);
      expect(await token.balanceOf(deployer.address)).to.equal(SUPPLY_WEI);
    });

    it("puede enviar el suministro a otra dirección (p. ej. una multisig)", async function () {
      const [, alice] = await ethers.getSigners();
      const token = await ethers.deployContract("MemeCoin", [NAME, SYMBOL, SUPPLY, alice.address]);

      expect(await token.balanceOf(alice.address)).to.equal(SUPPLY_WEI);
    });

    it("revierte si el suministro es cero", async function () {
      const [deployer] = await ethers.getSigners();
      const factory = await ethers.getContractFactory("MemeCoin");

      await expect(
        factory.deploy(NAME, SYMBOL, 0n, deployer.address),
      ).to.be.revertedWithCustomError(factory, "ZeroSupply");
    });

    it("revierte si el destinatario es la dirección cero", async function () {
      const factory = await ethers.getContractFactory("MemeCoin");

      await expect(factory.deploy(NAME, SYMBOL, SUPPLY, ethers.ZeroAddress))
        .to.be.revertedWithCustomError(factory, "ERC20InvalidReceiver")
        .withArgs(ethers.ZeroAddress);
    });
  });

  describe("Transferencias", function () {
    it("transfiere tokens sin cobrar comisiones", async function () {
      const { token, deployer, alice } = await networkHelpers.loadFixture(deployFixture);
      const amount = ethers.parseUnits("1000", 18);

      await expect(token.transfer(alice.address, amount)).to.changeTokenBalances(
        ethers,
        token,
        [deployer, alice],
        [-amount, amount],
      );
    });

    it("emite el evento Transfer", async function () {
      const { token, deployer, alice } = await networkHelpers.loadFixture(deployFixture);

      await expect(token.transfer(alice.address, 1n))
        .to.emit(token, "Transfer")
        .withArgs(deployer.address, alice.address, 1n);
    });

    it("revierte si el saldo es insuficiente", async function () {
      const { token, alice, bob } = await networkHelpers.loadFixture(deployFixture);

      await expect(token.connect(alice).transfer(bob.address, 1n))
        .to.be.revertedWithCustomError(token, "ERC20InsufficientBalance")
        .withArgs(alice.address, 0n, 1n);
    });
  });

  describe("Quema (burn)", function () {
    it("permite quemar tokens propios y reduce el suministro total", async function () {
      const { token, deployer } = await networkHelpers.loadFixture(deployFixture);
      const amount = ethers.parseUnits("500000000", 18);

      await token.burn(amount);

      expect(await token.totalSupply()).to.equal(SUPPLY_WEI - amount);
      expect(await token.balanceOf(deployer.address)).to.equal(SUPPLY_WEI - amount);
    });

    it("permite quemar tokens ajenos solo con aprobación previa", async function () {
      const { token, deployer, alice } = await networkHelpers.loadFixture(deployFixture);
      const amount = ethers.parseUnits("10", 18);

      await expect(
        token.connect(alice).burnFrom(deployer.address, amount),
      ).to.be.revertedWithCustomError(token, "ERC20InsufficientAllowance");

      await token.approve(alice.address, amount);
      await token.connect(alice).burnFrom(deployer.address, amount);

      expect(await token.totalSupply()).to.equal(SUPPLY_WEI - amount);
    });
  });

  describe("Permit (EIP-2612)", function () {
    it("acepta aprobaciones mediante firma", async function () {
      const { token, deployer, alice } = await networkHelpers.loadFixture(deployFixture);
      const value = ethers.parseUnits("42", 18);
      const deadline = BigInt((await networkHelpers.time.latest()) + 3600);
      const { chainId } = await ethers.provider.getNetwork();

      const signature = await deployer.signTypedData(
        {
          name: NAME,
          version: "1",
          chainId,
          verifyingContract: await token.getAddress(),
        },
        {
          Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
          ],
        },
        {
          owner: deployer.address,
          spender: alice.address,
          value,
          nonce: await token.nonces(deployer.address),
          deadline,
        },
      );
      const { v, r, s } = ethers.Signature.from(signature);

      await token.connect(alice).permit(deployer.address, alice.address, value, deadline, v, r, s);

      expect(await token.allowance(deployer.address, alice.address)).to.equal(value);
      expect(await token.nonces(deployer.address)).to.equal(1n);
    });
  });

  describe("Sin privilegios ocultos", function () {
    it("solo expone las funciones estándar de ERC-20, burn y permit", async function () {
      const { token } = await networkHelpers.loadFixture(deployFixture);
      const functions: string[] = [];
      token.interface.forEachFunction((fn) => functions.push(fn.name));

      // Nada de mint, owner, pausa, lista negra ni impuestos.
      expect(functions.sort()).to.deep.equal([
        "DOMAIN_SEPARATOR",
        "allowance",
        "approve",
        "balanceOf",
        "burn",
        "burnFrom",
        "decimals",
        "eip712Domain",
        "name",
        "nonces",
        "permit",
        "symbol",
        "totalSupply",
        "transfer",
        "transferFrom",
      ]);
    });
  });
});
