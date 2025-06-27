import { signInStart,signInSuccess,signInFailure } from "./userSlice.js";

export const fetchCurrentUser = () => async (dispatch) => {
  dispatch(signInStart());

  const baseURL = import.meta.env.VITE_API_URL;

  try {
    const res = await fetch(`${baseURL}/user/current-user`, {
      method: 'GET',
      credentials: 'include', // ✅ send cookie
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    dispatch(signInSuccess({ user: data }));
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};
