import {readSignedObjectsSorted, searchSignedObjs, storeSignedObject, waitUntilNodeIncluded} from "./dag-client";
import {DbConnector} from "./DbConnector";



export const newLocalDbConnector = (): DbConnector => ({
    readSignedObjectsSorted: readSignedObjectsSorted,
    storeSignedObject: storeSignedObject,
    waitUntilNodeIncluded: waitUntilNodeIncluded,
    searchSignedObjs: searchSignedObjs
});