import {Component} from 'react';
import {
    Segment,
    Input,
    Button,
    Message,
    Menu,
    Tab,
} from 'semantic-ui-react';

class ContactList extends Component {
    render() {
        const {height} = this.props;

        const bidPanes = [
            { menuItem: <Menu.Item style={{width: '50%', height: '30px', paddingTop: '8px', textAlign: 'center', display: 'inline'}} color='grey'>Your bids</Menu.Item>, render: () => <Tab.Pane inverted style={{height: height-110, border: '0px'}} attached='top'>Your bids</Tab.Pane> },
            { menuItem: <Menu.Item style={{width: '50%', height: '30px', paddingTop: '8px', textAlign: 'center', display: 'inline'}} color='grey'>Bids for you</Menu.Item>, render: () => <Tab.Pane inverted style={{height: height-110, border: '0px'}} attached='top'>Bids for you</Tab.Pane>}
        ]
        const BidTabs = () => <Tab menu={{inverted: true}} panes={bidPanes} />

        const panes = [
            { menuItem: <Menu.Item style={{width: '30%', textAlign: 'center', display: 'inline'}} color='violet'>Hello</Menu.Item>, render: () => <BidTabs /> },
            { menuItem: <Menu.Item style={{width: '30%', textAlign: 'center', display: 'inline'}} color='violet'>Discover</Menu.Item>, render: () => <Tab.Pane inverted style={{height: height-45, border: '0px'}} attached='top'>Discover</Tab.Pane> },
            { menuItem: <Menu.Item style={{width: '30%', textAlign: 'center', display: 'inline'}} color='violet'>Chat</Menu.Item>, render: () => <Tab.Pane inverted style={{height: height-45, border: '0px'}} attached='top'>Chat</Tab.Pane> },
        ]
        
        const ContactTabs = () => <Tab menu={{ attached: 'bottom', secondary: true, inverted: true }} panes={panes} />          
        return (
            <div style={{width: '100%'}}>
                <Segment style={{height: (height) + "px", width: '100%', overflow: 'auto', padding: '20px 2px 0px 2px'}} inverted>
                    <ContactTabs />
                </Segment>
            </div>
        );
    }
}

export default ContactList;