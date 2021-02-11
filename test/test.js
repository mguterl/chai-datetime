(function (test) {
  if (
    typeof require === "function" &&
    typeof exports === "object" &&
    typeof module === "object"
  ) {
    // NodeJS
    (function () {
      var chai = require("chai");
      chai.config.includeStack = true;
      test(chai, true);
    })();
  } else {
    // Other environment (usually <script> tag): plug in to global chai instance directly.
    test(chai, false);
  }
})(function (chai, testingServer) {
  var should = chai.should();
  var assert = chai.assert;

  if (testingServer) {
    var datetime = require("../chai-datetime");
    chai.use(datetime);
  }

  chai.use(function (chai, utils) {
    inspect = utils.objDisplay;

    chai.Assertion.addMethod("fail", function (message) {
      var obj = this._obj;

      new chai.Assertion(obj).is.a("function");

      try {
        obj();
      } catch (err) {
        this.assert(
          err instanceof chai.AssertionError,
          "expected #{this} to fail, but it threw " + inspect(err)
        );
        this.assert(
          err.message === message,
          "expected #{this} to fail with " +
            inspect(message) +
            ", but got " +
            inspect(err.message)
        );
        return;
      }

      this.assert(false, "expected #{this} to fail");
    });
  });

  describe("chai-datetime", function () {
    describe("helpers", function () {
      describe("afterDate", function () {
        describe("when given two identical date objects", function () {
          beforeEach(function () {
            this.actual = new Date(2013, 3, 30);
            this.expected = new Date(2013, 3, 30);
          });

          it("returns false", function () {
            chai.datetime
              .afterDate(this.actual, this.expected)
              .should.be.eq(false);
          });

          it("should not be affected by time zones", function () {
            var midnight = new Date(2014, 0, 1, 0);
            var endOfDay = new Date(2014, 0, 1, 23);
            chai.datetime.afterDate(endOfDay, midnight).should.be.false;
          });
        });

        describe("when given the actual is before the expected", function () {
          beforeEach(function () {
            this.actual = new Date(2014, 0, 31);
            this.expected = new Date(2014, 11, 1);
          });

          it("returns false", function () {
            chai.datetime
              .afterDate(this.actual, this.expected)
              .should.be.eq(false);
          });
        });

        describe("when given the actual is after the expected", function () {
          beforeEach(function () {
            this.actual = new Date(2013, 3, 30);
            this.expected = new Date(2013, 3, 29);
          });

          it("returns true", function () {
            chai.datetime
              .afterDate(this.actual, this.expected)
              .should.be.eq(true);
          });
        });

        describe("when the year differs", function () {
          // BUG: https://github.com/gaslight/chai-datetime/issues/13
          beforeEach(function () {
            this.actual = new Date(2014, 0, 2);
            this.expected = new Date(2013, 0, 2);
          });

          it("returns true", function () {
            chai.datetime
              .afterDate(this.actual, this.expected)
              .should.be.eq(true);
          });
        });
      });

      describe("beforeDate", function () {
        describe("when given two identical date objects", function () {
          beforeEach(function () {
            this.actual = new Date(2013, 3, 30);
            this.expected = new Date(2013, 3, 30);
          });

          it("returns false", function () {
            chai.datetime
              .beforeDate(this.actual, this.expected)
              .should.be.eq(false);
          });

          it("should not be affected by time zones", function () {
            var midnight = new Date(2014, 0, 1, 0);
            var endOfDay = new Date(2014, 0, 1, 23);
            chai.datetime.beforeDate(midnight, endOfDay).should.be.false;
          });
        });

        describe("when given the actual is before the expected", function () {
          beforeEach(function () {
            this.actual = new Date(2013, 3, 29);
            this.expected = new Date(2013, 3, 30);
          });

          it("returns true", function () {
            chai.datetime
              .beforeDate(this.actual, this.expected)
              .should.be.eq(true);
          });
        });

        describe("when given the actual is after the expected", function () {
          beforeEach(function () {
            this.actual = new Date(2048, 0, 1);
            this.expected = new Date(2014, 11, 31);
          });

          it("returns false", function () {
            chai.datetime
              .beforeDate(this.actual, this.expected)
              .should.be.eq(false);
          });
        });

        describe("when the year differs", function () {
          // BUG: https://github.com/gaslight/chai-datetime/issues/13
          beforeEach(function () {
            this.actual = new Date(2013, 0, 2);
            this.expected = new Date(2014, 0, 2);
          });

          it("returns true", function () {
            chai.datetime
              .beforeDate(this.actual, this.expected)
              .should.be.eq(true);
          });
        });
      });
    });

    describe("matchers", function () {
      describe("equalTime", function () {
        beforeEach(function () {
          this.subject = new Date(2013, 4, 30, 16, 5);
          this.same = new Date(2013, 4, 30, 16, 5);
          this.different = new Date(2013, 4, 30, 16, 6);
        });

        describe("when given two date objects with the same values", function () {
          it("passes", function () {
            this.subject.should.be.equalTime(this.same);
          });

          describe("when negated", function () {
            it("fails", function () {
              var test = this;

              (function () {
                test.subject.should.not.be.equalTime(test.same);
              }.should.fail(
                "expected " + test.subject + " to not equal " + test.same
              ));
            });
          });
        });

        describe("when given two date objects with different values", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.subject.should.be.equalTime(test.different);
            }.should.fail(
              "expected " + test.subject + " to equal " + test.different
            ));
          });

          describe("when negated", function () {
            it("passes", function () {
              this.subject.should.not.be.equalTime(this.different);
            });
          });
        });
      });

      describe("closeToTime", function () {
        beforeEach(function () {
          this.subject = new Date(2013, 4, 30, 16, 5, 16, 323);
          this.subjetPlus200Milliseconds = new Date(
            2013,
            4,
            30,
            16,
            5,
            16,
            523
          );
          this.subjetPlus3seconds = new Date(2013, 4, 30, 16, 5, 19, 323);
          this.different = new Date(2013, 4, 30, 18, 6);
        });

        describe("when given two date objects within the configured delta", function () {
          const deltaInSeconds = 5;

          it("passes", function () {
            this.subject.should.be.closeToTime(
              this.subjetPlus3seconds,
              deltaInSeconds
            );
          });

          describe("when negated", function () {
            it("fails", function () {
              var test = this;

              (function () {
                test.subject.should.not.be.closeToTime(
                  test.subjetPlus3seconds,
                  deltaInSeconds
                );
              }.should.fail(
                "expected " +
                  test.subject +
                  " to not be within 5s of " +
                  test.subjetPlus3seconds
              ));
            });
          });
        });

        describe("when given two date objects with values not within configured delta", function () {
          const deltaInSeconds = 50;
          it("fails", function () {
            var test = this;

            (function () {
              test.subject.should.be.closeToTime(
                test.different,
                deltaInSeconds
              );
            }.should.fail(
              "expected " +
                test.subject +
                " to be within 50s of " +
                test.different
            ));
          });

          describe("when negated", function () {
            it("passes", function () {
              this.subject.should.not.be.closeToTime(
                this.different,
                deltaInSeconds
              );
            });
          });
        });
      });

      describe("equalDate", function () {
        beforeEach(function () {
          this.subject = new Date(2013, 4, 30, 16, 5);
          this.same = new Date(2013, 4, 30, 17);
          this.different = new Date(2013, 4, 31);
        });

        describe("when given two date objects with the date values", function () {
          it("passes", function () {
            this.subject.should.be.equalDate(this.same);
          });

          describe("when negated", function () {
            it("fails", function () {
              var test = this;

              (function () {
                test.subject.should.not.be.equalDate(test.same);
              }.should.fail(
                "expected Thu May 30 2013 to not equal Thu May 30 2013"
              ));
            });
          });
        });

        describe("when given two date objects with different date values", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.subject.should.be.equalDate(test.different);
            }.should.fail("expected Thu May 30 2013 to equal Fri May 31 2013"));
          });

          describe("when negated", function () {
            it("passes", function () {
              this.subject.should.not.be.equalDate(this.different);
            });
          });
        });
      });
    });

    describe("beforeDate", function () {
      describe("when given two different date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 31);
        });

        it("passes", function () {
          this.d1.should.be.beforeDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be before Fri May 31 2013"
            ));
          });
        });
      });

      describe("when given two identical date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 30);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.beforeDate(test.d2);
          }.should.fail(
            "expected Thu May 30 2013 to be before Thu May 30 2013"
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.beforeDate(this.d2);
          });
        });
      });

      describe("when given two identical dates but different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 17);
          this.d2 = new Date(2013, 4, 30, 18);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.beforeDate(test.d2);
          }.should.fail(
            "expected Thu May 30 2013 to be before Thu May 30 2013"
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.beforeDate(this.d2);
          });
        });
      });
    });

    describe("beforeOrEqualDate", function () {
      describe("when given two different date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 31);
        });

        it("passes", function () {
          this.d1.should.be.beforeOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeOrEqualDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be before or equal to Fri May 31 2013"
            ));
          });
        });
      });

      describe("when given two identical date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 30);
        });

        it("passes", function () {
          this.d1.should.be.beforeOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeOrEqualDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be before or equal to Thu May 30 2013"
            ));
          });
        });
      });

      describe("when given two identical dates but different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 17);
          this.d2 = new Date(2013, 4, 30, 18);
        });

        it("passes", function () {
          this.d1.should.be.beforeOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeOrEqualDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be before or equal to Thu May 30 2013"
            ));
          });
        });
      });
    });

    describe("afterDate", function () {
      describe("when given two different date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 31);
          this.d2 = new Date(2013, 4, 30);
        });

        it("passes", function () {
          this.d1.should.be.afterDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterDate(test.d2);
            }.should.fail(
              "expected Fri May 31 2013 not to be after Thu May 30 2013"
            ));
          });
        });
      });

      describe("when given two identical date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 30);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.afterDate(test.d2);
          }.should.fail(
            "expected Thu May 30 2013 to be after Thu May 30 2013"
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.afterDate(this.d2);
          });
        });
      });

      describe("when given two identical date objects with different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 17);
          this.d2 = new Date(2013, 4, 30, 16);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.afterDate(test.d2);
          }.should.fail(
            "expected Thu May 30 2013 to be after Thu May 30 2013"
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.afterDate(this.d2);
          });
        });
      });
    });

    describe("afterOrEqualDate", function () {
      describe("when given two different date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 31);
          this.d2 = new Date(2013, 4, 30);
        });

        it("passes", function () {
          this.d1.should.be.afterOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterOrEqualDate(test.d2);
            }.should.fail(
              "expected Fri May 31 2013 not to be after or equal to Thu May 30 2013"
            ));
          });
        });
      });

      describe("when given two identical date objects", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 30);
        });

        it("passes", function () {
          this.d1.should.be.afterOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterOrEqualDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be after or equal to Thu May 30 2013"
            ));
          });
        });
      });

      describe("when given two identical date objects with different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 17);
          this.d2 = new Date(2013, 4, 30, 16);
        });

        it("passes", function () {
          this.d1.should.be.afterOrEqualDate(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterOrEqualDate(test.d2);
            }.should.fail(
              "expected Thu May 30 2013 not to be after or equal to Thu May 30 2013"
            ));
          });
        });
      });
    });

    describe("withinDate", function () {
      describe("when given a date between two dates", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 29);
          this.d3 = new Date(2013, 4, 31);
        });

        it("passes", function () {
          this.d1.should.be.withinDate(this.d2, this.d3);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.withinDate(test.d2, test.d3);
            }.should.fail(
              "expected Thu May 30 2013 not to be within Wed May 29 2013 and Fri May 31 2013"
            ));
          });
        });
      });

      describe("when given a date that is not between two dates", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 28);
          this.d2 = new Date(2013, 4, 29);
          this.d3 = new Date(2013, 4, 31);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.withinDate(test.d2, test.d3);
          }.should.fail(
            "expected Tue May 28 2013 to be within Wed May 29 2013 and Fri May 31 2013"
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.withinDate(this.d2, this.d3);
          });
        });
      });

      describe("when given three identical dates", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30);
          this.d2 = new Date(2013, 4, 30);
          this.d3 = new Date(2013, 4, 30);
        });

        it("passes", function () {
          this.d1.should.be.withinDate(this.d2, this.d3);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.withinDate(test.d2, test.d3);
            }.should.fail(
              "expected Thu May 30 2013 not to be within Thu May 30 2013 and Thu May 30 2013"
            ));
          });
        });
      });
    });

    describe("beforeTime", function () {
      describe("when comparing two different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 1);
        });

        it("passes", function () {
          this.d1.should.be.beforeTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be before " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });

      describe("when comparing identical times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.beforeTime(test.d2);
          }.should.fail(
            "expected " +
              chai.datetime.formatTime(this.d1) +
              " to be before " +
              chai.datetime.formatTime(this.d2)
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.beforeTime(this.d2);
          });
        });
      });
    });

    describe("beforeOrEqualTime", function () {
      describe("when comparing two different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 1);
        });

        it("passes", function () {
          this.d1.should.be.beforeOrEqualTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeOrEqualTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be before or equal to " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });

      describe("when comparing identical times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("passes", function () {
          this.d1.should.be.beforeOrEqualTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.beforeOrEqualTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be before or equal to " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });
    });

    describe("afterTime", function () {
      describe("when comparing two different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 1);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("passes", function () {
          this.d1.should.be.afterTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be after " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });

      describe("when comparing two identical times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.afterTime(test.d2);
          }.should.fail(
            "expected " +
              chai.datetime.formatTime(this.d1) +
              " to be after " +
              chai.datetime.formatTime(this.d2)
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.afterTime(this.d2);
          });
        });
      });
    });

    describe("afterOrEqualTime", function () {
      describe("when comparing two different times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 1);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("passes", function () {
          this.d1.should.be.afterOrEqualTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterOrEqualTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be after or equal to " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });

      describe("when comparing two identical times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
        });

        it("passes", function () {
          this.d1.should.be.afterOrEqualTime(this.d2);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.afterOrEqualTime(test.d2);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(this.d1) +
                " not to be after or equal to " +
                chai.datetime.formatTime(this.d2)
            ));
          });
        });
      });
    });

    describe("withinTime", function () {
      describe("when given a time between two times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 1);
          this.d2 = new Date(2013, 4, 30, 16, 5, 0);
          this.d3 = new Date(2013, 4, 30, 16, 5, 2);
        });

        it("passes", function () {
          this.d1.should.be.withinTime(this.d2, this.d3);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.withinTime(test.d2, test.d3);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(test.d1) +
                " not to be within " +
                chai.datetime.formatTime(test.d2) +
                " and " +
                chai.datetime.formatTime(test.d3)
            ));
          });
        });
      });

      describe("when given a time that is not between two times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 0);
          this.d2 = new Date(2013, 4, 30, 16, 5, 1);
          this.d3 = new Date(2013, 4, 30, 16, 5, 2);
        });

        it("fails", function () {
          var test = this;

          (function () {
            test.d1.should.be.withinTime(test.d2, test.d3);
          }.should.fail(
            "expected " +
              chai.datetime.formatTime(test.d1) +
              " to be within " +
              chai.datetime.formatTime(test.d2) +
              " and " +
              chai.datetime.formatTime(test.d3)
          ));
        });

        describe("when negated", function () {
          it("passes", function () {
            this.d1.should.not.be.withinTime(this.d2, this.d3);
          });
        });
      });

      describe("when given three identical times", function () {
        beforeEach(function () {
          this.d1 = new Date(2013, 4, 30, 16, 5, 1);
          this.d2 = new Date(2013, 4, 30, 16, 5, 1);
          this.d3 = new Date(2013, 4, 30, 16, 5, 1);
        });

        it("passes", function () {
          this.d1.should.be.withinTime(this.d2, this.d3);
        });

        describe("when negated", function () {
          it("fails", function () {
            var test = this;

            (function () {
              test.d1.should.not.be.withinTime(test.d2, test.d3);
            }.should.fail(
              "expected " +
                chai.datetime.formatTime(test.d1) +
                " not to be within " +
                chai.datetime.formatTime(test.d2) +
                " and " +
                chai.datetime.formatTime(test.d3)
            ));
          });
        });
      });
    });

    describe("formatTime", function () {
      describe("printing the date at the start", function () {
        it("prints the date at the beginning of the string", function () {
          var date = new Date(2014, 11, 20, 15, 20, 17, 345);
          chai.datetime.formatTime(date).should.match(/^Sat Dec 20 2014.*/);
        });
      });

      describe("printing the time", function () {
        it("prints milliseconds with one digit", function () {
          var date = new Date(2014, 11, 20, 15, 20, 17, 002);
          chai.datetime.formatTime(date).should.match(/.*15:20:17\.002.*/);
        });

        it("prints milliseconds with two digits", function () {
          var date = new Date(2014, 11, 20, 15, 20, 17, 097);
          chai.datetime.formatTime(date).should.match(/.*15:20:17\.097.*/);
        });

        it("prints milliseconds with three digits", function () {
          var date = new Date(2014, 11, 20, 15, 20, 17, 345);
          chai.datetime.formatTime(date).should.match(/.*15:20:17\.345.*/);
        });

        it("prints seconds with one digit", function () {
          var date = new Date(2014, 11, 20, 15, 20, 7, 345);
          chai.datetime.formatTime(date).should.match(/.*15:20:07.*/);
        });

        it("prints seconds with two digits", function () {
          var date = new Date(2014, 11, 20, 15, 20, 49, 345);
          chai.datetime.formatTime(date).should.match(/.*15:20:49.*/);
        });

        it("prints minutes with one digit", function () {
          var date = new Date(2014, 11, 20, 15, 6, 49, 345);
          chai.datetime.formatTime(date).should.match(/.*15:06:49.*/);
        });

        it("prints minutes with two digits", function () {
          var date = new Date(2014, 11, 20, 15, 31, 49, 345);
          chai.datetime.formatTime(date).should.match(/.*15:31:49.*/);
        });

        it("prints hours with one digit", function () {
          var date = new Date(2014, 11, 20, 3, 20, 49, 345);
          chai.datetime.formatTime(date).should.match(/.*03:20:49.*/);
        });

        it("prints hours with two digits", function () {
          var date = new Date(2014, 11, 20, 17, 20, 49, 345);
          chai.datetime.formatTime(date).should.match(/.*17:20:49.*/);
        });
      });

      describe("printing the timezone", function () {
        it("prints the local timezone", function () {
          var date = new Date("2014-12-20T15:20:17.345Z");
          chai.datetime.formatTime(date).should.match(/.* \([+-]\d\d:\d\d\)$/);
        });
      });
    });

    describe("getFormattedTimezone", function () {
      // Note, timezone is given in minutes, negative means it is ahead of UTC.
      it("should use a + to indicate the timezone is ahead of UTC", function () {
        chai.datetime.getFormattedTimezone(-525).should.equal("+08:45");
      });

      it("should use a - to indicate the timezone is behind of UTC", function () {
        chai.datetime.getFormattedTimezone(300).should.equal("-05:00");
      });

      it("should use a + when we are in the UTC timezone", function () {
        chai.datetime.getFormattedTimezone(0).should.equal("+00:00");
      });
    });

    describe("tdd alias", function () {
      beforeEach(function () {
        this.subject = new Date(2013, 4, 30, 16, 5);
      });

      it(".equalDate", function () {
        assert.equalDate(this.subject, new Date(2013, 4, 30, 17));
      });

      it(".notEqualDate", function () {
        assert.notEqualDate(this.subject, new Date(2013, 4, 31, 17));
      });

      it(".beforeDate", function () {
        assert.beforeDate(this.subject, new Date(2013, 4, 31));
      });

      it(".notBeforeDate", function () {
        assert.notBeforeDate(this.subject, new Date(2013, 4, 30));
      });

      it(".beforeOrEqualDate", function () {
        assert.beforeOrEqualDate(this.subject, new Date(2013, 4, 31));
      });

      it(".notBeforeOrEqualDate", function () {
        assert.notBeforeOrEqualDate(this.subject, new Date(2013, 4, 29));
      });

      it(".afterDate", function () {
        assert.afterDate(this.subject, new Date(2013, 4, 29));
      });

      it(".notAfterDate", function () {
        assert.notAfterDate(this.subject, new Date(2013, 4, 30));
      });

      it(".afterOrEqualDate", function () {
        assert.afterOrEqualDate(this.subject, new Date(2013, 4, 29));
      });

      it(".notAfterOrEqualDate", function () {
        assert.notAfterOrEqualDate(this.subject, new Date(2013, 4, 31));
      });

      it(".withinDate", function () {
        assert.withinDate(
          this.subject,
          new Date(2013, 4, 29),
          new Date(2013, 4, 31)
        );
      });

      it(".notWithinDate", function () {
        assert.notWithinDate(
          this.subject,
          new Date(2013, 4, 31),
          new Date(2013, 5, 0)
        );
      });

      it(".equalTime", function () {
        assert.equalTime(this.subject, new Date(2013, 4, 30, 16, 5));
      });

      it(".notEqualTime", function () {
        assert.notEqualTime(this.subject, new Date(2013, 4, 30, 16, 6));
      });

      it(".beforeTime", function () {
        assert.beforeTime(this.subject, new Date(2013, 4, 30, 16, 6));
      });

      it(".notBeforeTime", function () {
        assert.notBeforeTime(this.subject, new Date(2013, 4, 30, 16, 5));
      });

      it(".beforeOrEqualTime", function () {
        assert.beforeOrEqualTime(this.subject, new Date(2013, 4, 30, 16, 5));
      });

      it(".notBeforeOrEqualTime", function () {
        assert.notBeforeOrEqualTime(this.subject, new Date(2013, 4, 30, 16, 4));
      });

      it(".afterTime", function () {
        assert.afterTime(this.subject, new Date(2013, 4, 30, 16, 4));
      });

      it(".notAfterTime", function () {
        assert.notAfterTime(this.subject, new Date(2013, 4, 30, 16, 6));
      });

      it(".afterOrEqualTime", function () {
        assert.afterOrEqualTime(this.subject, new Date(2013, 4, 30, 16, 5));
      });

      it(".notAfterOrEqualTime", function () {
        assert.notAfterOrEqualTime(this.subject, new Date(2013, 4, 30, 16, 6));
      });

      it(".closeToTime", function () {
        assert.closeToTime(this.subject, new Date(2013, 4, 30, 16, 6), 90);
      });

      it(".withinTime", function () {
        assert.withinTime(
          this.subject,
          new Date(2013, 4, 30, 16, 4),
          new Date(2013, 4, 30, 16, 6)
        );
      });

      it(".notWithinTime", function () {
        assert.notWithinTime(
          this.subject,
          new Date(2013, 4, 30, 16, 6),
          new Date(2013, 4, 30, 16, 7)
        );
      });
    });
  });
});
