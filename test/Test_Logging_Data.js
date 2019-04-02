const DataLogger = artifacts.require('DataLogger');
const generate = require('nanoid/generate');
const microtime = require('microtime');

const TronWeb = require('tronweb');
const tronNetworkConfig = require('../private_file/tron-network-config.js');

contract('[TEST] Logging Data', async (accounts) => {
    const log = function() {
        console.log('       [LOG]', ...arguments);
    };

    const user = accounts[0];
    const privateKey = tronNetworkConfig.development.privateKey;

    const tronWeb = new TronWeb({
        fullHost: 'http://127.0.0.1:9090',
        privateKey: privateKey,
    });

    tronWeb.setAddress(user);

    it(`Initial state is the owner address token holding number:`, async () => {
        let logger;

        await DataLogger.deployed().then((r) => {
            logger = r;
        });

        const abi = logger.abi;
        const contractAddress = logger.address;

        const contractInstance = await tronWeb.contract().at(contractAddress);

        //watch event if there is
        contractInstance['Log']().watch(function(err, res) {
            if (err) {
                log('error ' + err);
            }
            log('eventResult:', res);
        });

        const total = 100;

        try {
            const start = microtime.now();

            for (let i = 0; i < total; ++i) {
                const id = generate('1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ', 32);
                const hex = tronWeb.toHex(id);

                const data = {
                    id,
                    hex,
                };

                const json = JSON.stringify(data);

                log(`i: ${i} json: ${json}`);

                for (let t = 0; t < 3; ++t) {
                    const txHash = await contractInstance
                        .logging(json)
                        .send({
                            feeLimit: 1e9,
                            callValue: 0,
                            shouldPollResponse: false,
                        })
                        .catch((e) => {
                            log(e.message);
                            return null;
                        });

                    if (txHash == null) {
                        await new Promise((r) => setTimeout(r, 10));
                        continue;
                    }

                    log(`result: ${txHash}`);

                    const tx = await tronWeb.trx.getTransaction(txHash).catch((e) => {
                        log(e.message);
                        return null;
                    });

                    const txJson = JSON.stringify(tx);

                    log(`tx: ${txJson}`);

                    const balance = await tronWeb.trx.getBalance(user);

                    log(`balance: ${balance}`);

                    break;
                }
            }

            const end = microtime.now();

            const timeResult = (end - start) / 1000.0;
            const average = timeResult / total;

            log(`timeResult: ${timeResult} ms`);
            log(`timeResult: ${average} ms`);

            // assert.ok(true);
        } catch (e) {
            log(e);
        }
    });
});
