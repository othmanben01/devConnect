import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGOUT,
  CLEAR_PROFILE,
} from "./types";
import { setAlert } from "./alert";
import setAuthToken from "../../components/utils/setAuthToken";
import { LOGIN_SUCCESS, LOGIN_FAILED } from "./types";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/api/auth");
    dispatch({ type: USER_LOADED, payload: res.data });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Register a user
export const register = ({ name, email, password }) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post("/api/users", body, config);
    dispatch(setAlert("Loading your profile", "info", 1000));
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data.token,
    });
    dispatch(loadUser());
  } catch (err) {
    // Set alerts
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));

    // Dispatch register failed
    dispatch({
      type: REGISTER_FAILED,
    });
  }
};

// login a user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/api/auth", body, config);
    dispatch(setAlert("Loading your profile", "info", 1000));
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data.token,
    });
    dispatch(loadUser());
  } catch (err) {
    // Set alerts
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));

    // Dispatch register failed
    dispatch({
      type: LOGIN_FAILED,
    });
  }
};

// Logout / Clear the profile
export const logout = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
};
