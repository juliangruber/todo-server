var test = require('tap').test;
var Server = require('..');
var Doc = require('crdt').Doc;
var net = require('net');

test('Server#getModel(cb)', function (t) {
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

test('Server#listen(port)', function (t) {
  var server = new Server('/tmp/db' + Math.random().toString(16).slice(2));
  var clientDoc = new Doc();

  var port = Math.floor(10000 + Math.random() * 55000);
  var handle = server.listen(port);

  var cs = clientDoc.createStream();
  //ds.on('data', console.log.bind(console, 'Document:'));

  var ss = net.connect(port);
  //ss.on('data', console.log.bind(console, 'Server:'));
  
  cs.pipe(ss).pipe(cs);

  cs.on('sync', function () {
    handle.close();
    ss.end();
    t.ok(true, 'sync event');
    t.end();
  });
});
