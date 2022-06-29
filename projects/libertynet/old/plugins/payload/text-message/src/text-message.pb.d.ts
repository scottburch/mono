import * as $protobuf from "protobufjs";
/** Properties of a TextMessage. */
export interface ITextMessage {

    /** TextMessage username */
    username?: (string|null);

    /** TextMessage title */
    title?: (string|null);

    /** TextMessage body */
    body?: (string|null);

    /** TextMessage time */
    time?: (string|null);
}

/** Represents a TextMessage. */
export class TextMessage implements ITextMessage {

    /**
     * Constructs a new TextMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: ITextMessage);

    /** TextMessage username. */
    public username: string;

    /** TextMessage title. */
    public title: string;

    /** TextMessage body. */
    public body: string;

    /** TextMessage time. */
    public time: string;

    /**
     * Creates a new TextMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns TextMessage instance
     */
    public static create(properties?: ITextMessage): TextMessage;

    /**
     * Encodes the specified TextMessage message. Does not implicitly {@link TextMessage.verify|verify} messages.
     * @param message TextMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(message: ITextMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Encodes the specified TextMessage message, length delimited. Does not implicitly {@link TextMessage.verify|verify} messages.
     * @param message TextMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(message: ITextMessage, writer?: $protobuf.Writer): $protobuf.Writer;

    /**
     * Decodes a TextMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns TextMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): TextMessage;

    /**
     * Decodes a TextMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns TextMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): TextMessage;

    /**
     * Verifies a TextMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): (string|null);

    /**
     * Creates a TextMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns TextMessage
     */
    public static fromObject(object: { [k: string]: any }): TextMessage;

    /**
     * Creates a plain object from a TextMessage message. Also converts values to other types if specified.
     * @param message TextMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(message: TextMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

    /**
     * Converts this TextMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };
}
