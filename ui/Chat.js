import {Component} from 'react';
import {
    Segment,
    Input,
    Button,
    Message,
    Icon,
    Header,
    Label
} from 'semantic-ui-react';

class Chat extends Component {
    render() {
        const {height} = this.props;
        return (
            <div style={{width: '100%'}}>
                <Segment style={{height: (height) + "px", width: '100%', overflow: 'auto'}}>
                    {/* {messageItems} */}
                </Segment>
                {/* <Segment>
                    <Input />
                </Segment> */}
            </div>
        );
    }
}

export default Chat;