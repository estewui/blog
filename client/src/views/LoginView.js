import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Row, Button, Input } from 'antd';
class LoginView extends Component {
    render() {
        return (
            <div>
                <Row justify='center' align='middle'>
                    <div style={{width: '30%', background: 'white', padding: 20, marginTop: 100, borderRadius: 15}}>
                        <Form
                            layout='vertical'
                            onFinish={this.props.onLogin}
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
                                    Zaloguj się
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Row>
                <Row justify='center' style={{marginTop: 20}}>
                    <Link to='/register' style={{color: 'white'}}>
                        Nie masz konta? Zarejestruj się!
                    </Link>
                </Row>
            </div>
        );
    }


}

export default LoginView;