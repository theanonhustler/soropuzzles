import { ContractSpec } from 'stellar-sdk';
import { Buffer } from "buffer";
import { AssembledTransaction } from './assembled-tx.js';
export * from './assembled-tx.js';
export * from './method-options.js';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CAIEOX6MP3NSWD5X7S7YS25SZWICZUDQQSA7Z4Z2ZPHFTE3MQZAURO3D",
    }
};
/**
    
    */
export const Errors = {};
export class Contract {
    options;
    spec;
    constructor(options) {
        this.options = options;
        this.spec = new ContractSpec([
            "AAAAAAAAAAAAAAAEcGxheQAAAAEAAAAAAAAACnByZWRpY3Rpb24AAAAAABEAAAABAAAD6gAAABE="
        ]);
    }
    parsers = {
        play: (result) => this.spec.funcResToNative("play", result)
    };
    txFromJSON = (json) => {
        const { method, ...tx } = JSON.parse(json);
        return AssembledTransaction.fromJSON({
            ...this.options,
            method,
            parseResultXdr: this.parsers[method],
        }, tx);
    };
    fromJSON = {
        play: (this.txFromJSON)
    };
    /**
* Construct and simulate a play transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    play = async ({ prediction }, options = {}) => {
        return await AssembledTransaction.fromSimulation({
            method: 'play',
            args: this.spec.funcArgsToScVals("play", { prediction }),
            ...options,
            ...this.options,
            errorTypes: Errors,
            parseResultXdr: this.parsers['play'],
        });
    };
}
