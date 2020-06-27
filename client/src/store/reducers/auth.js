import {
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT,
  DELETE_ACCOUNT,
} from "../actions/types";

const initialState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: false,
  user: null,
};

// Register a user
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: {
      localStorage.setItem("token", payload);
      return {
        ...state,
        token: payload,
        isAuthenticated: true,
        loading: false,
      };
    }

    case REGISTER_FAILED:
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
    case DELETE_ACCOUNT: {
      localStorage.removeItem("token");
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        token: null,
        user: null,
      };
    }

    case USER_LOADED:
      return { ...state, isAuthenticated: true, loading: false, user: payload };

    default:
      return state;
  }
}
