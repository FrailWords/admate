import {visit} from "./capture_ads.js";
import pkg from 'buttercup';
import {env, exit} from "process";
const { Credentials, FileDatasource, Vault, init } = pkg;

init()

const datasourceCredentials = Credentials.fromDatasource({
    path: "./user.bcup",
    type: 'test',
}, env["MASTER_PASSWORD"]);
const fileDatasource = new FileDatasource(datasourceCredentials);

// Read vault from disk (returns history and format)
const vaultCredentials = Credentials.fromPassword("password marvel custom shine!");
const loadedState = await fileDatasource.load(vaultCredentials);
// Create a new vault instance from the loaded data
const vault = Vault.createFromHistory(loadedState.history, loadedState.Format);

vault.getAllGroups()

const profile = env['PROFILE']

if (profile === undefined) {
    console.log("Profile is undefined!")
    exit(0)
}

const entries = vault.findEntriesByProperty('title', profile)
const thisProfile = entries[0]!;

visit(thisProfile)

