import React from 'react';
import ReactDOM from 'react-dom';
import routes from "./routes"
import {App} from './containers';
import registerServiceWorker from './_helpers/registerServiceWorker';
import { Provider } from 'react-redux';
import { store } from './_helpers/store';
import "semantic-ui-css/components/modal.css";
import "semantic-ui-css/components/button.css";
import "semantic-ui-css/components/dimmer.css";
import "semantic-ui-css/components/transition.css";



ReactDOM.render(

	<Provider store={store}>
			<App routes={routes} />
	</Provider>

, document.getElementById('root') );



registerServiceWorker();
