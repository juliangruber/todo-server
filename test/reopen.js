var test = require('tap').test;
var Server = require('..');
var Doc = require('crdt').Doc;

test('reopen', function (t) {
  var path = '/tmp/db' + Math.random().toString(16).slice(2);

  setup(t, path, function (clientDoc, serverDoc, server) {
    clientDoc.add({some:'obj'});
    
    setTimeout(function () {
      server.close(function (err) {
        t.error(err, 'closes');

        setup(t, path, function (clientDoc, serverDoc) {
          clientDoc.on('create', function (row) {
            t.equal(row.get('some'), 'restores');
            t.end();
          });
        });
      });
    }, 500);
  });
});

function setup (t, path, cb) {
  var server = new Server(path);
  var clientDoc = new Doc();
  server.getDocument(function (err, serverDoc) {
    t.error(err, 'opens');

    var cs = clientDoc.createStream();
    cs.pipe(serverDoc.createStream()).pipe(cs);

    cb(clientDoc, serverDoc, server);
  });
}
