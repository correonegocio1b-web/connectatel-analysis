import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// Los datos del token se leen del archivo .env (ver .env.example).
const name = process.env.TOKEN_NAME || "Trakash";
const symbol = process.env.TOKEN_SYMBOL || "TRAKASH";
const supply = BigInt(process.env.TOKEN_SUPPLY || "1000000000");

export default buildModule("TrakashModule", (m) => {
  // Si no se indica destinatario, todo el suministro va a la cuenta que despliega.
  const recipient = process.env.TOKEN_RECIPIENT || m.getAccount(0);

  const token = m.contract("Trakash", [name, symbol, supply, recipient]);

  return { token };
});
