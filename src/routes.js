import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Register from './components/Register';
import Orders from './components/Orders';
import Refund from './components/Refund';
import Cards from './components/Cards';
import PreAuth from './components/PreAuth';
import Pending from './components/Pending';
import Misc from './components/Misc';
import Layout from './components/Layout';
import IndexPage from './components/IndexPage';
import NotFoundPage from './components/NotFoundPage';

const routes = (
    <Route path="/" component={Layout}>
        <IndexRoute component={IndexPage}/>
        <Route path="register" component={Register}/>
        <Route path="orders" component={Orders}/>
        <Route path="refund" component={Refund}/>
        <Route path="cards" component={Cards}/>
        <Route path="preauth" component={PreAuth}/>
        <Route path="pending" component={Pending}/>
        <Route path="misc" component={Misc}/>
        <Route path="*" component={NotFoundPage}/>
    </Route>
);

export default routes;