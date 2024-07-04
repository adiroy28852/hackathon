import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Urls } from "../../constant/Urls";
import { signup } from "../../services/api/auth/auth.service"; // Import the signup service

const SignupComponent = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await signup(values); // Use the signup service
      toast.success("Signup successful! Please login to continue.");
      navigate(Urls.Login());
    } catch (err) {
      toast.error(err?.response?.data?.error);
    }
  };

  return (
    <div className="flex items-center justify-center flex-grow px-8 py-24 bg-gray-100">
      <Form
        form={form}
        name="signup"
        className="w-full max-w-md p-8 bg-white shadow-md rounded-xl"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h2 className="mb-6 text-2xl font-bold text-center">Sign Up</h2>
        <Form.Item
          name="first_name"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="First name" />
        </Form.Item>
        <Form.Item
          name="last_name"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Last name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your Email!" }]}
        >
          <Input prefix={<MailOutlined />} type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirm"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item className="mt-8">
          <Button type="primary" htmlType="submit" className="w-full">
            Sign Up
          </Button>
        </Form.Item>
        <div className="text-center">
          Or <a href={Urls.Login()}>login now!</a>
        </div>
      </Form>
    </div>
  );
};

export default SignupComponent;
