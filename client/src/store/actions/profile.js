import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_PROFILE,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  DELETE_ACCOUNT,
  GET_PROFILES,
  GET_REPOS,
  NO_REPOS,
} from "./types";

// get the user profile from the user token
export const getCurrentProfile = () => async (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get("/api/profile/me");
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    // console.log(err.response);
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        message: err.response.data.errors.message,
        status: err.response.status,
      },
    });
  }
};

// Get all profiles
export const getProfiles = () => async (dispatch) => {
  try {
    dispatch({ type: CLEAR_PROFILE });

    dispatch(setAlert("Getting profiles", "info", 1000));
    const res = await axios.get("/api/profile");

    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

// Get profile by id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (err) {
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

// Get Github repository
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: NO_REPOS,
    });
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

// Create a profile
export const createProfile = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/api/profile", formData, config);
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Profile Created", "success"));

    history.push("/dashboard");
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

// Update a profile
export const updateProfile = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile", formData, config);

    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
    history.push("/dashboard");

    dispatch(setAlert("Profile updated", "success"));
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message)
      return dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

export const addExperience = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/experience", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

export const addEducation = (formData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.put("/api/profile/education", formData, config);

    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Added", "success"));

    history.push("/dashboard");
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Experience Added", "success"));
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

export const deleteEducation = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert("Education Added", "success"));
  } catch (err) {
    // set profile error -> if not a validation error
    if (err.response.data.errors && err.response.data.errors.message) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          message: err.response.data.errors.message,
          status: err.response.status,
        },
      });
      dispatch(setAlert(err.response.data.errors.message, "danger"));
      return;
    }

    // set alert errors from validation errors
    const errors = err.response.data.errors;
    if (errors)
      Object.values(errors).map((error) => dispatch(setAlert(error, "danger")));
  }
};

// delete account & profile
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone")) {
    try {
      await axios.delete(`/api/profile/`);
      dispatch({ type: CLEAR_PROFILE });
      dispatch({ type: DELETE_ACCOUNT });
      dispatch(setAlert("Account Deleted", "success"));
    } catch (err) {
      // set profile error -> if not a validation error
      if (err.response.data.errors && err.response.data.errors.message) {
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            message: err.response.data.errors.message,
            status: err.response.status,
          },
        });
        dispatch(setAlert(err.response.data.errors.message, "danger"));
        return;
      }

      // set alert errors from validation errors
      const errors = err.response.data.errors;
      if (errors)
        Object.values(errors).map((error) =>
          dispatch(setAlert(error, "danger"))
        );
    }
  }
};
