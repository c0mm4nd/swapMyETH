const Redis = require("ioredis");
const express = require("express");
const util =  require('ethereumjs-util')
const cors = require("cors");

const redis = new Redis();

const app = express();
app.use(express.json({type: '*/*'}));
app.use(cors)

app.post("/", async (req, res) => {
    console.log(req.body) // {sig: {}, original: '', latest: ''}
    const data = req.body
    const sig = data.sig
    const addr = Buffer.from(data.original, 'hex')
    const addrHash = util.hashPersonalMessage(addr)
    const pub = util.ecrecover(addrHash, sig.v, Buffer.from(sig.r, 'hex'), Buffer.from(sig.s, 'hex'))
    const addr2 = util.publicToAddress(pub)
    if (addr2.equals(addr)) {
        console.log(data.original + ' to ' + data.latest)
        await redis.hset('swapMyETH', data.original, data.latest)
        res.sendStatus(200)
        return
    }
    
    res.sendStatus(400)
    return
});

app.get("/", async (req, res) => {
    console.log(req.body) // {original: ''}
    const data = req.body
    const latestAddr = await redis.hget('swapMyETH', data.original)
    res.send(JSON.stringify({
        latestAddr: latestAddr
    }))
})

async function main() {
  const port = 4000 
  app.listen(port, () =>
    console.log(`Explorer listening at http://127.0.0.1:${port}`)
  );
}
main()
