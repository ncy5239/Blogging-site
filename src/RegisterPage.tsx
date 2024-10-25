import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';  // 导入 Button 和 message
import { useNavigate } from 'react-router-dom';  // 导入 useNavigate
import { useState } from 'react';

type RegisterFormValues = {
  username: string;
  password: string;
  confirmPassword: string;
};

export default () => {
  const navigate = useNavigate();  // 使用 useNavigate 来实现页面跳转

  const handleRegister = async (values: RegisterFormValues) => {
    const { username, password } = values;

    try {

      const response = await fetch('http://3.142.76.164:8080/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        message.success('Registration successful!');
        navigate('/');  // 注册成功后跳转到登录页面
      } else {
        const errorData = await response.json();
        message.error(`Registration failed: ${errorData.message}`);
      }
    } catch (error) {
      message.error('Registration request failed, please try again later.');
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <LoginForm
        title="Register"
        subTitle="Please fill in the information to create an account"
        onFinish={handleRegister}  
        submitter={{
          render: (props) => {
            return (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button
                  type="primary"
                  key="register"
                  onClick={() => props.submit()}
                  style={{ marginRight: 10 }}
                >
                  Register
                </Button>
              </div>
            );
          },
        }}
      >
        <ProFormText
          name="username"
          fieldProps={{
            size: 'large',
            prefix: <UserOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Username'}
          rules={[
            {
              required: true,
              message: 'Please enter your username!',
            },
          ]}
        />

        <ProFormText.Password
          name="password"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Enter password'}
          rules={[
            {
              required: true,
              message: 'Please enter your password!',
            },
          ]}
        />

        <ProFormText.Password
          name="confirmPassword"
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className={'prefixIcon'} />,
          }}
          placeholder={'Confirm your password'}
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        />
      </LoginForm>
    </ProConfigProvider>
  );
};
