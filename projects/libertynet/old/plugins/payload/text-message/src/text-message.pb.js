/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.TextMessage = (function() {

    /**
     * Properties of a TextMessage.
     * @exports ITextMessage
     * @interface ITextMessage
     * @property {string|null} [username] TextMessage username
     * @property {string|null} [title] TextMessage title
     * @property {string|null} [body] TextMessage body
     * @property {string|null} [time] TextMessage time
     */

    /**
     * Constructs a new TextMessage.
     * @exports TextMessage
     * @classdesc Represents a TextMessage.
     * @implements ITextMessage
     * @constructor
     * @param {ITextMessage=} [properties] Properties to set
     */
    function TextMessage(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * TextMessage username.
     * @member {string} username
     * @memberof TextMessage
     * @instance
     */
    TextMessage.prototype.username = "";

    /**
     * TextMessage title.
     * @member {string} title
     * @memberof TextMessage
     * @instance
     */
    TextMessage.prototype.title = "";

    /**
     * TextMessage body.
     * @member {string} body
     * @memberof TextMessage
     * @instance
     */
    TextMessage.prototype.body = "";

    /**
     * TextMessage time.
     * @member {string} time
     * @memberof TextMessage
     * @instance
     */
    TextMessage.prototype.time = "";

    /**
     * Creates a new TextMessage instance using the specified properties.
     * @function create
     * @memberof TextMessage
     * @static
     * @param {ITextMessage=} [properties] Properties to set
     * @returns {TextMessage} TextMessage instance
     */
    TextMessage.create = function create(properties) {
        return new TextMessage(properties);
    };

    /**
     * Encodes the specified TextMessage message. Does not implicitly {@link TextMessage.verify|verify} messages.
     * @function encode
     * @memberof TextMessage
     * @static
     * @param {ITextMessage} message TextMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TextMessage.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.username != null && Object.hasOwnProperty.call(message, "username"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.username);
        if (message.title != null && Object.hasOwnProperty.call(message, "title"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.title);
        if (message.body != null && Object.hasOwnProperty.call(message, "body"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.body);
        if (message.time != null && Object.hasOwnProperty.call(message, "time"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.time);
        return writer;
    };

    /**
     * Encodes the specified TextMessage message, length delimited. Does not implicitly {@link TextMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof TextMessage
     * @static
     * @param {ITextMessage} message TextMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    TextMessage.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a TextMessage message from the specified reader or buffer.
     * @function decode
     * @memberof TextMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {TextMessage} TextMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TextMessage.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.TextMessage();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.username = reader.string();
                break;
            case 2:
                message.title = reader.string();
                break;
            case 3:
                message.body = reader.string();
                break;
            case 4:
                message.time = reader.string();
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a TextMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof TextMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {TextMessage} TextMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    TextMessage.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a TextMessage message.
     * @function verify
     * @memberof TextMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    TextMessage.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.username != null && message.hasOwnProperty("username"))
            if (!$util.isString(message.username))
                return "username: string expected";
        if (message.title != null && message.hasOwnProperty("title"))
            if (!$util.isString(message.title))
                return "title: string expected";
        if (message.body != null && message.hasOwnProperty("body"))
            if (!$util.isString(message.body))
                return "body: string expected";
        if (message.time != null && message.hasOwnProperty("time"))
            if (!$util.isString(message.time))
                return "time: string expected";
        return null;
    };

    /**
     * Creates a TextMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof TextMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {TextMessage} TextMessage
     */
    TextMessage.fromObject = function fromObject(object) {
        if (object instanceof $root.TextMessage)
            return object;
        var message = new $root.TextMessage();
        if (object.username != null)
            message.username = String(object.username);
        if (object.title != null)
            message.title = String(object.title);
        if (object.body != null)
            message.body = String(object.body);
        if (object.time != null)
            message.time = String(object.time);
        return message;
    };

    /**
     * Creates a plain object from a TextMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof TextMessage
     * @static
     * @param {TextMessage} message TextMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    TextMessage.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.username = "";
            object.title = "";
            object.body = "";
            object.time = "";
        }
        if (message.username != null && message.hasOwnProperty("username"))
            object.username = message.username;
        if (message.title != null && message.hasOwnProperty("title"))
            object.title = message.title;
        if (message.body != null && message.hasOwnProperty("body"))
            object.body = message.body;
        if (message.time != null && message.hasOwnProperty("time"))
            object.time = message.time;
        return object;
    };

    /**
     * Converts this TextMessage to JSON.
     * @function toJSON
     * @memberof TextMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    TextMessage.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return TextMessage;
})();

module.exports = $root;
