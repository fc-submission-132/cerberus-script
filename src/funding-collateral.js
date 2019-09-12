'use strict'

const bcoin = require('bcoin')
const assert = require('bsert')

const Utils = require('./utils')

const MTX = bcoin.MTX
const Script = bcoin.Script

function interpretInput(args) {
  Utils.publicKeyVerify(args.fundKey1)
  Utils.publicKeyVerify(args.fundKey2)

  if (args.fctx !== undefined) {
    Utils.mtxVerify(args.fctx)
    Utils.amountVerify(args.outAmount)

    return true // fromMTX
  } else {
    Utils.coinVerify(args.inCoin)
    Utils.ensureWitness(args.ring)
    Utils.amountVerify(args.outAmount)

    return false
  }
}

function getFundColOutput(fundKey1, fundKey2) {
  const witnessScript = Script.fromMultisig(2, 2, [fundKey1, fundKey2])
  return Utils.outputScrFromWitScr(witnessScript)
}

function getFundColTXFromMTX({fctx, fundKey1, fundKey2, outAmount}) {
  const outputScript = getFundColOutput(fundKey1, fundKey2)
  fctx.addOutput(outputScript, outAmount)
  return fctx
}

async function getFundColTXFromCoin({inCoin, ring, fundKey1, fundKey2, outAmount}) {
  const fctx = new MTX()
  const output = getFundColOutput(fundKey1, fundKey2)
  fctx.addOutput(output, outAmount)
  const changeAddress = ring.getAddress()

  await fctx.fund([inCoin], {changeAddress})
  fctx.scriptInput(0, inCoin, ring)

  return fctx
}

async function getFundColTX(args) {
  const fromMTX = interpretInput(args)

  return (fromMTX) ? getFundColTXFromMTX(args)
                   : await getFundColTXFromCoin(args)
}

module.exports = getFundColTX
