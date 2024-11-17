import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import { PrivateRoutes, PublicOnlyRoutes } from "./components/RouteProtection";
import { ExerciseProvider } from "./utils/exerciseContext";
import { ToastProvider } from "./utils/ToastContext";

function App() {
    const isAuthenticated = !!localStorage.getItem("token");

    return (
        <Router>
            <ToastProvider>
                <ExerciseProvider>
                    <div className="App">
                        <Routes>
                            {/* Home route is always accessible but redirects if logged in */}
                            <Route
                                path="/"
                                element={
                                    isAuthenticated ? (
                                        <Navigate to="/dashboard" replace />
                                    ) : (
                                        <Home />
                                    )
                                }
                            />

                            {/* Public only routes (accessible only when logged out) */}
                            <Route element={<PublicOnlyRoutes />}>
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                            </Route>

                            {/* Private routes (accessible only when logged in) */}
                            <Route element={<PrivateRoutes />}>
                                <Route
                                    path="/dashboard"
                                    element={<Dashboard />}
                                />
                                <Route
                                    path="/"
                                    element={
                                        <Navigate to="/dashboard" replace />
                                    }
                                />
                            </Route>

                            {/* Catch all other routes */}
                            <Route
                                path="*"
                                element={
                                    isAuthenticated ? (
                                        <Navigate to="/dashboard" replace />
                                    ) : (
                                        <Navigate to="/" replace />
                                    )
                                }
                            />
                        </Routes>
                    </div>
                </ExerciseProvider>
            </ToastProvider>
        </Router>
    );
}

export default App;
