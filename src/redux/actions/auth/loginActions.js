import * as firebase from "firebase/app"
import { history } from "../../../history"
import axios from "axios"
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import {connect} from "react-redux";

toast.configure(); // required to work with toast

export const loginWithJWT = user => {
  return dispatch => {
    axios
      .post(global.config.server_url +"/token", {
        username: user.username,
        password: user.password
      })
      .then(response => {
        var loggedInUser
        if (response.data && !response.data.error) {
          loggedInUser = response.data.user
          console.log(loggedInUser);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.user.id);
          localStorage.setItem("profile_image", response.data.user.image);
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("political_party", response.data.user.political_party);

          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt"}
          })
          dispatch({type: "CHANGE_ROLE", userRole: response.data.user.role})
          history.push("/pages/home/main")
        }
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status)
          toast.error("Incorrect email or password.")
        else
          toast.error("Server Error.")
      });
  }
}

export const logoutWithJWT = () => {
  return dispatch => {
    localStorage.clear();
    dispatch({ type: "LOGOUT_WITH_JWT", payload: {} })
    history.push("/pages/login")
  }
}

export const changeRole = role => {
  return dispatch => dispatch({ type: "CHANGE_ROLE", userRole: role })
}

const mapStateToProps = state => {
  return {
    role: state.auth.login.userRole
  }
}
export default connect(mapStateToProps, { changeRole })(loginWithJWT)
