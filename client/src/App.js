import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Layout } from 'antd';
import jwt_decode from "jwt-decode";
import styled from 'styled-components';

import LoginView from './views/LoginView';
import RegisterView from './views/RegisterView';
import AllBlogsView from './views/AllBlogsView';
import AddArticleView from './views/AddArticleView';
import EditArticleView from './views/EditArticleView';
import BlogView from './views/BlogView';
import ArticleView from './views/ArticleView';

import CustomHeader from './components/CustomHeader';
import { api } from './api';

const { Header, Sider, Content } = Layout;
class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            user: null
        }
    }
    
    componentDidMount() {
        const token = localStorage.getItem('token');

        this.setState({
            user: token ? jwt_decode(token) : null
        })
    }
    
    render() {
        const { user } = this.state;
        
        return (
            <>
                <StyledHeader>
                    <CustomHeader {...this.props} user={user} onLogout={this.handleLogout} />
                </StyledHeader>
                <StyledContent>
                    <Switch>
                        <Route path="/login" render={() => <LoginView onLogin={this.handleLogin} />} />
                        <Route path="/register" component={RegisterView} />
                        <Route path="/blogs" component={AllBlogsView} />
                        <Route path="/add-article" render={() => <AddArticleView {...this.props} user={user} />} />
                        <Route path="/edit-article/:id" render={(props) => <EditArticleView {...props} user={user} />} />
                        <Route path="/blog/:username/:articleId" render={(props) => <ArticleView {...props} user={user} />} />
                        <Route path="/blog/:username" render={(props) => <BlogView {...props} user={user} />} />
                    </Switch>
                </StyledContent>
            </>
        )
    }

    handleLogin = (values) => {
        api
            .post('/login', { ...values })
            .then(res => res.data)
            .then(token => this.handleTokenReceive(token))
            .then(() => this.props.history.push(`/blog/${values.nick}`))
            .catch(err => console.log(err));
    }

    handleLogout = () => {
        this.setState({
            user: null
        });
        localStorage.clear();
        this.props.history.push('/blogs');
    }

    handleTokenReceive = (token) => {
        this.setState({
            user: jwt_decode(token)
        });

        localStorage.setItem('token', token);
    }
}

const StyledHeader = styled(Header)`
    background-color: white;
`

const StyledContent = styled(Content)`
    padding: 20px;
`

export default withRouter(App);
