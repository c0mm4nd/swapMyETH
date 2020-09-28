# SwapMyETH

a simple tool for validating ETH(or fork)'s ownership and recording the swap

## Env

nodejs v10

## Usage

### Coin Team

1. install and run a redis
2. goto your public server, `git clone https://github.com/c0mm4nd/swapMyETH && cd swapMyETH/server`
3. `node server.js`
4. take a reverse proxy on your nginx or apache
5. provide the server address to your users

### User

#### Cli

1. on your local PC, `git clone https://github.com/c0mm4nd/swapMyETH && cd swapMyETH/client`
2. edit `swapCli.js` and change the `serverAddress` variable with the value from the coin team
3. `node swapCli.js`
4. input "original address" (old address) and "latest address" (new address)
5. finished

#### Cmd

1. on your local PC, `git clone https://github.com/c0mm4nd/swapMyETH && cd swapMyETH/client`
2. edit `swapCmd.js` and change the `serverAddress` variable with the value from the coin team
3. `node swapCmd.js -f <folder> -o <originalAddr> -p <password> -l <latestAddr>`
4. progress return 0 if success, 1 on error.  