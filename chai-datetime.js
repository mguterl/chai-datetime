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
}));
