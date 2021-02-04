import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { Row, Form, Input, Button } from 'antd';
import { api } from '../api';

class RegisterView extends Component {
    render() {
        return (
            <div>
                <Row justify='center' align='middle'>
                    <div style={{width: '30%', background: 'white', padding: 20, marginTop: 100, borderRadius: 15}}>
                        <Form
                            layout='vertical'
                            onFinish={this.handleRegister}
                        >
                            <Form.Item
                                label="Nick"
                                name="nick"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Hasło"
                                name="password"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Zarejestruj się
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Row>
                <Row justify='center' style={{marginTop: 20}}>
                    <Link to='/login' style={{color: 'white'}}>
                        Masz już konto? Zaloguj się!
                    </Link>
                </Row>
            </div>
        );
    }

    handleRegister = (values) => {
        api
            .post('/register', { ...values })
            .then(() => this.props.history.push('/login'))
            .catch(err => console.log(err));
    }
}

export default RegisterView;