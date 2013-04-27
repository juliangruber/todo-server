#!/usr/bin/env node

var Server = require('..');
var optimist = require('optimist');

/**
 * Server bin script.
 *
 * Example:
 *
 *   $ todo-server --port 8080 --db ./db
 *
 */

var argv = optimist
  .usage('Usage: $0 --port [port] --db [path]')
  .describe('port', 'Port to listen on')
  .alias('port', 'p')
  .describe('db', 'Path of the database')
  .alias('db', 'd')
  .demand(['port', 'db'])
  .argv;

Server(argv.db).listen(argv.port, function () {
  console.log('~ ToDo Server listening on port %s', argv.port);
});
