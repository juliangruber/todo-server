var test = require('tap').test;
var Server = require('..');
var Doc = require('crdt').Doc;

test('get model', function (t) {
  var server = new Server('/tmp/db' + Math.random().toString(16).slice(2));
  var clientDoc = new Doc();

  server.getDocument(function (err, serverDoc) {
    t.error(err, 'no error');

    var cs = clientDoc.createStream();
    //ds.on('data', console.log.bind(console, 'Document:'));

    var ss = serverDoc.createStream();
    //ss.on('data', console.log.bind(console, 'Server:'));
    
    cs.pipe(ss).pipe(cs);

    cs.on('sync', function () {
      t.ok(true, 'sync event');
      t.end();
    });
  });
});
