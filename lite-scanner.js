/* <script defer type="text/javascript" src="./lib/instascan.min.js"></script> */
/* <link defer rel="import" href="./qr-scanner-lib.html"> */
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import QrScanner from './lib/qr-scanner.min.js'

import './qr-scanner-mixin.js';
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
        notify: true,
        value: ''
      },
      opts: {
        type: Object,
        notify: true,
        computed: '_createConfig()'
      },
      type: {
        type: String,
        notify: true,
        value: 'string'
      },
      oneRead: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true,
        value: true
      },
      state: {
        type: Boolean,
        notify: true,
        reflectToAttribute: true
      }
    }
  }

  /**
   * Use for one-time configuration of your component after local DOM is
   * initialized.
   */
  ready() {
    super.ready();
    // afterNextRender(this, () => {
    //   this.QrScanner = window.QrScanner;
    // });
  }

  /**
    * Array of strings describing multi-property observer methods and their
    * dependant properties
    */
  static get observers() {
    return [
      // '_scannerChanged(scanner)',
      "_stateChanged(scanner._active)"
    ];
  }

  _stateChanged(scannerState) {
    if(scannerState === undefined) return;
    this.state = !!scannerState;
  }

  _scannerChanged(scanner) {
    if (!scanner) return;
    
    this.scanner.addListener('scan', (content) => {
      this.content = content;
      if (this.oneRead) this.stop();
    });

    this.scanner.addListener('active', (content) => {
      this.state = true;
    });

    this.scanner.addListener('inactive', (content) => {
      this.state = false;
    });
  }

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
        video: { facingMode: "user" }
      }
  }

  _formatContent(content) {
    
    if(!content) {
     switch (this.type) {
       case 'json':
        return {};
        break;
       case 'string':
        return '';
        break;
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

  toggleReadMode() {
    this.set('oneRead', !this.oneRead);
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
    });
    this.set('scanner', scanner);
  }

  // _getCameras() {
  //   const cam = navigator.mediaDevices.getUserMedia(this.opts);
  //   cam.then((cameras) => {
  //     if (cameras.length > 0) {
  //       let selectedCam = cameras[cameras.length-1];
  //       return selectedCam
  //     } else {
  //       console.error('No cameras found.');
  //     }
  //   }, this).catch(function (e) {
  //     console.error(e);
  //   });
  // }


  start() {
    if (!this.scanner) {
      console.log('Config and init first.');
      this.init();
    }

    this.scanner.start();
    this.state = true;

    // const selectedCam = this._getCameras();
    

    // Instascan.Camera.getCameras().then((cameras) => {
    //   if (cameras.length > 0) {
    //     var selectedCam = cameras[cameras.length-1];
    //     this.scanner.start(selectedCam);
    //   } else {
    //     console.error('No cameras found.');
    //   }
    // }, this).catch(function (e) {
    //   console.error(e);
    // });
    // const videoElem = this.shadowRoot.querySelector('video');
    // this.qrScanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
  }

  stop() {
    if (this.scanner) this.scanner.stop();
    this.state = false;
  }
}
window.customElements.define(LiteScanner.is, LiteScanner);
