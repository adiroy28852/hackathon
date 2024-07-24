import axios from "axios";

// Create an instance of axios with default configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Replace with your API base URL
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Fetch a specific MCQ by ID.
 * @param {number} id - The ID of the MCQ to fetch.
 * @returns {Promise} - Axios response promise with the MCQ data.
 */
export const GetMCQ = async (id) => {
  return await axiosInstance.get(`/mcqs/${id}`);
};

/**
 * Fetch all MCQs.
 * @returns {Promise} - Axios response promise with the list of all MCQs.
 */
export const GetMCQs = async () => {
  return await axiosInstance.get(`/mcqs`);
};

/**
 * Create a new MCQ.
 * @param {Object} data - The data of the new MCQ to create.
 * @returns {Promise} - Axios response promise with the created MCQ data.
 */
export const CreateMcq = async (data) => {
  return await axiosInstance.post(`/mcqs`, data);
};

/**
 * Update an existing MCQ by ID.
 * @param {number} id - The ID of the MCQ to update.
 * @param {Object} data - The updated data of the MCQ.
 * @returns {Promise} - Axios response promise with the updated MCQ data.
 */
export const UpdateMcq = async (id, data) => {
  return await axiosInstance.put(`/mcqs/${id}`, data);
};

/**
 * Delete an MCQ by ID.
 * @param {number} id - The ID of the MCQ to delete.
 * @returns {Promise} - Axios response promise indicating the success of the operation.
 */
export const DeleteMcq = async (id) => {
  return await axiosInstance.delete(`/mcqs/${id}`);
};
