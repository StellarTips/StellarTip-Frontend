# Tipping Flow

## Overview

The tipping flow involves multiple steps across frontend, backend, and blockchain.

## Sequence Diagram

1. **User visits creator profile**
   - Frontend loads creator info from backend

2. **User clicks tip button**
   - Frontend opens tip modal
   - User enters amount and selects currency

3. **Wallet connection**
   - If not connected, prompt Freighter connection
   - Retrieve wallet address

4. **Transaction creation**
   - Frontend sends tip request to backend
   - Backend validates request
   - Backend calls smart contract function

5. **Transaction signing**
   - Backend returns unsigned transaction
   - Frontend signs with Freighter
   - Submit signed transaction to Stellar

6. **Confirmation**
   - Wait for transaction confirmation
   - Backend stores tip record
   - Frontend shows success message
   - Update creator dashboard

## Error Handling

- Wallet connection failure
- Insufficient balance
- Network errors
- Contract execution errors

## Security Considerations

- Validate all inputs
- Rate limiting on API
- Secure JWT handling
- Contract access controls