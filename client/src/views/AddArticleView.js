import React, { Component } from 'react';
import { Row, Col, Input, Checkbox, Button } from 'antd';
import ReactQuill from 'react-quill';
import { api } from '../api';
import EditArticleForm from '../components/EditArticleForm'

class AddArticleView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            article: {
                title: '',
                content: '',
                isPublished: false
            }
        }
    }
    
    render() {
        const { article } = this.state;

        return (
            <Row justify='center'>
                <Col span={12}>
                    <EditArticleForm 
                        article={article}
                        onChange={this.onChangeArticle}
                        onFinish={this.onSaveArticle}
                    />
                </Col>
            </Row>
        );
    }

    onChangeArticle = (param, newValue) => {
        this.setState(prevState => ({
            article: {
                ...prevState.article,
                [param]: newValue
            }
        }))
    }

    onSaveArticle = () => {
        const { article } = this.state;

        api
            .post('/articles', { ...article })
            .then(res => res.data)
            .then(articleId => this.props.history.push(`/blog/${this.props.user.nick}/${articleId}`));
    }
}

export default AddArticleView;