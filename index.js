var Doc = require('crdt').Doc;
var net = require('net');
var levelup = require('levelup');
var levelScuttlebutt = require('level-scuttlebutt');
var SubLevel = require('level-sublevel');
var udid = require('udid')('todo server');
var debug = require('debug')('server');

module.exports = Server;

/**
 * ToDo Server.
 *
 * @param {String} path
 * @return {Server}
 */

function Server (path) {
  if (!(this instanceof Server)) return new Server(path);

  this.db = SubLevel(levelup(path));
  this.crdt = this.db.sublevel('crdt');

  debug('udid: %s', udid);

  levelScuttlebutt(this.crdt, udid, function (name) {
    return new Doc();
  });
}

/**
 * Create a stream of the underlying document.
 *
 * @param {Function} cb
 */

Server.prototype.getDocument = function (cb) {
  this.crdt.open('crdt', cb);
}

/**
 * Start listening on `port`.
 *
 * @param {Number} port
 * @param {Function=} cb
 * @return {net.server}
 */

Server.prototype.listen = function (port, cb) {
  var self = this;

  var server = net.createServer(function (con) {
    var ended = false;
    con.pause();
    con.once('end', function () {
      var ended = true;
    });
    self.getDocument(function (err, doc) {
      if (ended) return;
      
      if (err) return con.write(JSON.stringify(err));

      con.pipe(doc.createStream()).pipe(con);  
      con.resume();

      con.once('end', doc.dispose.bind(doc));
    });
  })

  server.listen(port, cb || function () {});
  return server;
}

/**
 * Free the underlying LevelDB.
 *
 * @param {Function=} cb
 */

Server.prototype.close = function (cb) {
  this.db.close(cb || function () {});
};
