const commandUtils = require( './command-utils' );
const execSync = require('child_process').execSync;
const envUtils = require('./env-utils');
const gateway = require( './gateway' );
const environment = require( './environment' );

const command = async function() {
    let envSlug = await envUtils.parseEnvFromCWD();
    if ( envSlug === false ) {
        console.error( "Error: Unable to determine which environment to use wp snapshots with. Please run this command from within your environment." );
        process.exit(1);
    }

    let envPath = await envUtils.envPath( envSlug );
    let container = commandUtils.subcommand() || 'phpfpm';

    await gateway.startGlobal();
    await environment.start( envSlug );

    try {
        execSync( `cd ${envPath} && docker-compose exec ${container} bash`, { stdio: 'inherit' });
    } catch (ex) {}

    process.exit();
};

module.exports = { command };
