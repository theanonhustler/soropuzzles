import { ContractSpec } from 'stellar-sdk';
import { AssembledTransaction } from './assembled-tx.js';
import type { ClassOptions } from './method-options.js';
export * from './assembled-tx.js';
export * from './method-options.js';
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CAIEOX6MP3NSWD5X7S7YS25SZWICZUDQQSA7Z4Z2ZPHFTE3MQZAURO3D";
    };
};
/**
    
    */
export declare const Errors: {};
export declare class Contract {
    readonly options: ClassOptions;
    spec: ContractSpec;
    constructor(options: ClassOptions);
    private readonly parsers;
    private txFromJSON;
    readonly fromJSON: {
        play: (json: string) => AssembledTransaction<string[]>;
    };
    /**
* Construct and simulate a play transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
*/
    play: ({ prediction }: {
        prediction: string;
    }, options?: {
        /**
         * The fee to pay for the transaction. Default: 100.
         */
        fee?: number;
    }) => Promise<AssembledTransaction<string[]>>;
}
