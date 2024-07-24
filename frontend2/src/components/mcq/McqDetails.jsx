import { Button, Card, List, Modal, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Urls } from "../../constant/Urls";
import { GetMCQ } from "../../services/api/mcq/mcq.service";

const MCQDetails = () => {
  const { id: mcqId } = useParams();
  const [mcq, setMcq] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getMcq();
  }, [mcqId]);

  const getMcq = async () => {
    try {
      const response = await GetMCQ(mcqId);
      setMcq(response.data);
    } catch (err) {
      console.error("Error fetching the MCQ:", err);
    } finally {
      setLoading(false);
    }
  };

  const showDeleteModal = () => {
    setIsModalVisible(true);
  };

  const handleDelete = () => {};

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = () => {
    navigate(Urls.Mcqs.EditMcq(mcqId));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!mcq) {
    return <p>MCQ not found.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 mb-5">
      <h1 className="mt-5 mb-4 text-2xl font-bold text-center">Mcq Details</h1>
      <Card title={`Mcq ID: ${mcq.id}`} className="shadow-lg">
        <p className="text-lg font-bold">{mcq.body}</p>
        <List
          itemLayout="horizontal"
          dataSource={mcq?.options?.map((option, index) => ({
            option: index + 1,
            text: option.body,
            is_correct: option.is_correct,
          }))}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={`Option ${item.option} - ${item.is_correct}`}
                description={item.text}
              />
            </List.Item>
          )}
        />
        <div className="p-4 mt-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold">Explanation:</h3>
          <p>{mcq.explanation}</p>
        </div>
        <div className="mt-4">
          <div className="flex justify-between w-full">
            <Button type="" onClick={() => navigate(Urls.Mcqs.Mcqs())}>
              Cancel
            </Button>
            <div className="flex gap-8">
              <Button type="primary" onClick={handleEdit}>
                Edit
              </Button>
              <Button type="default" onClick={showDeleteModal}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <Modal
        title="Delete MCQ"
        visible={isModalVisible}
        onOk={handleDelete}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this MCQ?</p>
      </Modal>
    </div>
  );
};

export default MCQDetails;
