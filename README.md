# cerberus-script

Bitcoin script for "Cerberus - Incentivizing Watchtowers", implemented with the
[bcoin.js](https://github.com/bcoin-org/bcoin/) library.

Let channel between Alice (with funds `a`) and Bob (with funds `b`). Bob employs
watchtower W. All scripts are P2WSH.

## Funding transaction output (on-chain)

Like
[LN](https://github.com/lightningnetwork/lightning-rfc/blob/636b9f2e28c5eb9564b50b85ac85e23fc2176623/03-transactions.md#funding-transaction-output):
* value: `a + b`
* script: `2 <pubkey1> <pubkey2> 2 OP_CHECKMULTISIG`, where `pubkey1`, `pubkey2` are the
  `funding_pubkey`s of Alice and Bob, sorted by ascending order of their DER-encodings.

## Collateral transaction output (on-chain)

* value: `a + b + ε` (provided by W)
* script: `2 <pubkey3> <pubkey4> 2 OP_CHECKMULTISIG`, where `pubkey3`, `pubkey4` are the
  `collateral_pubkey`s of Bob and W, sorted by ascending order of their DER-encodings.

## Commitment transaction held by Alice (off-chain)

* unique input spends Funding output with witness script `0 <pubkey1_sig> <pubkey2_sig>`
* output 1: like [LN
  revocation](https://github.com/lightningnetwork/lightning-rfc/blob/636b9f2e28c5eb9564b50b85ac85e23fc2176623/03-transactions.md#to_local-output)
  * value: `a`
  * script:
  ```
  OP_IF
      # Revocation
      2
      <revocation_pubkey1>
      <revocation_pubkey2>
      2
      OP_CHECKMULTISIG
  OP_ELSE
      `bob_delay`
      OP_CHECKSEQUENCEVERIFY
      OP_DROP
      <alice_delayed_pubkey>
      OP_CHECKSIG
  OP_ENDIF
  ```
  Where `<revocation_pubkey1> and <revocation_pubkey2> are the two keys
  <alice_collateral_pubkey> <watchtower_revocation_pubkey>, sorted by ascending order of
  their DER-encodings.
  * Spendable by witnesses `<alice_delayed_sig> 0` or `0 <revocation_sig1>
    <revocation_sig2> 1`
* output 2:
  * value: `b`
  * script:
  ```
  OP_IF
      # Revocation
      2
      <revocation_pubkey3>
      <revocation_pubkey4>
      2
      OP_CHECKMULTISIG
  OP_ELSE
      `bob_delay`
      OP_CHECKSEQUENCEVERIFY
      OP_DROP
      <bob_delayed_pubkey>
      OP_CHECKSIG
  OP_ENDIF
  ```
  Where `<revocation_pubkey3> and <revocation_pubkey4> are the two keys
  <bob_collateral_pubkey> <watchtower_revocation_pubkey>, sorted by ascending order of
  their DER-encodings.
  * Spendable by witnesses `<bob_delayed_sig> 0` or `0 <revocation_sig3> <revocation_sig4>
    1`

## Revocation transaction (off-chain for an open channel)

## Penalty transaction (off-chain for an open channel)
