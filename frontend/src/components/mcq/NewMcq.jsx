import { Button, Card, Checkbox, Form, Input } from "antd";
import React, { useState } from "react";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Urls } from "../../constant/Urls";
import { CreateMcq } from "../../services/api/mcq/mcq.service";

const NewMcq = () => {
  const [options, setOptions] = useState([
    { id: 1, body: "", is_correct: false },
  ]);
  const [id, setId] = useState(2);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createMcq = async (data) => {
    try {
      const response = await CreateMcq(data);
      toast.success("MCQ created successfully!");
      navigate(Urls.Mcqs.Mcqs());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = (values) => {
    setLoading(true);
    const data = {
      body: values.body,
      explanation: values.explanation,
      options: options.map((option) => ({
        body: values[`option_${option.id}`],
        is_correct: values[`is_correct_${option.id}`] || false,
      })),
    };
    createMcq(data);
  };

  const addOption = () => {
    setOptions([...options, { id: id, is_correct: false, body: "" }]);
    setId(id + 1);
  };

  const removeOption = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  return (
    <div className="container flex flex-col items-center justify-center flex-grow p-4 mx-auto mb-5">
      <h1 className="mt-5 mb-4 text-2xl font-bold text-center">Create Mcq</h1>
      <Card className="w-full shadow-lg lg:w-1/2">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item
            label="Question"
            name="body"
            rules={[{ required: true, message: "Please input the question!" }]}
          >
            <Input />
          </Form.Item>
          {options.map((option, index) => (
            <div key={option.id} className="">
              <Form.Item
                label={`Option ${index + 1}`}
                name={`option_${option.id}`}
                rules={[
                  {
                    required: true,
                    message: `Please input option ${index + 1}`,
                  },
                ]}
                className="mb-3"
              >
                <Input />
              </Form.Item>
              <div className="flex justify-between ">
                <Form.Item
                  name={`is_correct_${option.id}`}
                  valuePropName="checked"
                >
                  <Checkbox>Correct</Checkbox>
                </Form.Item>
                <Button type="primary" onClick={() => removeOption(option.id)}>
                  <MdOutlineDeleteOutline className="text-xl" />
                </Button>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="dashed" onClick={addOption} className="mb-4">
              Add Option
            </Button>
          </div>

          <Form.Item
            label="Explanation"
            name="explanation"
            rules={[
              { required: true, message: "Please input the explanation!" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-between w-full">
              <Button type="" onClick={() => navigate(Urls.Mcqs.Mcqs())}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewMcq;
