# tinyid

Generate unique random ids from integer keys.

![build status](http://img.shields.io/travis/izaakschroeder/tinyid/master.svg?style=flat)
![coverage](http://img.shields.io/coveralls/izaakschroeder/tinyid/master.svg?style=flat)
![license](http://img.shields.io/npm/l/tinyid.svg?style=flat)
![version](http://img.shields.io/npm/v/tinyid.svg?style=flat)
![downloads](http://img.shields.io/npm/dm/tinyid.svg?style=flat)

Start generating ids straight away:

```javascript
var tinyid = require('tinyid');

tinyid.encode(5);
tinyid.decode('5TXE2');
```

Or customize:

```javascript
var tinyid = require('tinyid');

var generator = tinyid({
	wheel: 'abcdef1234',
	padding: 5
});

generator.encode(463);
```

[sql]: https://gist.github.com/robcowie/1539835
[codes]: http://alchemise.net/wordpress/?p=40
