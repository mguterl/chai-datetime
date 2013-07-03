var chai = require('chai');
chai.Assertion.includeStack = true;
var should = chai.should();
var assert = chai.assert;
var datetime = require('../chai-datetime');
chai.use(datetime);

chai.use(function (chai, utils) {
  inspect = utils.objDisplay;

  chai.Assertion.addMethod('fail', function (message) {
    var obj = this._obj;

    new chai.Assertion(obj).is.a('function');

    try {
      obj();
    } catch (err) {
      this.assert(
        err instanceof chai.AssertionError
        , 'expected #{this} to fail, but it threw ' + inspect(err));
      this.assert(
        err.message === message
        , 'expected #{this} to fail with ' + inspect(message) + ', but got ' + inspect(err.message));
      return;
    }

    this.assert(false, 'expected #{this} to fail');
  });
});

describe('chai-datetime', function() {
  describe('matchers', function() {
    describe('equalTime', function() {
      beforeEach(function() {
        this.subject = new Date(2013, 4, 30, 16, 5);
        this.same = new Date(2013, 4, 30, 16, 5);
        this.different = new Date(2013, 4, 30, 16, 6);
      });

      describe('when given two date objects with the same values', function() {
        it('passes', function() {
          this.subject.should.be.equalTime(this.same);
        });

        describe('when negated', function() {
          it('fails', function() {
            var test = this;

            (function() {
              test.subject.should.not.be.equalTime(test.same);
            }).should.fail(
              'expected ' + test.subject + ' to not equal ' + test.same
            );
          });
        });
      });

      describe('when given two date objects with different values', function() {
        it('fails', function() {
          var test = this;

          (function() {
            test.subject.should.be.equalTime(test.different);
          }).should.fail(
            'expected ' + test.subject + ' to equal ' + test.different
          );
        });

        describe('when negated', function() {
          it('passes', function() {
            this.subject.should.not.be.equalTime(this.different);
          });
        });
      });

    });

    describe('equalDate', function() {
      // TODO
    });
  });
});
