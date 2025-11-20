import {
  fetchClient,
  removeClassroomId,
  removeToken,
  storeToken,
} from "../api/clients";

const AUTH_API_PATH = "/users";

const fetchUserData = async () => {
  try {
    const response = await fetchClient("GET", `${AUTH_API_PATH}/me`);
    // Assuming API returns { user: {id, email, name} }
    return response.data.user;
  } catch (e) {
    console.error("API /me failed, clearing token:", e.message);
    await removeToken();
    await removeClassroomId();
    return null;
  }
};

export const getCurrentUser = async () => {
  // We don't need to check for token here, fetchUserData handles the check internally.
  return await fetchUserData();
};

export const login = async (email, password) => {
  try {
    const response = await fetchClient(
      "POST",
      `${AUTH_API_PATH}/login`,
      { email, password },
      false
    );

    const { idToken, user } = response.data; // Assuming API returns { idToken, user }

    if (idToken) {
      await storeToken(idToken);
    }

    return user;
  } catch (e) {
    throw new Error(e.message || "Login failed due to an unknown error.");
  }
};

export const register = async (email, password, name) => {
  try {
    const response = await fetchClient(
      "POST",
      `${AUTH_API_PATH}/register`,
      { email, password, name },
      false
    );

    const { idToken, user } = response.data;

    if (idToken) {
      await storeToken(idToken);
    }

    return user;
  } catch (e) {
    throw new Error(
      e.message || "Registration failed due to an unknown error."
    );
  }
};

export const logout = async () => {
  await removeToken();
  await removeClassroomId();
};
