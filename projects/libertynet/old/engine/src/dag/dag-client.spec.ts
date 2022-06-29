import {
    readNodes,
    storeSignedObject,
    waitUntilNodeIncluded,
    createRadixPath,
    doesNodeExist,
    searchSignedObjs,
    readSignedObjectsSorted,
    KeySet, readNewestSignedObject
} from "./dag-client";
import {expect} from "chai";
import {identity, map} from "lodash/fp";
import {SignedObj} from "../crypto/signed-obj.pb";
import {passThroughAwait} from "promise-passthrough";
import {newLocalDbConnector} from "./newLocalDbConnector";
import {get} from "lodash/fp";


describe.skip('used for debugging', function() {
    this.timeout(20_000);

    it('should store an object', () => {
        return storeSignedObject(newLocalDbConnector(), ['my-key'], SignedObj.create({
            owner: 'scott',
        }))
    });

    it('should read an object', () => {
        return readNewestSignedObject(newLocalDbConnector(), ['my-key'])
            .then(console.log);
    })

})

describe('dag-client specifications', function () {
    this.timeout(120_000);

    it('should return an empty list when reading invalid sorted signed objects', () => {
        return readSignedObjectsSorted(newLocalDbConnector(), ['fake'])
            .then(results => expect(results).to.have.length(0));
    })

    it('should be able to see if a node exists', () => {
        const key = Date.now().toString();
        return doesNodeExist(newLocalDbConnector(), [key])
            .then(exists => expect(exists).to.be.false)
            .then(() => storeSignedObject(newLocalDbConnector(), [key], SignedObj.create()))
            .then(() => doesNodeExist(newLocalDbConnector(), [key]))
            .then(exists => expect(exists).to.be.true)
    });

    it('should create a radix path to the key', () => {
        const key = Date.now().toString();
        return storeSignedObject(newLocalDbConnector(), [key], SignedObj.create())
            .then(() => Promise.all(
                createRadixPath([key])
                    .map(path => doesNodeExist(newLocalDbConnector(), [path]))
            ))
            .then(x => expect(x.every(identity)))
    });

    it('should only create one object per key', () => {
        const key = 'abcabca' + Date.now().toString()
        return storeSignedObject(newLocalDbConnector(), [key], SignedObj.create({owner: 'testing'}))
            .then(() => Promise.all(
                createRadixPath([key]).concat([key]).map(k => readNodes(newLocalDbConnector(), [k]))
            ))
            .then(objects => {
                expect(objects).to.have.length(20);
                expect(objects.every(obj => obj.length === 1)).to.be.true;
            })
    });

    it('should be able to store and retrieve an object', () => {
        const key = Date.now().toString();
        return storeSignedObject(newLocalDbConnector(), [key], SignedObj.create({
            pubKey: 'pub-key',
        }))
            .then(() => readNodes(newLocalDbConnector(), [key]))
            .then(x => x[0])
            .then(obj => expect(obj.pubKey).to.equal('pub-key'))
    });

    it('should be able to store and retrieve objects', () => {
        const key = Date.now().toString();
        return Promise.all([
            storeSignedObject(newLocalDbConnector(), ['test', key], SignedObj.create({
                pubKey: 'pub-key1',
            })),
            storeSignedObject(newLocalDbConnector(), ['test', key], SignedObj.create({
                pubKey: 'pub-key2',
            })),
        ])
            .then(() => readNodes(newLocalDbConnector(), ['test', key]))
            .then(map(obj => obj.pubKey))
            .then(data => expect(data.sort()).to.deep.equal(['pub-key1', 'pub-key2']));
    });

    it('should be able to wait until a node is included in the tangle', () =>
        Promise.resolve(Date.now().toString())
            .then(key => storeSignedObject(newLocalDbConnector(), [key], SignedObj.create()))
            .then(response => waitUntilNodeIncluded(newLocalDbConnector(), response))
            .then(meta => expect(meta.referencedByMilestoneIndex).to.be.greaterThan(0))
    );


    it('should be able to limit the number of results when searching signedObjects', () => {
        const connector = newLocalDbConnector()
        return Promise.all(['by', 'bass', 'boy', 'bad', 'bassoon', 'baseball', 'bat', 'bonfire', 'bonds', 'batter', 'butter', 'bust'].map(name =>
            storeSignedObject(connector, [name], SignedObj.create({owner: name, signature: 'signed'}))
        ))
            .then(() => searchSignedObjs(connector, ['b'], {limit:3}))
            // Must have 4 because the results are by length at the moment and there are 3 at the border
            .then(x => expect(x).to.have.length(4));
    });

    it('should return words in order', () => {
        const connector = newLocalDbConnector()
        return Promise.all(['by', 'bass', 'boy', 'bad', 'bassoon', 'baseball', 'bat', 'bonfire', 'bonds', 'batter', 'butter', 'bust'].map(name =>
            storeSignedObject(connector, [name], SignedObj.create({owner: name, signature: 'signed'}))
        ))
            .then(() => searchSignedObjs(connector, ['b'], {keySet: KeySet.alphaNumeric}))
            .then(map(get('owner')))
            .then(results => expect(results).to.deep.equal(["bad","baseball","bassoon","bass","batter","bat","bonds","bonfire","boy","bust","butter","by"]))
    });

    it('should page search results properly', () => {
        const connector = newLocalDbConnector()
        return Promise.all(['by', 'bass', 'boy', 'bad', 'bassoon'].map(name =>
            storeSignedObject(connector, [name], SignedObj.create({owner: name, signature: 'signed'}))
        ))
            .then(() => searchSignedObjs(connector, ['b'], {limit: 3}))
            .then(results => results.map(r => r.owner))
            .then(results => expect(results).to.deep.equal(['by', 'boy', 'bat', 'bad']))

            .then(() => searchSignedObjs(connector, ['bass'], {limit: 3}))
            .then(results => results.map(r => r.owner))
            .then(results => expect(results).to.deep.equal(['bassoon', 'bass']))

            .then(() => searchSignedObjs(connector, ['bad'], {limit: 3}))
            .then(results => results.map(r => r.owner))
            .then(results => expect(results).to.deep.equal(['bad']))
    });

    it('should be able to search for signedObjects', () =>
        Promise.resolve(Date.now().toString())
            .then(passThroughAwait(base => Promise.all(['a', 'bass', 'boy', 'bad', 'bassoon'].map(name =>
                storeSignedObject(newLocalDbConnector(), [base, name], SignedObj.create({
                    owner: name,
                    signature: 'signed'
                }))
            ))))
            .then(passThroughAwait(base => searchSignedObjs(newLocalDbConnector(), [base, 'bas']).then(results => {
                expect(results).to.have.length(2);
                expect(results[0].owner).to.equal('bassoon')
                expect(results[1].owner).to.equal('bass')
            })))
            .then(passThroughAwait(base => searchSignedObjs(newLocalDbConnector(), [base, 'a']).then(results => {
                expect(results).to.have.length(1);
                expect(results[0].owner).to.equal('a');
            })))
            .then(passThroughAwait(base => searchSignedObjs(newLocalDbConnector(), [base, 'b']).then(results => {
                expect(results).to.have.length(4);
                expect(results.map(result => result.owner)).to.deep.equal(['boy', 'bassoon','bass', 'bad'])
            })))
            .then(passThroughAwait(base => searchSignedObjs(newLocalDbConnector(), [base, 'z']).then(results => {
                expect(results).to.have.length(0);
            })))
    )

});


