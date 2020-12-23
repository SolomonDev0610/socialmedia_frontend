const initialState = {
  posts: [],
}

const post = (state = initialState, action) => {
  switch (action.type) {
    case "GET_POSTS":
      return { ...state, posts: action.posts}
    default:
      return state
  }
}

export default post
