export function equalTime(actual, expected) {
  return actual.getTime() == expected.getTime();
}

export function closeToTime(actual, expected, deltaInSeconds) {
  if (
    (!deltaInSeconds && deltaInSeconds !== 0) ||
    typeof deltaInSeconds !== "number"
  ) {
    throw new chai.AssertionError(
      "second argument of closeToTime, 'deltaInSeconds', must be a positive number"
    );
  }

  return (
    Math.abs(actual.getTime() - expected.getTime()) < deltaInSeconds * 1000
  );
}

export function equalDate(actual, expected) {
  return actual.toDateString() === expected.toDateString();
}

export function beforeDate(actual, expected) {
  return beforeTime(dateWithoutTime(actual), dateWithoutTime(expected));
}

export function afterDate(actual, expected) {
  return afterTime(dateWithoutTime(actual), dateWithoutTime(expected));
}

export function withinDate(actual, expectedFrom, expectedTo) {
  return withinTime(
    dateWithoutTime(actual),
    dateWithoutTime(expectedFrom),
    dateWithoutTime(expectedTo)
  );
}

export function beforeTime(actual, expected) {
  return actual.getTime() < expected.getTime();
}

export function afterTime(actual, expected) {
  return actual.getTime() > expected.getTime();
}

export function withinTime(actual, expectedFrom, expectedTo) {
  return (
    actual.getTime() >= expectedFrom.getTime() &&
    actual.getTime() <= expectedTo.getTime()
  );
}

export function formatDate(date) {
  return date.toDateString();
}

export function formatTime(time) {
  return (
    time.toDateString() +
    " " +
    padNumber(time.getHours()) +
    ":" +
    padNumber(time.getMinutes()) +
    ":" +
    padNumber(time.getSeconds()) +
    "." +
    padNumber(time.getMilliseconds(), 3) +
    " (" +
    getFormattedTimezone(time.getTimezoneOffset()) +
    ")"
  );
}

function padNumber(num, length) {
  var ret = "" + num;
  var i = ret.length;

  if (!isFinite(length)) {
    length = 2;
  }

  for (i; i < length; i++) {
    ret = "0" + ret;
  }

  return ret;
}

export function getFormattedTimezone(timezoneInMinutes) {
  var tz = Math.abs(timezoneInMinutes);
  var hours = Math.floor(tz / 60);
  var minutes = tz % 60;
  var isAheadOfUtc = timezoneInMinutes <= 0;

  return (
    (isAheadOfUtc ? "+" : "-") + padNumber(hours) + ":" + padNumber(minutes)
  );
}

