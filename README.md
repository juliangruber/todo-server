
# todo-server

Expose a [ToDo model](https://github.com/juliangruber/todo-model) over the
network.

## Usage

```js
var Server = require('todo-server');
var Doc = require('crdt').Doc;

// Start a server on port 9999
Server('/tmp/db').listen(9999);

var doc = new Doc();
var docStream = doc.createStream();
var Model = require('todo-model')(doc);

// replicate the local doc with the server
docStream.pipe(net.connect(9999)).pipe(docStream);

console.log(Model.Tasks.find());
// outputs all the tasks stored in the db
```

## API

### Server(path)

Create a new Server that stores its data in a
[LevelDB](https://github.com/rvagg/node-levelup) at `path`.

### Server#getDocument(cb)

Calls `cb` with `(err, doc)` where `doc` is the underlying
[CRDT](https://github.com/dominictarr/crdt) document.

Don't forget to call `doc.dispose()` when you're done.

### Server#listen(port)

Start listening on `port`. Returns a `net.server`.

## CLI

```bash
$ todo-server
Usage: todo-server --port [port] --db [path]

Options:
  --port, -p  Port to listen on     [required]
  --db, -d    Path of the database  [required]
```

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install todo-server    # for library
$ npm install todo-server -g # for cil
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
