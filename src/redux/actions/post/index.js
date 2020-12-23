import axios from "axios"
import { history } from "../../../history"

export const getPosts = param => {
  return async dispatch => {
      const Config = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
      await axios.get(global.config.server_url + "/posts", Config).then(response => {
        dispatch({
          type: "GET_POSTS",
          posts: response.data,
        })
      });
  }
}

export const searchPost = val => {
    return async dispatch => {
        const Config = {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        }
        await axios.get(global.config.server_url + "/searchPost?searchText="+val, Config).then(response => {
            dispatch({
                type: "GET_POSTS",
                posts: response.data,
            })
        });
    }
}
