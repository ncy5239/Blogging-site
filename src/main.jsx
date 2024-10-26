import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // 导入样式文件

// 创建根元素
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染应用程序
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);