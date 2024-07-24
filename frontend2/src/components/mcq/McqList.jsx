import { Button, Card, List, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Urls } from "../../constant/Urls";
import { DeleteMcq, GetMCQs } from "../../services/api/mcq/mcq.service";

const MCQList = () => {
  const navigate = useNavigate();

  const [mcqs, setMcqs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMCQ, setSelectedMCQ] = useState(null);

  useEffect(() => {
    getMcqs();
  }, []);

  const getMcqs = async () => {
    try {
      const response = await GetMCQs();
      setMcqs(response.data);
    } catch (err) {
      console.error("Error fetching the MCQs:", err);
    }
  };

  const deleteMcq = async (id) => {
    try {
      const response = await DeleteMcq(id);
      toast.success("MCQ deleted successfully!");
      getMcqs();
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalVisible(false);
    }
  };

  const showDeleteModal = (mcq) => {
    setSelectedMCQ(mcq);
    setIsModalVisible(true);
  };

  const handleDeleteOk = () => {
    deleteMcq(selectedMCQ.id);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleEdit = (id) => {
    navigate(Urls.Mcqs.EditMcq(id));
  };

  return (
    <div className="container flex flex-col flex-grow p-4 mx-auto mb-5 align-items-center">
      <div className="flex items-center justify-between">
        <h1 className="mt-5 mb-4 text-2xl font-bold text-center">MCQ List</h1>
        <Button type="primary" onClick={() => navigate(Urls.Mcqs.NewMcq())}>
          Create
        </Button>
      </div>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={mcqs}
        renderItem={(mcq) => (
          <List.Item>
            <Card title={`ID: ${mcq.id}`} className="shadow-lg d-flex">
              <Link to={Urls.Mcqs.Mcq(mcq.id)}>
                <p className="text-lg">{mcq.body}</p>
              </Link>
              <div className="flex justify-end gap-4">
                <Button type="primary" onClick={() => handleEdit(mcq.id)}>
                  Edit
                </Button>
                <Button type="default" onClick={() => showDeleteModal(mcq)}>
                  Delete
                </Button>
              </div>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Delete MCQ"
        visible={isModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to delete this MCQ?</p>
      </Modal>
    </div>
  );
};

export default MCQList;
