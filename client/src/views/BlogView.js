import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Divider, Button } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { api } from '../api';

class BlogView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            articles: []
        };
    }
    
    componentDidMount() {
        this.fetchArticles();
    }
    
    render() {
        const { articles } = this.state;
        const { username } = this.props.match.params;

        return (
            <ArticlesList>
                {articles.length === 0 && 
                    <>Brak wpisów</>
                }
                {articles.map(article => (
                    <SingleArticle>
                        <Row>
                            <Col>
                                <strong>Tytuł: </strong>
                                {article.title}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <strong>Data utworzenia: </strong>
                                {moment(article.createdAt).format('L, HH:mm')}
                            </Col>
                        </Row>
                        {this.props.user && username === this.props.user.nick && 
                            <Row>
                                <Col>
                                    <strong>Opublikowany: </strong>
                                    {article.isPublished ? 'TAK' : 'NIE'}
                                </Col>
                            </Row>
                        }
                        <Row>
                            <Col>
                                <strong>Początek treści: </strong>
                                {this.extractContentFromHtml(article.content).substring(0, 100)}...
                            </Col>
                        </Row>
                        <Row>
                            <Link to={`/blog/${username}/${article.id}`}>Czytaj więcej</Link>
                        </Row>
                        {this.props.user && username === this.props.user.nick &&
                            <Row>
                                <Button 
                                    type='link' 
                                    style={{ padding: 0 }}
                                    onClick={() => this.redirectToArticleEdit(article.id)}
                                >
                                    Edytuj
                                </Button>
                                &nbsp;&nbsp;
                                <Button 
                                    type='link' 
                                    style={{ padding: 0 }}
                                    onClick={() => this.deleteArticle(article.id)}
                                >
                                    Usuń
                                </Button>
                            </Row>
                        }
                        <Divider />
                    </SingleArticle>
                ))}
            </ArticlesList>
        );
    }

    extractContentFromHtml = (html) => {
        var span = document.createElement('span');
        span.innerHTML = html;
        var children = span.querySelectorAll('*');
        for (var i = 0; i < children.length; i++) {
            if (children[i].textContent)
                children[i].textContent += ' ';
            else
                children[i].innerText += ' ';
        }

        return [span.textContent || span.innerText].toString().replace(/ +/g, ' ');
    };

    fetchArticles = () => {
        const { username } = this.props.match.params;

        api
            .get('/articles', { params: { username } })
            .then(res => res.data)
            .then(articles => this.setState({ articles }));
    }

    redirectToArticleEdit = (articleId) => {
        this.props.history.push(`/edit-article/${articleId}`);
    }

    deleteArticle = (articleId) => {
        api
            .delete(`/articles/${articleId}`)
            .then(() => this.fetchArticles());
    }
}

const ArticlesList = styled.div`
    background-color: #FFFFFF;
    width: 50%;
    margin: auto;
    padding: 20px;
    border-radius: 15px;
`;

const SingleArticle = styled.div`
    margin-bottom: 20px;
`;

export default BlogView;