import {
    Input,
    Layout,
    Typography,
    Form,
    Button,
    Checkbox,
    Row,
    Col,
    Menu,
    Dropdown,
} from "antd";
import {
    UserOutlined,
    KeyOutlined,
    SafetyOutlined,
    DownOutlined
} from "@ant-design/icons";
// import Captcha from 'react-captcha-code';
import React, { useCallback, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Style from "./index.module.scss";
// import { randomNum, originalCharacter } from "./utils.ts";
import Axios from "axios";
import Logo from "./logo-en-blue.png"

const { Header, Content } = Layout;
const { Title } = Typography;

function Login() {

    /**
     * 生成图形验证码  用captcha存放验证码
     * @returns 
     */
    const captchaLength = 4
    const [captchaKey, setCaptchaKey] = useState("");
    const [captchaSrc, setCaptchaSrc] = useState("");
    const [captchaFeedback, setCaptchaFeedback] = useState(false)

    // const createCaptcha = () => {
    //     //返回一个随机生成的验证码
    //     let str = "";
    //     for (let i = 0; i < captchaLength; i++) {
    //         const temp =
    //             originalCharacter[randomNum(0, originalCharacter.length - 1)];
    //         str = `${str}${temp}`;
    //     }
    //     return str;
    // }

    //刷新图形验证码
    const getCaptcha =
        () => {
            Axios.get(
                `http://139.198.21.183:9999/prn-auth-service/captcha/generate?textLength=${captchaLength}`
            ).then((response) => {
                const { headers } = response;
                console.log(response);
                setCaptchaKey(headers.captchakey);
                console.log("captcha: ", captchaKey)
                setCaptchaSrc(
                    `http://139.198.21.183:9999/prn-auth-service/captcha/generate?captchaKey=${headers.captchakey}&textLength=${captchaLength}&imgWidth=177&imgHeight=40`
                );
            });
            // const str = createCaptcha;
            // setCaptcha(str);
        };

    useEffect(() => {
        getCaptcha();
    }, []);

    const handleCaptchaClick = () => {
        getCaptcha()
    }


    const onFinish = (values) => {
        const autoLogin = values.autoLogin ? "1" : "0";

        const data = {
            ...values,
            autoLogin,
            captchaKey: captchaKey
        };
        console.log(data)
        Axios.post(
            "http://139.198.21.183:9999/prn-auth-service/login/login",
            data
        ).then((res) => {
            const { data } = res;
            console.log(data);
        })
    }

    const menu = (
        <Menu >
          <Menu.Item key="0">English</Menu.Item>
          <Menu.Item key="1">简体中文</Menu.Item>
        </Menu>
      );

    return (
        <div>
            <Layout className={Style.layout}>
                <Header className={Style.header}>
                    <div>
                        <img src={Logo} alt="logo" />
                    </div>
                    <Dropdown
                        overlay={menu}
                        trigger={["click"]}
                        placement="bottomCenter"
                    >
                        <span
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                            style={{ cursor: "pointer" }}
                        >
                            {"language"} <DownOutlined />{" "}
                           
                        </span>
                    </Dropdown>
                </Header>

                <Content className={Style.content}>
                    <Title className={Style.title}>console.prnasia.com</Title>
                    <Form onFinish={onFinish} className={Style.form}>
                        <Form.Item
                            name="username"
                            relus={[{ required: true, message: 'Please input your username' }]}>
                            <Input prefix={<UserOutlined />} size="large" placeholder="Username" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: 'Please input your password' }]}>
                            <Input.Password prefix={<KeyOutlined />} size="large" placeholder="Password" />
                        </Form.Item>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="captchaText"
                                    hasFeedback={captchaFeedback}
                                    validateTrigger="onChange"
                                    relus={[
                                        {
                                            required: true

                                        },
                                        () => ({
                                            async validator(rule, value) {
                                                if (value.length < captchaLength) {
                                                    setCaptchaFeedback(false);
                                                    return Promise.resolve();
                                                }
                                                const res = await Axios.post(
                                                    "http://139.198.21.183:9999/prn-auth-service/captcha/verify",
                                                    {
                                                        captchaKey: captchaKey,
                                                        captchaText: value,
                                                    }
                                                );
                                                console.log("res: ", res);
                                                setCaptchaFeedback(true);
                                                const { data } = res;
                                                if (data) {
                                                    return Promise.resolve();
                                                } else {
                                                    return Promise.reject("captchaError!")
                                                }
                                            }
                                        })
                                    ]}>
                                    <Input size="large" placeholder="please input captcha" prefix={<SafetyOutlined />} />
                                </Form.Item>

                            </Col>
                            {/* <Col span={7}>
                                <Form.Item>
                                    <Captcha charNum={4} onClick={handleCaptchaClick} code={captchaKey} />
                                </Form.Item>
                            </Col> */}
                            <Col span={12}>
                                <img
                                    src={captchaSrc}
                                    alt=""
                                    onClick={handleCaptchaClick}
                                    style={{ maxWidth: "100%" }}
                                />
                            </Col>
                        </Row>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="autoLogin"
                                    valuePropName="checked"
                                    initialValue={false}
                                >
                                    <Checkbox>auto-login</Checkbox>
                                </Form.Item>
                            </Col>
                            <Col span={12} style={{ marginTop: 5, textAlign: "right" }}>
                                <a href="https://cddn.net"> Forget your password. </a>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" block size="large">
                                Login
                        </Button>
                        </Form.Item>
                        <div>
                            <Link to="/signup"> Sign Up </Link>
                        </div>
                    </Form>
                </Content>
            </Layout>
        </div>
    )
}

export default Login;