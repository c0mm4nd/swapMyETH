# SwapMyETH

a simple tool for validating ETH(or fork)'s ownership and recording the swap

## Env

nodejs v10

## Usage

### Coin Team

1. install and run a redis
2. goto your public server, `git clone https://github.com/c0mm4nd/swapMyETH && cd swapMyETH`
3. `node server.js`
4. take a reverse proxy on your nginx or apache
5. provide the server address to your users

### User

1. on your local PC, `git clone https://github.com/c0mm4nd/swapMyETH && cd swapMyETH`
2. edit `swapCli.js` and change the `serverAddress` variable with the value from the coin team
3. `node swapCli.js`
4. input "original address" (old address) and "latest address" (new address)
5. finished
