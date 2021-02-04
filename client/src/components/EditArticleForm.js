import React from 'react';
import { Row, Col, Input, Checkbox, Button } from 'antd';
import ReactQuill from 'react-quill';
import styled from 'styled-components';

const EditArticleForm = (props) => {
    return (
        <ArticleArea>
            <Row gutter={[0, 16]}>
                <Col span={24}>
                    Tytuł:
                    <Input
                        value={props.article.title}
                        onChange={(e) => props.onChange('title', e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    Treść:
                    <ReactQuill
                        value={props.article.content}
                        onChange={(text) => props.onChange('content', text)} 
                    />
                </Col>
                <Col span={24}>
                    <Checkbox
                        checked={props.article.isPublished}
                        onChange={(e) => props.onChange('isPublished', e.target.checked)}
                    >
                        Opublikowany?
                    </Checkbox>
                </Col>
                <Col span={24}>
                    <Button onClick={props.onFinish} type='primary'>
                        Zapisz
                    </Button>
                </Col>
            </Row>
        </ArticleArea>
    );
}

const ArticleArea = styled.div`
    background-color: #FFFFFF;
    padding: 20px;
    border-radius: 15px;
`

export default EditArticleForm;