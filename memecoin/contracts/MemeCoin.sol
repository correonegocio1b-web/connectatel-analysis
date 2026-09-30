// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

/**
 * @title MemeCoin
 * @notice Token ERC-20 de suministro fijo para una memecoin.
 *
 * Diseño deliberadamente simple y transparente:
 *  - Todo el suministro se acuña una sola vez, en el constructor.
 *  - No hay owner ni roles: nadie puede acuñar más, pausar, bloquear
 *    direcciones ni cobrar impuestos por transferencia.
 *  - Cualquier holder puede quemar sus propios tokens (ERC20Burnable).
 *  - Admite aprobaciones firmadas sin gas (ERC20Permit / EIP-2612).
 */
contract MemeCoin is ERC20, ERC20Burnable, ERC20Permit {
    /// @dev El suministro inicial no puede ser cero.
    error ZeroSupply();

    /**
     * @param name_ Nombre del token (p. ej. "Ping Doge").
     * @param symbol_ Ticker del token (p. ej. "PING").
     * @param initialSupply Suministro total en tokens enteros, sin decimales.
     * @param recipient Dirección que recibe todo el suministro inicial.
     */
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply,
        address recipient
    ) ERC20(name_, symbol_) ERC20Permit(name_) {
        if (initialSupply == 0) revert ZeroSupply();
        _mint(recipient, initialSupply * 10 ** decimals());
    }
}
