import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Urls } from "../../constant/Urls";
import AuthContext from "../../contexts/auth.context";
import { login } from "../../services/api/authService"; // Import the login service
import AuthCookies from "../../services/cookie/authToken.cookie";

const LoginComponent = () => {
  const { setIsLoggedInUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await login(values); // Use the login service
      AuthCookies.SetAccessToken(response.data.access);
      AuthCookies.SetRefreshToken(response.data.refresh);
      setIsLoggedInUser(true);
      toast.success("Login successful!");
      navigate(Urls.Home());
    } catch (err) {
      console.log(err);
      toast.error("Incorrect username or password!");
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow px-8 py-24 bg-gray-100">
      <Form
        name="login"
        className="w-full max-w-md p-8 bg-white shadow-md rounded-xl "
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Log In</h2>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Log In
          </Button>
        </Form.Item>
        <div className="text-center">
          Or <a href={Urls.Signup()}>register now!</a>
        </div>
      </Form>
    </div>
  );
};

export default LoginComponent;
