/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.SignedObj = (function() {

    /**
     * Properties of a SignedObj.
     * @exports ISignedObj
     * @interface ISignedObj
     * @property {string|null} [owner] SignedObj owner
     * @property {string|null} [pubKey] SignedObj pubKey
     * @property {string|null} [signature] SignedObj signature
     * @property {number|null} [version] SignedObj version
     * @property {google.protobuf.IAny|null} [payload] SignedObj payload
     */

    /**
     * Constructs a new SignedObj.
     * @exports SignedObj
     * @classdesc Represents a SignedObj.
     * @implements ISignedObj
     * @constructor
     * @param {ISignedObj=} [properties] Properties to set
     */
    function SignedObj(properties) {
        if (properties)
            for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * SignedObj owner.
     * @member {string} owner
     * @memberof SignedObj
     * @instance
     */
    SignedObj.prototype.owner = "";

    /**
     * SignedObj pubKey.
     * @member {string} pubKey
     * @memberof SignedObj
     * @instance
     */
    SignedObj.prototype.pubKey = "";

    /**
     * SignedObj signature.
     * @member {string} signature
     * @memberof SignedObj
     * @instance
     */
    SignedObj.prototype.signature = "";

    /**
     * SignedObj version.
     * @member {number} version
     * @memberof SignedObj
     * @instance
     */
    SignedObj.prototype.version = 0;

    /**
     * SignedObj payload.
     * @member {google.protobuf.IAny|null|undefined} payload
     * @memberof SignedObj
     * @instance
     */
    SignedObj.prototype.payload = null;

    /**
     * Creates a new SignedObj instance using the specified properties.
     * @function create
     * @memberof SignedObj
     * @static
     * @param {ISignedObj=} [properties] Properties to set
     * @returns {SignedObj} SignedObj instance
     */
    SignedObj.create = function create(properties) {
        return new SignedObj(properties);
    };

    /**
     * Encodes the specified SignedObj message. Does not implicitly {@link SignedObj.verify|verify} messages.
     * @function encode
     * @memberof SignedObj
     * @static
     * @param {ISignedObj} message SignedObj message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedObj.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.owner != null && Object.hasOwnProperty.call(message, "owner"))
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.owner);
        if (message.pubKey != null && Object.hasOwnProperty.call(message, "pubKey"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.pubKey);
        if (message.signature != null && Object.hasOwnProperty.call(message, "signature"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.signature);
        if (message.version != null && Object.hasOwnProperty.call(message, "version"))
            writer.uint32(/* id 4, wireType 0 =*/32).int32(message.version);
        if (message.payload != null && Object.hasOwnProperty.call(message, "payload"))
            $root.google.protobuf.Any.encode(message.payload, writer.uint32(/* id 10, wireType 2 =*/82).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified SignedObj message, length delimited. Does not implicitly {@link SignedObj.verify|verify} messages.
     * @function encodeDelimited
     * @memberof SignedObj
     * @static
     * @param {ISignedObj} message SignedObj message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    SignedObj.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a SignedObj message from the specified reader or buffer.
     * @function decode
     * @memberof SignedObj
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {SignedObj} SignedObj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedObj.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        var end = length === undefined ? reader.len : reader.pos + length, message = new $root.SignedObj();
        while (reader.pos < end) {
            var tag = reader.uint32();
            switch (tag >>> 3) {
            case 1:
                message.owner = reader.string();
                break;
            case 2:
                message.pubKey = reader.string();
                break;
            case 3:
                message.signature = reader.string();
                break;
            case 4:
                message.version = reader.int32();
                break;
            case 10:
                message.payload = $root.google.protobuf.Any.decode(reader, reader.uint32());
                break;
            default:
                reader.skipType(tag & 7);
                break;
            }
        }
        return message;
    };

    /**
     * Decodes a SignedObj message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof SignedObj
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {SignedObj} SignedObj
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    SignedObj.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a SignedObj message.
     * @function verify
     * @memberof SignedObj
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    SignedObj.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.owner != null && message.hasOwnProperty("owner"))
            if (!$util.isString(message.owner))
                return "owner: string expected";
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            if (!$util.isString(message.pubKey))
                return "pubKey: string expected";
        if (message.signature != null && message.hasOwnProperty("signature"))
            if (!$util.isString(message.signature))
                return "signature: string expected";
        if (message.version != null && message.hasOwnProperty("version"))
            if (!$util.isInteger(message.version))
                return "version: integer expected";
        if (message.payload != null && message.hasOwnProperty("payload")) {
            var error = $root.google.protobuf.Any.verify(message.payload);
            if (error)
                return "payload." + error;
        }
        return null;
    };

    /**
     * Creates a SignedObj message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof SignedObj
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {SignedObj} SignedObj
     */
    SignedObj.fromObject = function fromObject(object) {
        if (object instanceof $root.SignedObj)
            return object;
        var message = new $root.SignedObj();
        if (object.owner != null)
            message.owner = String(object.owner);
        if (object.pubKey != null)
            message.pubKey = String(object.pubKey);
        if (object.signature != null)
            message.signature = String(object.signature);
        if (object.version != null)
            message.version = object.version | 0;
        if (object.payload != null) {
            if (typeof object.payload !== "object")
                throw TypeError(".SignedObj.payload: object expected");
            message.payload = $root.google.protobuf.Any.fromObject(object.payload);
        }
        return message;
    };

    /**
     * Creates a plain object from a SignedObj message. Also converts values to other types if specified.
     * @function toObject
     * @memberof SignedObj
     * @static
     * @param {SignedObj} message SignedObj
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    SignedObj.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        var object = {};
        if (options.defaults) {
            object.owner = "";
            object.pubKey = "";
            object.signature = "";
            object.version = 0;
            object.payload = null;
        }
        if (message.owner != null && message.hasOwnProperty("owner"))
            object.owner = message.owner;
        if (message.pubKey != null && message.hasOwnProperty("pubKey"))
            object.pubKey = message.pubKey;
        if (message.signature != null && message.hasOwnProperty("signature"))
            object.signature = message.signature;
        if (message.version != null && message.hasOwnProperty("version"))
            object.version = message.version;
        if (message.payload != null && message.hasOwnProperty("payload"))
            object.payload = $root.google.protobuf.Any.toObject(message.payload, options);
        return object;
    };

    /**
     * Converts this SignedObj to JSON.
     * @function toJSON
     * @memberof SignedObj
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    SignedObj.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    return SignedObj;
})();

$root.google = (function() {

    /**
     * Namespace google.
     * @exports google
     * @namespace
     */
    var google = {};

    google.protobuf = (function() {

        /**
         * Namespace protobuf.
         * @memberof google
         * @namespace
         */
        var protobuf = {};

        protobuf.Any = (function() {

            /**
             * Properties of an Any.
             * @memberof google.protobuf
             * @interface IAny
             * @property {string|null} [type_url] Any type_url
             * @property {Uint8Array|null} [value] Any value
             */

            /**
             * Constructs a new Any.
             * @memberof google.protobuf
             * @classdesc Represents an Any.
             * @implements IAny
             * @constructor
             * @param {google.protobuf.IAny=} [properties] Properties to set
             */
            function Any(properties) {
                if (properties)
                    for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * Any type_url.
             * @member {string} type_url
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.type_url = "";

            /**
             * Any value.
             * @member {Uint8Array} value
             * @memberof google.protobuf.Any
             * @instance
             */
            Any.prototype.value = $util.newBuffer([]);

            /**
             * Creates a new Any instance using the specified properties.
             * @function create
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny=} [properties] Properties to set
             * @returns {google.protobuf.Any} Any instance
             */
            Any.create = function create(properties) {
                return new Any(properties);
            };

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encode
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.type_url != null && Object.hasOwnProperty.call(message, "type_url"))
                    writer.uint32(/* id 1, wireType 2 =*/10).string(message.type_url);
                if (message.value != null && Object.hasOwnProperty.call(message, "value"))
                    writer.uint32(/* id 2, wireType 2 =*/18).bytes(message.value);
                return writer;
            };

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @function encodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.IAny} message Any message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            Any.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @function decode
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                var end = length === undefined ? reader.len : reader.pos + length, message = new $root.google.protobuf.Any();
                while (reader.pos < end) {
                    var tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1:
                        message.type_url = reader.string();
                        break;
                    case 2:
                        message.value = reader.bytes();
                        break;
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof google.protobuf.Any
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {google.protobuf.Any} Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            Any.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies an Any message.
             * @function verify
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            Any.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    if (!$util.isString(message.type_url))
                        return "type_url: string expected";
                if (message.value != null && message.hasOwnProperty("value"))
                    if (!(message.value && typeof message.value.length === "number" || $util.isString(message.value)))
                        return "value: buffer expected";
                return null;
            };

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof google.protobuf.Any
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {google.protobuf.Any} Any
             */
            Any.fromObject = function fromObject(object) {
                if (object instanceof $root.google.protobuf.Any)
                    return object;
                var message = new $root.google.protobuf.Any();
                if (object.type_url != null)
                    message.type_url = String(object.type_url);
                if (object.value != null)
                    if (typeof object.value === "string")
                        $util.base64.decode(object.value, message.value = $util.newBuffer($util.base64.length(object.value)), 0);
                    else if (object.value.length)
                        message.value = object.value;
                return message;
            };

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @function toObject
             * @memberof google.protobuf.Any
             * @static
             * @param {google.protobuf.Any} message Any
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            Any.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                var object = {};
                if (options.defaults) {
                    object.type_url = "";
                    if (options.bytes === String)
                        object.value = "";
                    else {
                        object.value = [];
                        if (options.bytes !== Array)
                            object.value = $util.newBuffer(object.value);
                    }
                }
                if (message.type_url != null && message.hasOwnProperty("type_url"))
                    object.type_url = message.type_url;
                if (message.value != null && message.hasOwnProperty("value"))
                    object.value = options.bytes === String ? $util.base64.encode(message.value, 0, message.value.length) : options.bytes === Array ? Array.prototype.slice.call(message.value) : message.value;
                return object;
            };

            /**
             * Converts this Any to JSON.
             * @function toJSON
             * @memberof google.protobuf.Any
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            Any.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            return Any;
        })();

        return protobuf;
    })();

    return google;
})();

module.exports = $root;
