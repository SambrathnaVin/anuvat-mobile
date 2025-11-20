import { fetchClient, storeClassroomId } from "../api/client";

const CLASSROOM_API_PATH = "/classrooms";

// Helper function to standardize success/error responses
const handleSuccess = (response) => ({ data: response.data, error: null });
const handleError = (e) => ({
  data: null,
  error: e.message || "An unknown API error occurred.",
});

export const getDetails = async (classId) => {
  try {
    const response = await fetchClient(
      "GET",
      `${CLASSROOM_API_PATH}/${classId}/details`
    );
    return handleSuccess(response);
  } catch (e) {
    return handleError(e);
  }
};

export const joinClassroom = async (code) => {
  try {
    const response = await fetchClient("POST", `${CLASSROOM_API_PATH}/join`, {
      code,
    });

    // Use the classroomId key from the successful Postman response
    const classId = response.data.classroomId;

    if (classId) {
      await storeClassroomId(classId);
      return { data: classId, error: null };
    } else {
      return {
        data: null,
        error: "Join successful but no class ID returned. Check API response.",
      };
    }
  } catch (e) {
    return handleError(e);
  }
};

export const getMaterials = async (classId) => {
  try {
    const response = await fetchClient(
      "GET",
      `${CLASSROOM_API_PATH}/${classId}/materials`
    );
    return handleSuccess(response);
  } catch (e) {
    return handleError(e);
  }
};

export const getPracticeAssignments = async (classId) => {
  try {
    const response = await fetchClient(
      "GET",
      `${CLASSROOM_API_PATH}/${classId}/assignments?type=practice`
    );
    return handleSuccess(response);
  } catch (e) {
    return handleError(e);
  }
};

export const getSubmissionAssignments = async (classId) => {
  try {
    const response = await fetchClient(
      "GET",
      `${CLASSROOM_API_PATH}/${classId}/assignments?type=submission`
    );
    return handleSuccess(response);
  } catch (e) {
    return handleError(e);
  }
};
