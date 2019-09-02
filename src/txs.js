const bcoin = require('bcoin')
const Script = bcoin.script.Script
const MTX = bcoin.primitives.MTX

class FundingTX extends MTX {
  constructor(options) {
    super(options)
  }
}

class CollateralTX extends MTX {
  constructor(options) {
    super(options)
  }
}

class CommitmentTX extends MTX {
  constructor(options) { // keyrings, sigs
    function checkArgs(args) {
      if (!args) {
        throw new TypeError("CommitmentTX: No argument given, one needed")
      }
      if (!args.sig1 || !args.sig2) {
        throw new TypeError("CommitmentTX: Missing sig1 or sig2 from argument properties")
      }
      // TODO: continue
    }

    //checkArgs(options) // TODO: maybe go unchecked
    super(options)
    const script1 = this.getScript(options.rev_key1, options.rev_key2,
                                   options.delay, options.del_key)
    console.log(script1)
    this.addInput({
      prevout: options.prevout,
      script: script1
      // TODO
    })
  }

  getScript(rev_key1, rev_key2, delay, del_key) {
    const res = new Script()

    res.pushSym('OP_IF')
    res.pushInt(2)
    res.pushData(rev_key1)
    res.pushData(rev_key2)
    res.pushInt(2)
    res.pushSym('OP_CHECKMULTISIG')
    res.pushSym('OP_ELSE')
    res.pushInt(delay)
    res.pushSym('OP_CHECKSEQUENCEVERIFY')
    res.pushSym('OP_DROP')
    res.pushData(del_key)
    res.pushSym('OP_CHECKSIG')
    res.pushSym('OP_ENDIF')

    res.compile()
    return res
  }
}

class RevocationTX extends MTX {
  constructor(options) {
    super(options)
  }
}

class PenaltyTX extends MTX {
  constructor(options) {
    super(options)
  }
}