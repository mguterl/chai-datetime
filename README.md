# chai-datetime

Matchers for chai to help with common assertions against JavaScript
Date objects.

## Usage

### Browser

```html
<script src="chai.js"></script>
<script src="chai-datetime.js"></script>
```

### Server

```javascript
var chai = require('chai');
chai.use(require('chai-datetime'));
```

## Assertions

### equalTime

Value comparison for Date objects, including their time component.

```javascript
var subject = new Date(2013, 4, 30, 16, 5);

subject.should.equalTime(new Date(2013, 4, 30, 16, 5));
subject.should.not.equalTime(new Date(2013, 4, 30, 16, 6));

expect(subject).to.equalTime(new Date(2013, 4, 30, 16, 5));
expect(subject).not.to.equalTime(new Date(2013, 4, 30, 16, 6));

assert.equalTime(subject, new Date(2013, 4, 30, 16, 5));
assert.notEqualTime(subject, new Date(2013, 4, 30, 16, 6));
```

### equalDate

Value comparison for Date objects, only comparing the date portion,
ignoring the time.

```javascript
var subject = new Date(2013, 4, 30, 16, 5);

subject.should.equalDate(new Date(2013, 4, 30, 16, 6));
subject.should.not.equalDate(new Date(2013, 4, 29, 16, 6));

expect(subject).to.equalDate(new Date(2013, 4, 30, 16, 6));
expect(subject).not.to.equalDate(new Date(2013, 4, 29, 16, 6));

assert.equalTime(subject, new Date(2013, 4, 30, 16, 6));
assert.notEqualTime(subject, new Date(2013, 4, 29, 16, 6));
```

## Thanks

Thanks to @mitchlloyd for pairing with me on this to help get me
started. Thanks to @rockwood for putting up with my continuous
trolling.

Thanks to the [chai-fuzzy](https://github.com/elliotf/chai-fuzzy)
module for giving me an idea for how to structure and test a chai
plugin.
