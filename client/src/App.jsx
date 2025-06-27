import { Route, Routes } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { About } from "./pages/About";
import { Projects } from "./pages/Projects";
import { Signin } from "./pages/Signin";
import { Header } from "./components/Header";
import { DashProfile } from "./components/DashProfile";
import { UserDashboard } from "./components/UserDashboard";
import { AddPost } from "./pages/AddPost";
import { AllPost } from "./pages/AllPost";
import { Users } from "./pages/users";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./redux/user/apiCall";
import { useEffect } from "react";
import { PrivateRoute } from "./components/privateRout";
import { BottomNav } from "./components/ButtonNav";


function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // ✅ Get user state

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <div style={{ paddingBottom: currentUser ? '56px' : '0px' }}> {/* Add padding for bottom nav */}
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/login" element={<Signin />} />
         

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <DashProfile />
              </PrivateRoute>
            }
          />
        
          <Route
            path="/add-post"
            element={
              <PrivateRoute>
                <AddPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-post"
            element={
              <PrivateRoute>
                <AllPost />
              </PrivateRoute>
            }
          />
          <Route
            path="/all-users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* ✅ Show Bottom Navigation only if user is logged in */}
      {currentUser && <BottomNav />}
    </div>
  );
}

export default App;
