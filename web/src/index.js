import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import PageLayout from './common/Navigation'
import Dashboard from "./dashboard_components/Dashboard";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Result } from 'antd';

const Index = () => {
    return <Router>
        <PageLayout pathname='/'>
            <Switch>
                <Route path='/' exact>
                    <Dashboard />
                </Route>
                <Route path='/ingest' exact>
                    Test
                </Route>
                <Route path='/admin' exact>
                    <Result
                        status="500"
                        title="500"
                        subTitle="Not Implemented"
                    />
                </Route>
                <Route>
                    <Result
                        status="404"
                        title="404"
                        subTitle="Page not found"
                    />,
                </Route>
            </Switch>
        </PageLayout>
    </Router>;
};

ReactDOM.render(
    <React.StrictMode>
        <Index />
    </React.StrictMode>,
    document.getElementById('root')
);
