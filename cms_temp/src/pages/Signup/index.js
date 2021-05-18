import {
    Layout,
    Form,
    Input,
    Button,
    AutoComplete,
    Select,
    Row,
    Col,
    Dropdown,
    Menu,
    Tooltip
} from 'antd';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import React, { useState, useCallback } from 'react';
import { Link } from "react-router-dom";
import Promise from 'promise';
import Captcha from 'react-captcha-code';
import Style from './index.module.scss';
import { randomNum, originalCharacter } from "../Login/utils.ts";
import Axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Option } = AutoComplete;



const formItemLayout = {
    labelCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 8,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 16,
        },
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};


function Signup() {

    const [form] = Form.useForm();

    const [email, setEmail] = useState([]);

    const [captchaFeedback, setCaptchaFeedback] = useState(false);

    const captchaLength = 4;
    let isSubmit = 0;
    const userNameReg = /[\w-_\.]{3,20}/;
    const pwdReg = /[\w\.]{8,16}/
    //相同字符超过3位
    const repeatCharReg = /(\w)*(\w)\2{2}(\w)*/;
    const usernameTips = "The username supports between 3-20 characters long with mixed letters, numbers, '-', '_' and '.' ";
    const pwdTips = "The password included mixed letter, numbers and '.' between 8-16 characters long is suggested."
    const menu = (
        <Menu >
            <Menu.Item key="EN" >
                English
            </Menu.Item>
            <Menu.Item key="CN">
                简体中文
            </Menu.Item>
            <Menu.Item key="TC">
                繁體中文
            </Menu.Item>
        </Menu>
    )

    const handleSearch = (value) => {
        let res = [];
        if (!value || value.indexOf('@') >= 0) {
            res = [];
        }
        else {
            res = ['prnasia.com'].map((domain) => `${value}@${domain}`);
        }

        setEmail(res);
    }

    const handleSelectChange = (value) => {
        console.log(`selected ${value}`);
    }
    const createCaptcha = () => {
        //返回一个随机生成的验证码
        let str = "";
        for (let i = 0; i < captchaLength; i++) {
            const temp =
                originalCharacter[randomNum(0, originalCharacter.length - 1)];
            str = `${str}${temp}`;
        }
        return str;
    }
    const [captcha, setCaptcha] = useState(createCaptcha);
    //刷新图形验证码
    const handleCaptchaClick = useCallback(
        () => {
            const str = createCaptcha;
            setCaptcha(str);
        }, []);


    const handleButtonClick = () => {
        isSubmit = 1;
    }

    const onFinish = (values) => {
        const is_submit = isSubmit ? "1" : "0";
        const data = {
            ...values,
            is_submit
        }
        console.log(data);
        Axios.post(
            "http://passport.prnasia.com/user/userregister",
            data
        ).then((res) => {
            console.log(data);
        })
    }



    return (
        <div>
            <Layout className={Style.layout}>
                <Header className={Style.header}>
                    <div>
                        <img src="http://passport.prnasia.com/user/pro/longnest/images/logo-cn.png" alt="" />
                    </div>
                    <Dropdown overlay={menu}>
                        <Button>
                            English<DownOutlined />
                        </Button>
                    </Dropdown>

                </Header>
                <Content className={Style.content}>
                    <Form
                        {...formItemLayout}
                        form={form}
                        name="register"
                        initialValues={{ language: "0" }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            label="Username"
                            validateTrigger="onBlur"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your username!'
                                },
                                {
                                    pattern: userNameReg,
                                    trigger: "onFinish",
                                    message: 'Wrong username format!'
                                }
                            ]}
                        >
                            <Input suffix={
                                <Tooltip title={usernameTips} placement="right">
                                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                </Tooltip>
                            } />
                        </Form.Item>
                        <Form.Item 
                            name="useremail" 
                            label="E-mail" 
                            validateTrigger="onBlur"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your E-mail!'
                                },
                                {
                                    type: 'email',
                                    message: 'invalid email format'
                                }
                            ]}>
                            <AutoComplete
                                onSearch={handleSearch}>
                                {email.map((email) => (
                                    <Option key={email} value={email}>
                                        {email}
                                    </Option>
                                ))}
                            </AutoComplete>
                        </Form.Item>
                        <Form.Item
                            name="passwd"
                            label="Password"
                            validateFirst={true}
                            validateTrigger="onBlur"
                            rules={[
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                
                                },
                                {
                                    pattern: pwdReg,
                                    message: 'Wrong password format!'
                                },
                                () => ({
                                    validator(_, value) {
                                        if(repeatCharReg.test(value)){
                                            return Promise.reject('unsafe password!');
                                        }
                                        return Promise.resolve();
                                    }
                                })
                               
                            ]}
                            hasFeedback>
                            <Input type="password"
                                suffix={
                                    <Tooltip title={pwdTips} placement="right">
                                        <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                                    </Tooltip>
                                } />
                        </Form.Item>
                        <Form.Item
                            name="passwd_confirm"
                            label="Confirm Password"
                            dependencies={['passwd']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Please confirm your password!'
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('passwd') === value) {

                                            return Promise.resolve();
                                        };
                                        return Promise.reject(new Error('The two passwords you entered do not match!'));
                                    },
                                }),
                            ]}>
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Language"
                        >
                            <Select onChange={handleSelectChange}>
                                <Select.Option value="0">American English</Select.Option>
                                <Select.Option value="1">简体中文</Select.Option>
                                <Select.Option value="2">繁體中文</Select.Option>
                            </Select>
                        </Form.Item>
                        <Row gutter={6}>
                            <Col span={18} offset={2}>
                                <Form.Item
                                    name="captcha_input"
                                    label="Captcha"
                                    hasFeedback={captchaFeedback}
                                    validateTrigger="onBlur"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input captcha!'
                                            
                                        },
                                        () => ({
                                            validator(_, value) {
                                                console.log('value: ', value);
                                                if (value === captcha) {
                                                    setCaptchaFeedback(true);
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('Wrong captcha!')
                                            }
                                        })
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Captcha width={80} charNum={4} onClick={handleCaptchaClick} code={captcha} />
                            </Col>
                        </Row>



                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" block size="large" onClick={handleButtonClick}>
                                Register
                            </Button>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <div className={Style.text}>
                                <p>Already have account?&nbsp;&nbsp;<Link to="/login">Login</Link></p>

                            </div>
                        </Form.Item>


                    </Form>
                </Content>

                <Footer className={Style.footer}>
                    <ul className={Style.ul}>
                        <li><a href="http://www.prnasia.com/about/">Abount PR Newswire</a></li>
                        <li><a href="http://www.prnasia.com/contact-us/">Contact PR Newswire</a></li>
                        <li><a href="http://www.prnasia.com/p/lightnews-channel-1-35-0.shtml">PR Newswire Dynamic</a></li>
                        <li><a href="http://www.prnasia.com/terms/">Conditions of Services</a></li>
                        <li><a href="">Privacy Policy</a></li>
                        <li><a href="http://www.prnasia.com/careers/">Join Us</a></li>
                        <li><a href="http://www.prnasia.com/sitemap/">Site Map</a></li>
                        <li><a href="http://www.prnasia.com/rss">RSS Feeds</a></li>
                    </ul>
                    <div className={Style.copyRight}>
                        Copyright ? 2003-2018 PR Newswire All Rights Reserved.A Cision company.
                </div>
                </Footer>
            </Layout>
        </div>
    );
}

export default Signup;