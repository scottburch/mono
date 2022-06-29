import * as $protobuf from "protobufjs";
/** Properties of a SignedObj. */
export interface ISignedObj {

    /** SignedObj owner */
    owner?: (string|null);

    /** SignedObj pubKey */
    pubKey?: (string|null);

    /** SignedObj signature */
    signature?: (string|null);

    /** SignedObj version */
    version?: (number|null);

    /** SignedObj payload */
    payload?: (google.protobuf.IAny|null);
}

/** Represents a SignedObj. */
export class SignedObj implements ISignedObj {

    /**
     * Constructs a new SignedObj.
     * @param [properties] Properties to set
     */
    constructor(properties?: ISignedObj);

    /** SignedObj owner. */
    public owner: string;

    /** SignedObj pubKey. */
    public pubKey: string;

    /** SignedObj signature. */
    public signature: string;

    /** SignedObj version. */
    public version: number;

    /** SignedObj payload. */
    public payload?: (google.protobuf.IAny|null);

    /**
     * Creates a new SignedObj instance using the specified properties.
     * @param [properties] Properties to set
     * @returns SignedObj instance
     */
    public static create(properties?: ISignedObj): SignedObj;

    /**
     * Encodes the specified SignedObj message. Does not implicitly {@link SignedObj.verify|verify} messages.
     * @param message SignedObj message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ISignedObj, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified SignedObj message, length delimited. Does not implicitly {@link SignedObj.verify|verify} messages.
     * @param message SignedObj message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ISignedObj, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a SignedObj message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns SignedObj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): SignedObj;

    /**
     * Decodes a SignedObj message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns SignedObj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): SignedObj;

    /**
     * Verifies a SignedObj message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a SignedObj message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns SignedObj
     */
    public static fromObject(object: { [k: string]: any }): SignedObj;

    /**
     * Creates a plain object from a SignedObj message. Also converts values to other types if specified.
     * @param message SignedObj
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: SignedObj, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this SignedObj to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: Uint8Array;

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
