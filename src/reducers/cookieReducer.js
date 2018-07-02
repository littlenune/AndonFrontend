
export default function cookieReducer(state = { username:'',imgURL:'' }, action) {
    if(action.type === 'COOKIE') {
      return {
          username: action.username,
          imgURL: action.imgURL,
        }
    }
    return state;
  }