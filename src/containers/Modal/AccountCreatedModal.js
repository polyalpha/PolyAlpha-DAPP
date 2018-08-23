import React, {Fragment} from 'react';
import {Modal} from './Modal';
import jsPDF from 'jspdf';
import LocalData from '../../_services/LocalData';

export class AccountCreatedModal extends Modal {

  static defaultProps = {
    hideClose: true,
    title: "New account successfully created",
    message: (
      <Fragment>
        <p>We have just created a new Ethereum account for you to use on the PolyAlpha Messenger POC.</p>
        <p><span className="red">Please SAVE these details or download the PDF file containing your private keys.</span> Without these details you will not be able to login to the PolyAlpha Messenger POC.</p>
        <p>* Do not lose it because it cannot be recovered if you lose it - you truly own your own data and your own log in credentials. *</p>
      </Fragment>
    )
  };

  constructor(props) {
    super(props);
    this.openButtonRef = React.createRef()
  }

  onClickDownload = () => {
    var doc = new jsPDF();
    doc.setFontSize(13);
    doc.text('Address: ' + LocalData.getAddress(), 25, 25);
    doc.text('Private key:', 25, 32);
    doc.text(LocalData.getPrivateKey(), 25, 39);

    doc.save('PolyAlpha_' + LocalData.getAddress() + '.pdf');
    
    this.openButtonRef.current.setState({disabled:false})
  };

  onClickOpen = () => {
    this.close();
  };

  getActions = () => {
    return [
      {
        title: "Download account details",
        onClick: this.onClickDownload
      },
      {
        title: "Open PolyAlpha Messenger",
        onClick: this.onClickOpen,
        disabled: true,
        ref: this.openButtonRef,
      },
    ]
  };

  componentDidMount() {
    console.log("componentDidMount", this)
  }

}




