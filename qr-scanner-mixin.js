import { dedupingMixin } from '@polymer/polymer/lib/utils/mixin.js';
import QrScanner from "./lib/qr-scanner.min.js";
window.QrScanner = QrScanner;
window.Mixins = window.Mixins || {};

/**
 * 
 * @polymerMixin
 * @mixinFunction
 */
Mixins.QrScannerMixin = dedupingMixin((base) => {
  /**
   * @polymerMixinClass
   * @implements { }
   */
  class QrScannerMixin extends base {
    /**
      * Instance of the element is created/upgraded. Useful for initializing
      * state, set up event listeners, create shadow dom.
      * @constructor
      */
    constructor() {
      super();
    
      this.QrScanner = window.QrScanner;
    
    }
  }
  return QrScannerMixin;
});
