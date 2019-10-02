/* <script defer type="text/javascript" src="./lib/instascan.min.js"></script> */
/* <link defer rel="import" href="./qr-scanner-lib.html"> */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import QrScanner from './libraries/qr-scanner.min.js';
import './libraries/qr-scanner/qr-scanner.min.js.map';
import './libraries/qr-scanner/qr-scanner/qr-scanner-worker.min.js';
import './libraries/qr-scanner/qr-scanner/qr-scanner-worker.min.js.map';

import { html } from '@polymer/polymer/lib/utils/html-tag.js';
// import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
/**
 * `lite-scanner`
 * lightweight qr-code scanner web component 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */

class LiteScanner extends PolymerElement {
  static get template() {
    return html`
    <style>
      :host {
        display: block;
        padding: 0;
      }

      video {
        /* transform: scale(0.5); */
        width: 100%;
        border-radius: 10px; 
      }
    </style>

    <video id="preview" autoplay=""></video>
`;
  }

  static get is() { return 'lite-scanner'; }
  static get properties() {
    return {
      data: {
        type: Object,
        notify: true, 
        reflectToAttribute: true,
        computed: '_formatContent(content)'
      },
      content: {
        type: String,
        value: ''
      },
      opts: {
        type: Object,
        computed: '_createConfig()'
      },
      type: {
        type: String,
        value: 'string'
      },
      oneRead: {
        type: Boolean,
        reflectToAttribute: true,
        value: true
      },
      state: {
        type: Boolean,
        reflectToAttribute: true,
        observer: '_stateChanged'
      },
      isActive: {
        type: Boolean,
        readOnly: true,
        notify: true,
        value: false
      }
    };
  }

  _stateChanged(scannerState) {
    if(scannerState === undefined) {
      return false;
    }

    if(scannerState && !this.scanner) {
      this.init();
    }
    if (scannerState === this.scanner._active) return false;
    if(scannerState) {
      this.start(); 
      return true;
    }
    if(!scannerState && this.scanner && this.scanner._active) {
      this.stop();
    }
  }

  // _activeChanged(active) {
  //   console.log(active)
  //   this.set('active', active);
  // }

  _readResult(result) {
    if(!result) return false;
    this.content = result;
    if (this.oneRead) this.stop();
    return true;
  }

  _createConfig() {
    return { 
        // backgroundScan: false, 
        // video:true,
        // scanPeriod: 10,
        // mirror: false
        video: { facingMode: "environment" }
      };
  }

  _formatContent(content) {
    
    if(!content) {
     switch (this.type) {
       case 'json':
        return {};
       case 'string':
        return '';
       default:
         break;
     }
    }
    console.log(content);

    let readData = null;
    switch (this.type) {
      case 'json':
        readData = JSON.parse(content);
        break;
      case 'string': 
        readData = content;
        break;
      default:
        break;
    }

    if (readData) {
      setTimeout(() => {this.set('content', '');}, 500);
      return readData;
    } else {
      return {};
    }
  }

  config(opts) {
    this.opts = Object.assign(this.opts, opts);
    this.set('opts', opts);
  }

  init() {
    this.opts.videoEl = this.shadowRoot.getElementById('preview');
    let scanner = new QrScanner(this.opts.videoEl, (result) => {
      if(!result) return false;
      this.content = result;
      if (this.oneRead) this.stop();
      return true;
    }, 720);
    this.set('scanner', scanner);
  }

  start() {
    if (!this.scanner) {
      console.log('Config and init first.');
      this.init();
    }
    this.scanner.start();
    this._setIsActive(true);
  }

  stop() {
    if (this.scanner) this.scanner.stop();
    this._setIsActive(false);

  }
}
window.customElements.define(LiteScanner.is, LiteScanner);
