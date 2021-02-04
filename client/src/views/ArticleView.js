import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Button } from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import { api } from '../api';

class ArticleView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            article: {
                title: '',
                content: ''
            },
            author: {
                nick: ''
            },
            comment: '',
            comments: []
        }
    }
    
    componentDidMount() {
        this.fetchArticle();
    }
    

    render() {
        const { article, author, comment, comments } = this.state;
        const { user } = this.props;

        return (
            <>
                <ArticleContent>
                    <ArticleHeader>
                        {article.title}
                    </ArticleHeader>   
                    <i>{moment(article.createdAt).format('L, HH:mm')}  </i>           
                    <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
                    <ArticleFooter>
                        Autor: &nbsp;
                        <Link to={`/blog/${author.nick}`}>
                            {author.nick}
                        </Link>
                    </ArticleFooter>
                </ArticleContent>
                {user && user.nick &&
                    <NewCommentSection>
                        <Row gutter={[0, 16]}>
                            <Col span={24}>
                                <h3>Dodaj komentarz jako {user.nick}</h3>
                            </Col>
                            <Col span={24}>
                                <Input.TextArea 
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => this.setState({ comment: e.target.value })}
                                />
                            </Col>
                            <Col span={24}>
                                <Button onClick={this.sendComment} type='primary'>
                                    Wyślij
                                </Button>
                            </Col>
                        </Row>
                    </NewCommentSection>
                }
                {comments.length > 0 && 
                    <CommentsSection>
                        <h3>Komentarze</h3>
                        {comments.map(obj => (
                            <Comment>
                                <Row justify='space-between'>
                                    <Col>
                                        <Link to={`/blog/${obj.author.nick}`}>
                                            {obj.author.nick}
                                        </Link>
                                    </Col>
                                    <Col>
                                        {moment(obj.comment.createdAt).format('L, HH:mm')}
                                    </Col>
                                </Row>
                                {obj.comment.content}
                            </Comment>
                        ))}
                    </CommentsSection>
                }

            </>
        );
    }

    fetchArticle = () => {
        const { articleId } = this.props.match.params;

        api
            .get(`/articles/${articleId}`)
            .then(res => res.data)
            .then(obj => this.setState({ article: obj.article, author: obj.user}))
            .then(() => this.fetchComments());
        }
        
    fetchComments = () => {
        const { articleId } = this.props.match.params;

        api
            .get(`/comments`, { params: { articleId } })
            .then(res => res.data)
            .then(comments => this.setState({ comments: comments }));
    }

    sendComment = () => {
        const { comment } = this.state;
        const { articleId } = this.props.match.params;

        api
            .post('/comments', { comment, articleId })
            .then(() => this.setState({ comment: '' }))
            .then(() => this.fetchComments());
    }
}


const ArticleHeader = styled.div`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
`;

const ArticleContent = styled.div`
    width: 50%;
    background-color: white;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
`;

const CommentsSection = styled.div`
    width: 50%;
    background-color: white;
    margin: auto;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
`;

const Comment = styled.div`
    margin-bottom: 20px;
`;

const NewCommentSection = styled.div`
    width: 50%;
    background-color: white;
    margin: auto;
    padding: 20px;
    margin-top: 20px;
    border-radius: 10px;
`;

const ArticleFooter = styled.div`
    margin-top: 20px;
    text-align: right;
`;

export default ArticleView;