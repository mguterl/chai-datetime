(function(plugin){
  if (
    typeof require === "function"
    && typeof exports === "object"
    && typeof module === "object"
  ) {
    // NodeJS
    module.exports = plugin;
  } else if (
    typeof define === "function"
    && define.amd
  ) {
    // AMD
    define(function () {
      return plugin;
    });
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    chai.use(plugin);
  }
}(function(chai, utils){
  chai.datetime = chai.datetime || {};

  chai.datetime.formatDate = function(date) {
    return date.toDateString();
  }

  chai.datetime.formatTime = function(time) {
    return time;
  }

  chai.Assertion.addChainableMethod('equalTime', function(time) {
    var expected = time.getTime(),
    actual = this._obj.getTime();

    return this.assert(
      actual == expected,
      'expected ' + this._obj + ' to equal ' + time,
      'expected ' + this._obj + ' to not equal ' + time
    );
  });

  chai.Assertion.addChainableMethod('equalDate', function(date) {
    var expectedDate  = date.toDateString(),
    actualDate    = this._obj.toDateString();

    return this.assert(
      expectedDate === actualDate,
      'expected ' + actualDate + ' to equal ' + expectedDate,
      'expected ' + actualDate + ' to not equal ' + expectedDate
    );
  });

  chai.Assertion.addChainableMethod('beforeDate', function(date) {
    var actual = this._obj;

    this.assert(
      actual.getUTCFullYear <= date.getUTCFullYear && actual.getUTCMonth() <= date.getUTCMonth() && actual.getUTCDate() < date.getUTCDate(),
      'expected ' + chai.datetime.formatDate(actual) + ' to be before ' + chai.datetime.formatDate(date),
      'expected ' + chai.datetime.formatDate(actual) + ' not to be before ' + chai.datetime.formatDate(date)
    );
  });

  chai.Assertion.addChainableMethod('afterDate', function(date) {
    var actual = this._obj;

    this.assert(
      actual.getUTCFullYear >= date.getUTCFullYear && actual.getUTCMonth() >= date.getUTCMonth() && actual.getUTCDate() > date.getUTCDate(),
      'expected ' + chai.datetime.formatDate(actual) + ' to be after ' + chai.datetime.formatDate(date),
      'expected ' + chai.datetime.formatDate(actual) + ' not to be after ' + chai.datetime.formatDate(date)
    );
  });

  chai.Assertion.addChainableMethod('beforeTime', function(time) {
    var actual = this._obj;

    this.assert(
      actual.getTime() < time.getTime(),
      'expected ' + chai.datetime.formatTime(actual) + ' to be before ' + chai.datetime.formatTime(time),
      'expected ' + chai.datetime.formatTime(actual) + ' not to be before ' + chai.datetime.formatTime(time)
    );
  });

  chai.Assertion.addChainableMethod('afterTime', function(time) {
    var actual = this._obj;

    this.assert(
      actual.getTime() > time.getTime(),
      'expected ' + chai.datetime.formatTime(actual) + ' to be after ' + chai.datetime.formatTime(time),
      'expected ' + chai.datetime.formatTime(actual) + ' not to be after ' + chai.datetime.formatTime(time)
    );
  });

  // Asserts
  var assert = chai.assert;

  assert.equalDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalDate(exp);
  }

  assert.notEqualDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalDate(exp);
  }

  assert.beforeDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeDate(exp);
  }

  assert.notBeforeDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.beforeDate(exp);
  }

  assert.afterDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterDate(exp);
  }

  assert.notAfterDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.afterDate(exp);
  }

  assert.equalTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalTime(exp);
  }

  assert.notEqualTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalTime(exp);
  }

  assert.beforeTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.beforeTime(exp);
  }

  assert.notBeforeTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).not.to.be.beforeTime(exp);
  }

  assert.afterTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.afterTime(exp);
  }

  assert.notAfterTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.afterTime(exp);
  }

}));
