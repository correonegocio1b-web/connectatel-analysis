<p align="center">
  <img src="assets/logo-256.png" alt="Logo de Trakash" width="200">
</p>

# Trakash ($TRAKASH)

Proyecto **independiente** del análisis de ConnectaTel: todo vive en esta carpeta `memecoin/` y no toca el notebook ni los datos del resto del repositorio.

Trakash es un token ERC-20 listo para desplegar en **Base, Ethereum o BNB Chain** (y sus testnets), construido con [Hardhat 3](https://hardhat.org) y los contratos auditados de [OpenZeppelin](https://www.openzeppelin.com/contracts).

## Características del token

| Característica | Valor |
| --- | --- |
| Nombre / ticker | Trakash / `TRAKASH` |
| Estándar | ERC-20, 18 decimales |
| Suministro | Fijo: se acuña una sola vez al desplegar (por defecto 1.000.000.000) |
| Nombre, ticker, suministro | Configurables en `.env` |
| Owner / administrador | Ninguno: nadie puede acuñar más, pausar ni bloquear wallets |
| Impuestos por transferencia | Ninguno (0%) |
| Quema (`burn`) | Cualquier holder puede quemar sus propios tokens |
| `permit` (EIP-2612) | Aprobaciones firmadas sin gas, compatibles con los DEX modernos |

Sin funciones ocultas, el contrato es fácil de auditar para la comunidad, y esa confianza cuenta mucho en una memecoin.

## Estructura

```
memecoin/
├── contracts/Trakash.sol         # El contrato del token
├── test/Trakash.ts               # 12 pruebas automáticas
├── ignition/modules/Trakash.ts   # Módulo de despliegue (Hardhat Ignition)
├── assets/                       # Logo en los tamaños que piden exploradores y wallets
├── hardhat.config.ts             # Redes, compilador y verificación
└── .env.example                  # Plantilla de configuración
```

## Paso a paso

Requisitos: **Node.js 22.10 o superior**.

### 1. Instalar

```bash
cd memecoin
npm install
```

### 2. Elegir nombre, ticker y suministro

```bash
cp .env.example .env
```

`.env` ya trae el nombre y el ticker de Trakash. Si quieres otro suministro, cambia `TOKEN_SUPPLY`:

```ini
TOKEN_NAME="Trakash"
TOKEN_SYMBOL="TRAKASH"
TOKEN_SUPPLY=1000000000   # mil millones de tokens
```

### 3. Probar

```bash
npm test                 # corre las 12 pruebas
npm run deploy:local     # despliegue de prueba en una blockchain simulada
```

### 4. Preparar la wallet que despliega

1. Crea una **wallet nueva** (p. ej. en MetaMask o Rabby) solo para desplegar. No uses tu wallet principal.
2. Guarda su clave privada **cifrada** en el keystore de Hardhat (te pedirá una contraseña):

   ```bash
   npx hardhat keystore set DEPLOYER_PRIVATE_KEY
   ```

   Esto es más seguro que dejar la clave en texto plano dentro de `.env`.

### 5. Desplegar en testnet (gratis)

1. Consigue ETH de prueba en Base Sepolia desde un faucet (busca "Base Sepolia faucet"; Coinbase y Alchemy tienen uno).
2. Despliega:

   ```bash
   npm run deploy:base-sepolia
   ```

3. Busca la dirección del contrato en [sepolia.basescan.org](https://sepolia.basescan.org) y añade el token a tu wallet para verlo.

También hay `npm run deploy:sepolia` (Ethereum) y `npm run deploy:bsc-testnet` (BNB Chain).

### 6. Verificar el código en el explorador

Así cualquiera puede leer el contrato en Basescan o Etherscan:

```bash
npx hardhat ignition verify chain-84532 --network baseSepolia
```

El comando intenta verificar en **Etherscan**, **Blockscout** y **Sourcify**. Blockscout y Sourcify no piden API key. Etherscan sí: créala en [etherscan.io/apidashboard](https://etherscan.io/apidashboard) y ponla en `ETHERSCAN_API_KEY`. Sin ella fallará solo el paso de Etherscan.

### 7. Lanzamiento real (mainnet)

Cuando todo funcione en testnet, carga ETH o BNB real en la wallet y ejecuta uno de estos:

```bash
npm run deploy:base       # Base: comisiones bajas, muy usada para memecoins
npm run deploy:mainnet    # Ethereum: comisiones más altas
npm run deploy:bsc        # BNB Chain
```

Luego verifica con el `chainId` correspondiente: `chain-8453` (Base), `chain-1` (Ethereum) o `chain-56` (BNB Chain).

> Si cambias el nombre, ticker o suministro después de haber desplegado en una red, Ignition lo detecta y se detiene. Para crear un token nuevo en esa red, añade `--reset` al comando de despliegue.

## Después del despliegue: lanzar la memecoin

1. **Liquidez:** crea el par TOKEN/ETH en un DEX (Uniswap o Aerodrome en Base, Uniswap en Ethereum, PancakeSwap en BNB Chain). Sin liquidez nadie puede comprar.
2. **Bloquea o quema los LP tokens** que te da el DEX. Así demuestras que no puedes retirar la liquidez (lo que se conoce como *rug pull*).
3. **Reparto del suministro:** si hay equipo, marketing o airdrops, guarda esos tokens en una multisig [Safe](https://safe.global) (puedes desplegar directo a ella con `TOKEN_RECIPIENT`) y publica cómo se reparte.
4. **Identidad:** web, X/Telegram y el logo en cada sitio (ver abajo). Solicita el listado en CoinGecko y CoinMarketCap cuando haya volumen.

## Logo

El logo no se guarda en la blockchain. Cada explorador, wallet o web de precios lo toma de su propio registro, así que hay que subirlo en cada uno después de desplegar. En `assets/` está listo en los tamaños habituales, con fondo transparente:

| Archivo | Tamaño | Para qué |
| --- | --- | --- |
| `logo.png` | 1024 × 1024 | Web, foto de perfil en X/Telegram, DEX Screener |
| `logo-256.png` | 256 × 256 (30 KB) | Wallets y listas de tokens (piden 256 px y menos de 100 KB) |
| `logo-200.png` | 200 × 200 | Solicitudes de CoinGecko y CoinMarketCap |
| `logo-32.png` | 32 × 32 | Formulario "Token Update" de Basescan, Etherscan y BscScan |
| `logo-original.jpg` | 1254 × 1254 | Imagen original, sin recortar |

## Avisos importantes

- **Seguridad:** nunca compartas ni subas tu clave privada. `.env` ya está en `.gitignore`.
- **Riesgo:** la gran mayoría de memecoins pierde casi todo su valor. No inviertas lo que no puedas perder.
- **Legal:** según el país (México, Colombia, España, EE. UU., etc.) un token puede estar regulado. No prometas ganancias ni rendimientos y consulta a un abogado antes de promocionarlo.
