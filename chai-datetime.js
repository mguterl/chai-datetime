(function (plugin) {
  if (
    typeof require === "function" &&
    typeof exports === "object" &&
    typeof module === "object"
  ) {
    // NodeJS
    module.exports = plugin;
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(function () {
      return plugin;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(plugin);
  }
})(function (chai, utils) {
  chai.datetime = chai.datetime || {};

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

  chai.datetime.getFormattedTimezone = function (timezoneInMinutes) {
    var tz = Math.abs(timezoneInMinutes);
    var hours = Math.floor(tz / 60);
    var minutes = tz % 60;
    var isAheadOfUtc = timezoneInMinutes <= 0;

    return (
      (isAheadOfUtc ? "+" : "-") + padNumber(hours) + ":" + padNumber(minutes)
    );
  };

  chai.datetime.formatDate = function (date) {
    return date.toDateString();
  };

  chai.datetime.formatTime = function (time) {
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
      chai.datetime.getFormattedTimezone(time.getTimezoneOffset()) +
      ")"
    );
  };

  chai.datetime.equalTime = function (actual, expected) {
    return actual.getTime() == expected.getTime();
  };

  chai.datetime.closeToTime = function (actual, expected, deltaInSeconds) {
    return (
      Math.abs(actual.getTime() - expected.getTime()) < deltaInSeconds * 1000
    );
  };

  chai.datetime.equalDate = function (actual, expected) {
    return actual.toDateString() === expected.toDateString();
  };

  var dateWithoutTime = function (date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  chai.datetime.beforeDate = function (actual, expected) {
    return chai.datetime.beforeTime(
      dateWithoutTime(actual),
      dateWithoutTime(expected)
    );
  };

  chai.datetime.afterDate = function (actual, expected) {
    return chai.datetime.afterTime(
      dateWithoutTime(actual),
      dateWithoutTime(expected)
    );
  };

  chai.datetime.withinDate = function (actual, expectedFrom, expectedTo) {
    return chai.datetime.withinTime(
      dateWithoutTime(actual),
      dateWithoutTime(expectedFrom),
      dateWithoutTime(expectedTo)
    );
  };

  chai.datetime.beforeTime = function (actual, expected) {
    return actual.getTime() < expected.getTime();
  };

  chai.datetime.afterTime = function (actual, expected) {
    return actual.getTime() > expected.getTime();
  };

  chai.datetime.withinTime = function (actual, expectedFrom, expectedTo) {
    return (
      actual.getTime() >= expectedFrom.getTime() &&
      actual.getTime() <= expectedTo.getTime()
    );
  };

  chai.Assertion.addChainableMethod("equalTime", function (expected) {
    var actual = this._obj;

    return this.assert(
      chai.datetime.equalTime(expected, actual),
      "expected " + this._obj + " to equal " + expected,
      "expected " + this._obj + " to not equal " + expected,
      expected.toString(),
      actual.toString()
    );
  });

  chai.Assertion.addChainableMethod("closeToTime", function (
    expected,
    deltaInSeconds
  ) {
    var actual = this._obj;

    if (
      (!deltaInSeconds && deltaInSeconds !== 0) ||
      typeof deltaInSeconds !== "number"
    ) {
      throw new chai.AssertionError(
        "second argument of closeToTime, 'deltaInSeconds', must be a number"
      );
    }

    return this.assert(
      chai.datetime.closeToTime(expected, actual, deltaInSeconds),
      "expected " +
        this._obj +
        " to be within " +
        deltaInSeconds +
        "s of " +
        expected,
      "expected " +
        this._obj +
        " to not be within " +
        deltaInSeconds +
        "s of " +
        expected,
      expected.toString(),
      actual.toString()
    );
  });

  chai.Assertion.addChainableMethod("equalDate", function (expected) {
    var expectedDate = chai.datetime.formatDate(expected),
      actualDate = chai.datetime.formatDate(this._obj);

    return this.assert(
      chai.datetime.equalDate(this._obj, expected),
      "expected " + actualDate + " to equal " + expectedDate,
      "expected " + actualDate + " to not equal " + expectedDate
    );
  });

  chai.Assertion.addChainableMethod("beforeDate", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.beforeDate(actual, expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " to be before " +
        chai.datetime.formatDate(expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " not to be before " +
        chai.datetime.formatDate(expected)
    );
  });

  chai.Assertion.addChainableMethod("beforeOrEqualDate", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.beforeDate(actual, expected) ||
        chai.datetime.equalDate(actual, expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " to be before or equal to " +
        chai.datetime.formatDate(expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " not to be before or equal to " +
        chai.datetime.formatDate(expected)
    );
  });

  chai.Assertion.addChainableMethod("afterDate", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.afterDate(actual, expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " to be after " +
        chai.datetime.formatDate(expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " not to be after " +
        chai.datetime.formatDate(expected)
    );
  });

  chai.Assertion.addChainableMethod("afterOrEqualDate", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.afterDate(actual, expected) ||
        chai.datetime.equalDate(actual, expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " to be after or equal to " +
        chai.datetime.formatDate(expected),
      "expected " +
        chai.datetime.formatDate(actual) +
        " not to be after or equal to " +
        chai.datetime.formatDate(expected)
    );
  });

  chai.Assertion.addChainableMethod("withinDate", function (
    expectedFrom,
    expectedTo
  ) {
    var actual = this._obj;

    this.assert(
      chai.datetime.withinDate(actual, expectedFrom, expectedTo),
      "expected " +
        chai.datetime.formatDate(actual) +
        " to be within " +
        chai.datetime.formatDate(expectedFrom) +
        " and " +
        chai.datetime.formatDate(expectedTo),
      "expected " +
        chai.datetime.formatDate(actual) +
        " not to be within " +
        chai.datetime.formatDate(expectedFrom) +
        " and " +
        chai.datetime.formatDate(expectedTo)
    );
  });

  chai.Assertion.addChainableMethod("beforeTime", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.beforeTime(actual, expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " to be before " +
        chai.datetime.formatTime(expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " not to be before " +
        chai.datetime.formatTime(expected)
    );
  });

  chai.Assertion.addChainableMethod("beforeOrEqualTime", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.beforeTime(actual, expected) ||
        chai.datetime.equalTime(actual, expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " to be before or equal to " +
        chai.datetime.formatTime(expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " not to be before or equal to " +
        chai.datetime.formatTime(expected)
    );
  });

  chai.Assertion.addChainableMethod("afterTime", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.afterTime(actual, expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " to be after " +
        chai.datetime.formatTime(expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " not to be after " +
        chai.datetime.formatTime(expected)
    );
  });

  chai.Assertion.addChainableMethod("afterOrEqualTime", function (expected) {
    var actual = this._obj;

    this.assert(
      chai.datetime.afterTime(actual, expected) ||
        chai.datetime.equalTime(actual, expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " to be after or equal to " +
        chai.datetime.formatTime(expected),
      "expected " +
        chai.datetime.formatTime(actual) +
        " not to be after or equal to " +
        chai.datetime.formatTime(expected)
    );
  });

  chai.Assertion.addChainableMethod("withinTime", function (
    expectedFrom,
    expectedTo
  ) {
    var actual = this._obj;

    this.assert(
      chai.datetime.withinTime(actual, expectedFrom, expectedTo),
      "expected " +
        chai.datetime.formatTime(actual) +
        " to be within " +
        chai.datetime.formatTime(expectedFrom) +
        " and " +
        chai.datetime.formatTime(expectedTo),
      "expected " +
        chai.datetime.formatTime(actual) +
        " not to be within " +
        chai.datetime.formatTime(expectedFrom) +
        " and " +
        chai.datetime.formatTime(expectedTo)
    );
  });

  // Asserts
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
});
