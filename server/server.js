const Redis = require("ioredis");
const express = require("express");
const util = require('ethereumjs-util')
const bs58 = require('bs58')
const fs = require('fs')

// optional balances function
const jsonBalances = fs.readFileSync('balances.json')
const strBalances = JSON.parse(jsonBalances)

const balances = {}
Object.keys(strBalances).forEach(addr => {
  balances[addr] = BigInt(strBalances[addr]) / 1000000000n
});

console.log(balances)

console.log('balances ready')

const redis = new Redis();
redis.ping()

const app = express();
app.use(express.json({ type: '*/*' }));

app.get("/", async (req, res) => {
  res.send('hello NGIN')
})

app.post("/", async (req, res) => {
  const data = req.body
  const sig = data.sig
  const addr = Buffer.from(data.original, 'hex')
  const addrHash = util.hashPersonalMessage(addr)
  const pub = util.ecrecover(addrHash, sig.v, Buffer.from(sig.r, 'hex'), Buffer.from(sig.s, 'hex'))
  const addr2 = util.publicToAddress(pub)
  if (!addr2.equals(addr)) {
    res.send(JSON.stringify({ error: 'failed to validate your original keystore' }))
    return
  }

  try {
    bs58.decode(data.latest)
  } catch (e) {
    res.send(JSON.stringify({ error: "your new address is illegal: " + e }))
    return
  }

  const balance = balances['0x' + data.original]
  console.log(data.original + ' to ' + data.latest + ' : ' + balance)
  await redis.hset('swapMyETH:accountSwap', data.original, data.latest)
  await redis.hset('swapMyETH:accountBalance', data.latest, balance)

  res.sendStatus(200)
  return
});

app.get("/:address", async (req, res) => {
  // console.log(req.body) // {original: ''}
  // const data = req.body
  const latestAddr = await redis.hget('swapMyETH:accountSwap', req.params.address)
  const balance = await redis.hget('swapMyETH:accountBalance', latestAddr)
  res.send(JSON.stringify({
    latestAddr: latestAddr,
    balance: balance
  }))
})

async function main() {
  const port = 4000
  app.listen(port, () =>
    console.log(`listening at http://127.0.0.1:${port}`)
  );
}
main()
