import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Button, Divider } from 'antd';
import styled from 'styled-components';
import { api } from '../api';

class AllBlogsView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            users: [],
        }
    }
    
    
    componentDidMount() {
        this.fetchBlogs();
    }    

    render() {
        const { users } = this.state;

        return (
            <Row justify='center'>
                <Col span={12}>
                    <BlogsList>
                        <Header>Wszystkie blogi</Header>
                        {users.map(user => (
                            <>
                                <Row>
                                    <Link to={`/blog/${user.nick}`}>
                                        {user.nick}
                                    </Link>
                                </Row>
                                <Row>
                                    Liczba artykułów: {user.articlesCount}
                                </Row>
                                <Row>
                                    Liczba komentarzy pod artykułami: {user.commentsCount}
                                </Row>
                                <Divider />
                            </>
                        ))}
                    </BlogsList>
                </Col>
            </Row>
        );
    }

    fetchBlogs = () => {
        api
            .get('/users')
            .then(res => res.data)
            .then(users => this.setState({ users: users }));
    }
}

const BlogsList = styled.div`
    background-color: #FFFFFF;
    padding: 20px;
    min-height: 500px;
    border-radius: 15px;
`;

const Header = styled.div`
    font-size: 18px;
    margin-bottom: 20px;
`;

export default AllBlogsView;