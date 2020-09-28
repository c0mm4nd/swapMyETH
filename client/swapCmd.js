#!/usr/bin/env node
const keythereum = require('keythereum')
const util = require('ethereumjs-util')
const axios = require('axios').default
const yargs = require('yargs')

const serverAddress = 'https://swap.ngin.cash' // edit me before using

function remove0x(addr) {
  if (addr.includes('0x')) {
    return addr.slice(2)
  }

  return addr
}

async function main(keystoreFolder, originalAddr, password, latestAddr) {
  let keyObject
  try {
    keyObject = keythereum.importFromFile(originalAddr, keystoreFolder);
  } catch (e) {
    console.log(e)
    process.exit(1)
  }

  let privateKey
  try {
    privateKey = keythereum.recover(password, keyObject);
  } catch (e) {
    console.log(e)
    process.exit(1)
  }

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
  let res
  try {
    res = await axios.post(serverAddress, JSON.stringify(data))
  } catch (e) {
    console.log(e.message)
    process.exit(1)
  }

  if (res.data.error) {
    console.error('server reply: ' + res.data.error)
    process.exit(1)
  }

  console.log('everything done! view ' + serverAddress + '/' + originalAddr + ' and check your new address and balance')
  console.log('the balance\'s unit is NG. You can close the program now')
  process.exit(0)
}

const argv = yargs.scriptName("swapCmd")
  .option('folder', {
    alias: 'f',
    type: 'string',
    default: './',
    describe: 'folder to the eth(-fork)\'s storage folder, which has a keystore sub-folder, for example: ~/.Ngin'
  }).option('originalAddr', {
    alias: 'o',
    type: 'string',
    describe: 'original address to the keystore file'
  }).option('latestAddr', {
    alias: 'l',
    type: 'string',
    describe: 'address from the new NGIN daemon (ngcore)'
  }).option('password', {
    alias: 'p',
    type: 'string',
    describe: 'the password of the originalAddr keystore file'
  }).demandOption(['originalAddr', 'latestAddr'])
  .help()
  .argv

main(argv.folder, remove0x(argv.originalAddr.toLowerCase()), argv.password, argv.latestAddr)