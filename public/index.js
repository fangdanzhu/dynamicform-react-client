import './css/app.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Route, HashRouter, Link} from 'react-router-dom';
import {Provider} from 'react-redux';
import {ConnectedRouter} from 'react-router-redux';

import store from './store/store';
import history from './store/history';

//Pages
import CreateDynamicFormPage from './pages/CreateDynamicFormPage';
import UpdateDynamicFormPage from './pages/UpdateDynamicFormPage';
import EdmundPage from './pages/EdmundPage';
import DemoPage from './pages/DemoPage';
import YekangPage from './pages/YekangPage';
import EricPage from './pages/EricPage';
import StepsPage from './pages/StepsPage';
import NickPage from './pages/NickPage';

const root = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div id="wrapper" className="toggled">
                <div id="sidebar-wrapper">
                    <HashRouter>
                        <ul className="sidebar-nav">
                            <li className="sidebar-brand">
                                <a href="#">
                                    Form Render
                                </a>
                            </li>
                            <li><Link to="/">Demo Form</Link></li>
                            <li><Link to="/nick">Nick Page</Link></li>
                            <li><Link to="/EdmundPage">EdmundPage</Link></li>
                            {/*<li><Link to="/demoform">Demo</Link></li>*/}
                            {/*<li><Link to="/YekangPage">YekangPage</Link></li>*/}
                            {/*<li><Link to="/EricPage">EricPage</Link></li>*/}
                            {/*<li><Link to="/StepsPage">StepsPage</Link></li>*/}
                        </ul>
                    </HashRouter>
                </div>
                <HashRouter>
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-lg-12">
                                    <Route exact path="/" component={DemoPage}/>
                                    <Route path="/nick" component={NickPage}/>
                                    <Route path="/EdmundPage" component={EdmundPage}/>
                                    <Route path="/demoform" component={DemoPage}/>
                                    <Route path="/demo/create/:name" component={CreateDynamicFormPage}/>
                                    <Route path="/demo/edit/:name/:id" component={UpdateDynamicFormPage}/>
                                    <Route path="/YekangPage" component={YekangPage}/>
                                    <Route path="/EricPage" component={EricPage}/>
                                    <Route path="/StepsPage" component={StepsPage}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </HashRouter>
            </div>
        </ConnectedRouter>
    </Provider>
    , root);
