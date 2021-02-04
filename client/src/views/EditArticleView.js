import React, { Component } from 'react';
import { Row, Col } from 'antd';
import { api } from '../api';
import EditArticleForm from '../components/EditArticleForm'

class EditArticleView extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            article: {
                id: '',
                title: '',
                content: '',
                isPublished: false
            }
        }
    }
    
    componentDidMount() {
        this.fetchArticleInfo();
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

    fetchArticleInfo = () => {
        const { id } = this.props.match.params;

        api
            .get(`/articles/${id}`)
            .then(res => res.data)
            .then(obj => this.setState({ article: obj.article }));
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
            .patch(`/articles/${article.id}`, { ...article })
            .then(res => res.data)
            .then(articleId => this.props.history.push(`/blog/${this.props.user.nick}/${articleId}`));
    }
}

export default EditArticleView;