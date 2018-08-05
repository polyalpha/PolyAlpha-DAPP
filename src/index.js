import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import routes from "./routes"
import {App} from './containers';
import registerServiceWorker from './_helpers/registerServiceWorker';
import { Provider } from 'react-redux';
import { store } from './_helpers/store';




ReactDOM.render(
	<Provider store={store}>
			<App routes={routes} />
	</Provider>
,document.getElementById('root'));



registerServiceWorker();
