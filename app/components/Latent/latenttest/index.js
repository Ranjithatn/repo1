import React, {Component, PropTypes} from 'react';
const {dialog} = require('electron').remote

// download html2canvas and jsPDF and save the files in app/ext, or somewhere else
// the built versions are directly consumable
// import {html2canvas, jsPDF} from 'app/ext';
const html2canvas = require('html2canvas');
const jsPDF = require('jspdf')

export default class LatentTest extends Component {
  constructor(props) {
    super(props);
  }

  printDocument() {
    const input = document.getElementById('divToPrint');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        // var blob = pdf.output("blob");
        // window.open(URL.createObjectURL(blob),'modal');
        // window.open('', 'modal')
        // pdf.autoPrint();
        // window.open(pdf.output('dataurlnewwindow'));
        // pdf.output('datauri'); ;
        // pdf.save("download.pdf");
        dialog.showMessageBox()
//           popup.window // => Window object of new window
//           popup.browserWindow // => Remote BrowserWindow of new window
//           popup.window.document.body.innerHTML = "<h1>Hello</h1>" // You can access its DOM directly
// window.open("https://www.github.com", "github", "resizable,scrollbars,status");
      })
    ;
  }

  render() {
    return (<div>
      <div className="mb5">
        <button onClick={this.printDocument}>Print</button>
      </div>
      <div id="divToPrint" className="mt4" >
        <div>Note: Here the dimensions of div are same as A4</div> 
        <div>You Can add any component here</div>
      </div>
    </div>);
  }
}