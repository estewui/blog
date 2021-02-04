import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Row, Col, Dropdown } from 'antd';

const CustomHeader = (props) => {    
    const menu = (
        <Menu>
          <Menu.Item key="0">
            <a onClick={props.onLogout}>
              Wyloguj
            </a>
          </Menu.Item>
        </Menu>
      );
    
    const getSelectedKeys = (urlLocation) => {
        if (urlLocation.indexOf('/blogs') >= 0)
            return ['1']

        if (urlLocation.indexOf('/blogs') >= 0)
            return ['1']

        if (urlLocation.indexOf(`/blog/`) >= 0)
            return ['2']

        if (urlLocation.indexOf('/add-article') >= 0)
            return ['3']

        return [];
    }

    return (
        <Row justify='space-between'>
            <Col span={16}>
                <Menu mode="horizontal" selectedKeys={getSelectedKeys(props.location.pathname)}>
                    <Menu.Item key="1">
                        <Link to='/blogs'>
                            Wszystkie blogi
                        </Link>
                        </Menu.Item>
                    {props.user &&
                        <Menu.Item key="2">
                            <Link to={`/blog/${props.user.nick}`}>
                                Twoje wpisy
                            </Link>
                        </Menu.Item>
                    }
                    {props.user && 
                        <Menu.Item key="3">
                            <Link to='/add-article'>
                                Dodaj wpis
                            </Link>
                        </Menu.Item>
                    }
                </Menu>
            </Col>
            {props.user && 
                <Col span={8} style={{textAlign: 'right'}}>
                    Zalogowany jako: &nbsp;
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {props.user.nick} 
                        </a>
                    </Dropdown>
                    
                </Col>
            }
            {!props.user && 
                <Link to='/login'>
                    Zaloguj się
                </Link>
            }
        </Row>
    )
}

export default CustomHeader;