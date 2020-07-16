const keythereum = require('keythereum')
const util = require('ethereumjs-util')
const axios = require('axios').default
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const serverAddress = 'http://127.0.0.1:4000' // edit me before using

async function main(originalAddr, latestAddr) {
    const keyObject = keythereum.importFromFile(originalAddr, './');
    const privateKey = keythereum.recover('', keyObject);
    const addr = util.privateToAddress(privateKey) 

    const addrHash = util.hashPersonalMessage(addr)
    const sig = util.ecsign(addrHash, privateKey)
    
    const data = {
        sig: {
            v: sig.v,
            r: sig.r.toString('hex'),
            s: sig.s.toString('hex'),
        },
        original: addr.toString('hex'),
        latest: latestAddr
    }
    
    await axios.post(serverAddress, JSON.stringify(data), )
}

rl.question("Your original address? ", function(originalAddr) {
    rl.question("Your latest address? ", function(latestAddr) {
        main(originalAddr, latestAddr)
    })
})