function dateWithoutTime(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export default function (chai, utils) {
  chai.Assertion.addChainableMethod("equalTime", function (expected) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(actual);

    return this.assert(
      equalTime(expected, actual),
      "expected " + actualFormatted + " to equal " + expectedFormatted,
      "expected " + actualFormatted + " to not equal " + expectedFormatted,
      expectedFormatted,
      actualFormatted
    );
  });

  chai.Assertion.addChainableMethod("closeToTime", function (
    expected,
    deltaInSeconds
  ) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(this._obj);

    return this.assert(
      closeToTime(expected, actual, deltaInSeconds),
      "expected " +
        actualFormatted +
        " to be within " +
        deltaInSeconds +
        "s of " +
        expectedFormatted,
      "expected " +
        actualFormatted +
        " to not be within " +
        deltaInSeconds +
        "s of " +
        expectedFormatted,
      expectedFormatted + " ± " + deltaInSeconds + "sec",
      actualFormatted
    );
  });

  chai.Assertion.addChainableMethod("equalDate", function (expected) {
    var expectedDateFormatted = formatDate(expected),
      actualDateFormatted = formatDate(this._obj);

    return this.assert(
      equalDate(this._obj, expected),
      "expected " + actualDateFormatted + " to equal " + expectedDateFormatted,
      "expected " +
        actualDateFormatted +
        " to not equal " +
        expectedDateFormatted,
      expectedDateFormatted,
      actualDateFormatted
    );
  });

  chai.Assertion.addChainableMethod("beforeDate", function (expected) {
    var actual = this._obj;
    var expectedDateFormatted = formatDate(expected),
      actualDateFormatted = formatDate(this._obj);

    this.assert(
      beforeDate(actual, expected),
      "expected " +
        actualDateFormatted +
        " to be before " +
        expectedDateFormatted,
      "expected " +
        actualDateFormatted +
        " not to be before " +
        expectedDateFormatted
    );
  });

  chai.Assertion.addChainableMethod("beforeOrEqualDate", function (expected) {
    var actual = this._obj;
    var expectedDateFormatted = formatDate(expected),
      actualDateFormatted = formatDate(this._obj);

    this.assert(
      beforeDate(actual, expected) || equalDate(actual, expected),
      "expected " +
        actualDateFormatted +
        " to be before or equal to " +
        expectedDateFormatted,
      "expected " +
        actualDateFormatted +
        " not to be before or equal to " +
        expectedDateFormatted
    );
  });

  chai.Assertion.addChainableMethod("afterDate", function (expected) {
    var actual = this._obj;
    var expectedDateFormatted = formatDate(expected),
      actualDateFormatted = formatDate(this._obj);

    this.assert(
      afterDate(actual, expected),
      "expected " +
        actualDateFormatted +
        " to be after " +
        expectedDateFormatted,
      "expected " +
        actualDateFormatted +
        " not to be after " +
        expectedDateFormatted
    );
  });

  chai.Assertion.addChainableMethod("afterOrEqualDate", function (expected) {
    var actual = this._obj;
    var expectedDateFormatted = formatDate(expected),
      actualDateFormatted = formatDate(this._obj);

    this.assert(
      afterDate(actual, expected) || equalDate(actual, expected),
      "expected " +
        actualDateFormatted +
        " to be after or equal to " +
        expectedDateFormatted,
      "expected " +
        actualDateFormatted +
        " not to be after or equal to " +
        expectedDateFormatted
    );
  });

  chai.Assertion.addChainableMethod("withinDate", function (
    expectedFrom,
    expectedTo
  ) {
    var actual = this._obj;
    var expectedDateFromFormatted = formatDate(expectedFrom),
      expectedDateToFormatted = formatDate(expectedTo),
      actualDateFormatted = formatDate(this._obj);

    this.assert(
      withinDate(actual, expectedFrom, expectedTo),
      "expected " +
        actualDateFormatted +
        " to be within " +
        expectedDateFromFormatted +
        " and " +
        expectedDateToFormatted,
      "expected " +
        actualDateFormatted +
        " not to be within " +
        expectedDateFromFormatted +
        " and " +
        expectedDateToFormatted
    );
  });

  chai.Assertion.addChainableMethod("beforeTime", function (expected) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(actual);

    this.assert(
      beforeTime(actual, expected),
      "expected " + actualFormatted + " to be before " + expectedFormatted,
      "expected " + actualFormatted + " not to be before " + expectedFormatted
    );
  });

  chai.Assertion.addChainableMethod("beforeOrEqualTime", function (expected) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(actual);

    this.assert(
      beforeTime(actual, expected) || equalTime(actual, expected),
      "expected " +
        actualFormatted +
        " to be before or equal to " +
        expectedFormatted,
      "expected " +
        actualFormatted +
        " not to be before or equal to " +
        expectedFormatted
    );
  });

  chai.Assertion.addChainableMethod("afterTime", function (expected) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(actual);

    this.assert(
      afterTime(actual, expected),
      "expected " + actualFormatted + " to be after " + expectedFormatted,
      "expected " + actualFormatted + " not to be after " + expectedFormatted
    );
  });

  chai.Assertion.addChainableMethod("afterOrEqualTime", function (expected) {
    var actual = this._obj;
    var expectedFormatted = formatTime(expected),
      actualFormatted = formatTime(actual);

    this.assert(
      afterTime(actual, expected) || equalTime(actual, expected),
      "expected " +
        actualFormatted +
        " to be after or equal to " +
        expectedFormatted,
      "expected " +
        actualFormatted +
        " not to be after or equal to " +
        expectedFormatted
    );
  });

  chai.Assertion.addChainableMethod("withinTime", function (
    expectedFrom,
    expectedTo
  ) {
    var actual = this._obj;
    var expectedFromFormatted = formatTime(expectedFrom),
      expectedToFormatted = formatTime(expectedTo),
      actualFormatted = formatTime(actual);

    this.assert(
      withinTime(actual, expectedFrom, expectedTo),
      "expected " +
        actualFormatted +
        " to be within " +
        expectedFromFormatted +
        " and " +
        expectedToFormatted,
      "expected " +
        actualFormatted +
        " not to be within " +
        expectedFromFormatted +
        " and " +
        expectedToFormatted
    );
  });

  var assert = chai.assert;

  assert.equalDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalDate(exp);
  };

  assert.notEqualDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalDate(exp);
  };

  assert.beforeDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeDate(exp);
  };

  assert.notBeforeDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.beforeDate(exp);
  };

  assert.beforeOrEqualDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeOrEqualDate(exp);
  };

  assert.notBeforeOrEqualDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.beforeOrEqualDate(exp);
  };

  assert.afterDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterDate(exp);
  };

  assert.notAfterDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.afterDate(exp);
  };

  assert.afterOrEqualDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterOrEqualDate(exp);
  };

  assert.notAfterOrEqualDate = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.afterOrEqualDate(exp);
  };

  assert.withinDate = function (val, expFrom, expTo, msg) {
    new chai.Assertion(val, msg).to.be.withinDate(expFrom, expTo);
  };

  assert.notWithinDate = function (val, expFrom, expTo, msg) {
    new chai.Assertion(val, msg).not.to.be.withinDate(expFrom, expTo);
  };

  assert.equalTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalTime(exp);
  };

  assert.notEqualTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalTime(exp);
  };

  assert.beforeTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeTime(exp);
  };

  assert.notBeforeTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.beforeTime(exp);
  };

  assert.beforeOrEqualTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeOrEqualTime(exp);
  };

  assert.notBeforeOrEqualTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.beforeOrEqualTime(exp);
  };

  assert.afterTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterTime(exp);
  };

  assert.notAfterTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.afterTime(exp);
  };

  assert.afterOrEqualTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterOrEqualTime(exp);
  };

  assert.notAfterOrEqualTime = function (val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.afterOrEqualTime(exp);
  };

  assert.closeToTime = function (val, exp, delta, msg) {
    new chai.Assertion(val, msg).to.be.closeToTime(exp, delta);
  };

  assert.withinTime = function (val, expFrom, expTo, msg) {
    new chai.Assertion(val, msg).to.be.withinTime(expFrom, expTo);
  };

  assert.notWithinTime = function (val, expFrom, expTo, msg) {
    new chai.Assertion(val, msg).not.to.be.withinTime(expFrom, expTo);
  };
}
