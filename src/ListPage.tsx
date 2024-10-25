import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { ProList, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Button, Tag, message, Popconfirm, Card } from 'antd';
import React, { useState, useEffect } from 'react';

export default () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [editModalVisit, setEditModalVisit] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [dataSource, setDataSource] = useState<{ title: string; content: string; author: string; _id: string }[]>([]);

  // 获取本地存储的 token
  const token = localStorage.getItem('authToken');

  // 从后端获取所有文章数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://3.142.76.164:8080/article/');
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
        }
        const data = await response.json();
        setDataSource(data); // 假设返回的是文章列表，直接设置到 dataSource
      } catch (error) {
        message.error(`Failed to fetch data: ${error}`);
      }
    };
    fetchData();
  }, []);

  // 新建文章时，提交内容到后端
  const handleFinish = async (values: { name: string; company: string; content: string }) => {
    try {
      const response = await fetch('http://3.142.76.164:8080/article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // 添加 Authorization 头部
        },
        body: JSON.stringify({
          title: values.name,
          content: values.content,
          author: values.company,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      message.success('Submission successful');
      setModalVisit(false);
      const newArticle = await response.json();
      setDataSource([...dataSource, newArticle]); // 添加新文章到列表
    } catch (error) {
      message.error(`Submission failed: ${error}`);
      console.error(`Submission failed details: ${error}`);
    }
  };

  // 删除文章
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://3.142.76.164:8080/article/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,  // 添加 Authorization 头部
        },
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      message.success('Deletion successful');
      setDataSource(dataSource.filter((article) => article._id !== id)); // 从列表中移除已删除的文章
    } catch (error) {
      message.error(`Deletion failed: ${error}`);
      console.error(`Deletion failed details: ${error}`);
    }
  };

  // 编辑文章
  const handleEdit = async (values: { name: string; content: string }) => {
    if (!currentArticle) return;
    try {
      const response = await fetch(`http://3.142.76.164:8080/article/${currentArticle._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // 添加 Authorization 头部
        },
        body: JSON.stringify({
          title: values.name,
          content: values.content,
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
      }

      message.success('Update successful');
      setEditModalVisit(false);
      const updatedArticle = await response.json();
      setDataSource(
        dataSource.map((article) =>
          article._id === currentArticle._id ? updatedArticle : article
        )
      ); // 更新文章
    } catch (error) {
      message.error(`Update failed: ${error}`);
      console.error(`Update failed details: ${error}`);
    }
  };

  return (
    <>
      <ProList<{ title: string; content: string; author: string; _id: string }>
        toolBarRender={() => {
          return [
            <Button
              key="modalButton"
              type="primary"
              onClick={() => {
                setModalVisit(true);  // 打开模态框
              }}
            >
              <PlusOutlined />
              Create new article
            </Button>,
          ];
        }}
        itemLayout="vertical"
        rowKey="_id"
        headerTitle="Article List"
        dataSource={dataSource}  // 绑定从后端获取的数据
        metas={{
          title: {
            dataIndex: 'title',
          },
          description: {
            render: (_, row) => (
              <>
                <Tag>{row.author}</Tag>
              </>
            ),
          },
          actions: {
            render: (_, row) => [
              <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                {/* 修改按钮 */}
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setCurrentArticle(row);  // 设定当前编辑的文章
                    setEditModalVisit(true);  // 打开编辑模态框
                  }}
                >
                  Edit
                </Button>
                {/* 删除按钮 */}
                <Popconfirm
                  title="Are you sure you want to delete this article?"
                  onConfirm={() => handleDelete(row._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" icon={<DeleteOutlined />} danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            ],
          },
          content: {
            render: (_, row) => {
              return (
                <Card style={{ marginBottom: 16 }}>
                  <div>{row.content}</div>
                </Card>
              );
            },
          },
        }}
      />

      {/* ModalForm - 新建文章 */}
      <ModalForm
        title="Create new article"
        open={modalVisit}
        onFinish={handleFinish}  // 当用户点击提交时，发送数据到后端
        onOpenChange={setModalVisit}
      >
        <ProFormText
          width="md"
          name="name"
          label="Article Title"
          placeholder="Enter article title"
          rules={[{ required: true, message: 'Please enter the article title' }]}
        />
        <ProFormText
          width="md"
          name="company"
          label="Author"
          placeholder="Enter author name"
          rules={[{ required: true, message: 'Please enter the author name' }]}
        />

        {/* 新增 ProFormTextArea 用于输入文章正文 */}
        <ProFormTextArea
          name="content"
          label="Article Content"
          placeholder="Enter article content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },  // 控制文本框的最小和最大行数
          }}
          rules={[{ required: true, message: 'Please enter the article content' }]}
        />
      </ModalForm>

      {/* ModalForm - 编辑文章 */}
      <ModalForm
        title="Edit article"
        open={editModalVisit}
        onFinish={handleEdit}  // 修改文章
        onOpenChange={setEditModalVisit}
        initialValues={{
          name: currentArticle?.title,  // 初始值设定为当前文章的标题
          content: currentArticle?.content,  // 初始值设定为当前文章的内容
        }}
      >
        <ProFormText
          width="md"
          name="name"
          label="Article Title"
          placeholder="Enter article title"
          rules={[{ required: true, message: 'Please enter the article title' }]}
        />
        <ProFormTextArea
          name="content"
          label="Article Content"
          placeholder="Enter article content"
          width="lg"
          fieldProps={{
            autoSize: { minRows: 5, maxRows: 10 },
          }}
          rules={[{ required: true, message: 'Please enter the article content' }]}
        />
      </ModalForm>
    </>
  );
};
