import {Component} from 'react';
import LocalData from '../core/LocalData';
import Header from '../ui/Header';
import {Container, Grid} from 'semantic-ui-react';
import Chat from '../ui/Chat';
import ContactList from '../ui/ContactList';

class Index extends Component {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0, contactList: [], messages: [], selectedContact: "" };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
      
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
      
    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }
    
    render() {
        var listHeight = this.state.height - 200;

        return (
            <div>
                <Header></Header>
                <style jsx global>{`
                    body { 
                        background: #303030;
                        background-image: url('static/images/rectangle.svg');
                    }
                `}</style>
                <div style={{width: '784px', height: '784px',
                    backgroundImage: `url('static/images/pa-logo-color.svg')`, 
                    display: 'float', position: 'absolute', top: -50, left: 450}}></div>

                <Container style={{paddingTop: '150px'}}>
                    <Grid column={2}>
                        <Grid.Row stretched>
                            <Grid.Column width={6} style={{height: listHeight + "px", float: 'left'}}>
                                <ContactList height={listHeight}/>
                            </Grid.Column>
                            <Grid.Column width={10} style={{height: listHeight + "px", overflow: 'auto', float: 'left'}}>
                                <Chat height={listHeight}/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </div>
        )
    }
}

export default Index;