/**
 * @author Andrey K. Vital <andreykvital@gmail.com>
 */
var PHPUnitAssertionsProvider = require('./PHPUnitAssertionsProvider');

/**
 * @type {Object}
 */
module.exports = {
  /**
   * @type {PHPUnitAssertionsProvider}
   */
  provider: null,

  /**
   * @return {void}
   */
  activate: function() {
  },

  /**
   * @return {void}
   */
  deactivate: function() {
    this.provider = null;
  },

  /**
   * @return {PHPUnitAssertionsProvider}
   */
  provide: function() {
    return {
      provider: this.provider || new PHPUnitAssertionsProvider()
    };
  }
};
