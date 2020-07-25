const keythereum = require('keythereum')
const util = require('ethereumjs-util')
const axios = require('axios').default
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const serverAddress = 'http://127.0.0.1:4000' // edit me before using

function remove0x(addr) {
    if (addr.includes('0x')) {
        return addr.slice(2)
    }

    return addr
}

async function main(originalAddr, password, latestAddr) {
    const keyObject = keythereum.importFromFile(originalAddr, './');
    const privateKey = keythereum.recover(password, keyObject);
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
    
    console.log('now submiting the swap request to server')
    await axios.post(serverAddress, JSON.stringify(data))
    console.log('everything done! view ' + serverAddress + '/' + originalAddr + ' and check your balance')
}

rl.question("Your original address? ", function(originalAddr) {
    rl.question("Password of the original address? ", function(password) {
        rl.question("Your latest address? ", function(latestAddr) {
            main(remove0x(originalAddr), password, remove0x(latestAddr))
        })
    })
})
