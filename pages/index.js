import {Component} from 'react';
import LocalData from '../core/LocalData';

class Index extends Component {
    componentDidMount() {
        LocalData.tryMaxLocalStorage();
    }

    render() {
        return (
            <div>Hello</div>
        )
    }
}

export default Index;