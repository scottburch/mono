import {SignedObj} from "../crypto/signed-obj.pb";

export interface PayloadType<T> {
    fromObject: (obj: Omit<T, 'toJSON'>) => T
    getTypeUrl: () => string
    getSignString: (obj: T) => string
    fromSignedObj: (signedObj: SignedObj) => T
    encoder: (obj: T) => Uint8Array
}



