import * as firebase from "firebase/app"
import { history } from "../../../history"
import "firebase/auth"
import "firebase/database"
import axios from "axios"
import { config } from "../../../authServices/firebase/firebaseConfig"
import {toast} from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import {connect} from "react-redux";

toast.configure(); // required to work with toast

// Init firebase if not already initialized
if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

let firebaseAuth = firebase.auth()

// const initAuth0 = new auth0.WebAuth(configAuth)

export const submitLoginWithFireBase = (email, password, remember) => {
  return dispatch => {
    let userEmail = null,
      loggedIn = false
    firebaseAuth
      .signInWithEmailAndPassword(email, password)
      .then(result => {
        firebaseAuth.onAuthStateChanged(user => {
          result.user.updateProfile({
            displayName: "Admin"
          })
          let name = result.user.displayName
          if (user) {
            userEmail = user.email
            loggedIn = true
            dispatch({
              type: "LOGIN_WITH_EMAIL",
              payload: {
                email: userEmail,
                name,
                isSignedIn: loggedIn,
                loggedInWith: "firebase"
              }
            })
          }
          if (user && remember) {
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION)
              .then(() => {
                dispatch({
                  type: "LOGIN_WITH_EMAIL",
                  payload: {
                    email: userEmail,
                    name,
                    isSignedIn: loggedIn,
                    remember: true,
                    loggedInWith: "firebase"
                  }
                })
              })
          }
          history.push("/")
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export const loginWithFB = () => {
  return dispatch => {
    let provider = new firebase.auth.FacebookAuthProvider()
    provider.setCustomParameters({
      display: "popup"
    })
    firebaseAuth
      .signInWithPopup(provider)
      .then(result => {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        let token = result.credential.accessToken,
          // The signed-in user info.
          user = result.user.email
        dispatch({
          type: "LOGIN_WITH_FB",
          payload: {
            user,
            token,
            loggedInWith: "firebase"
          }
        })
        if (user) history.push("/")
      })
      .catch(error => {
        console.log(error)
      })
  }
}

export const loginWithTwitter = () => {
  return dispatch => {
    let provider = new firebase.auth.TwitterAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL
        dispatch({
          type: "LOGIN_WITH_TWITTER",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

export const loginWithGoogle = () => {
  return dispatch => {
    let provider = new firebase.auth.GoogleAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.user.displayName,
          photoUrl = result.user.photoURL
        dispatch({
          type: "LOGIN_WITH_GOOGLE",
          payload: {
            email: user,
            name: name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/pages/profile")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

export const loginWithGithub = () => {
  return dispatch => {
    let provider = new firebase.auth.GithubAuthProvider()
    firebaseAuth
      .signInWithPopup(provider)
      .then(function(result) {
        let token = result.credential.accessToken,
          user = result.user.email,
          name = result.additionalUserInfo.username,
          photoUrl = result.user.photoURL

        dispatch({
          type: "LOGIN_WITH_GITHUB",
          payload: {
            user,
            name,
            photoUrl,
            token,
            loggedInWith: "firebase"
          }
        })
        history.push("/")
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}

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
          history.push("/pages/home")
        }
      })
      .catch(error => {
        console.log(error)
        if (error.response && error.response.status)
          toast.error("Email ou mot de passe incorrect.")
        else
          toast.error("API injoignable.")
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

export const logoutWithFirebase = user => {
  return dispatch => {
    dispatch({ type: "LOGOUT_WITH_FIREBASE", payload: {} })
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
