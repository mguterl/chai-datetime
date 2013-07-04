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
    )
  });

  // Asserts
  var assert = chai.assert;

  assert.equalDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalDate(exp);
  }

  assert.notEqualDate = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalDate(exp);
  }

  assert.equalTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.be.equalTime(exp);
  }

  assert.notEqualTime = function(val, exp, msg) {
    new chai.Assertion(val, msg).to.not.be.equalTime(exp);
  }

}));
