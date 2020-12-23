import * as firebase from "firebase/app"
import { history } from "../../../history"
import "firebase/auth"
import "firebase/database"
import axios from "axios"

export const signupWithJWT = (username, password, political_party) => {

  return dispatch => {
    axios.post(global.config.server_url + "/register", {
        username: username,
        password: password,
        political_party: political_party,
      })
      .then(response => {
        console.log("--------- register ----------");
        console.log(response.data);
        if(response.data){
          var loggedInUser = response.data.user;

          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user_id", response.data.user.id);
          localStorage.setItem("profile_image", response.data.user.image);
          localStorage.setItem("username", response.data.user.username);
          localStorage.setItem("political_party", response.data.user.political_party);

          dispatch({
            type: "LOGIN_WITH_JWT",
            payload: { loggedInUser, loggedInWith: "jwt" }
          })

          history.push("/pages/home/main")
        }

      })
      .catch(err => console.log(err))

  }
}
