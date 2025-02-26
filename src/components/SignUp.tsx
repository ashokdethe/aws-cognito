import React, { useState, useEffect } from "react";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  /** Validates the password live */
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) errors.push("Password must be at least 8 characters.");
    if (!/[0-9]/.test(password)) errors.push("Password must contain at least one number.");
    if (!/[a-z]/.test(password)) errors.push("Password must contain at least one lowercase letter.");
    if (!/[A-Z]/.test(password)) errors.push("Password must contain at least one uppercase letter.");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) errors.push("Password must contain at least one special character.");
    setPasswordErrors(errors);
  };

  /** Validates confirm password */
  const validateConfirmPassword = (confirmPassword: string) => {
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match!");
    } else {
      setConfirmPasswordError("");
    }
  };

  /** Handles user sign-up */
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (passwordErrors.length > 0 || confirmPasswordError) {
      setError("Please fix the password errors before signing up.");
      return;
    }

    try {
      await Auth.signUp({
        username: email,
        password,
        attributes: { email, given_name: firstName, family_name: lastName },
      });
      setShowConfirmation(true);
      setSuccessMessage("Sign-up successful! Check your email for the confirmation code.");
      setResendTimer(15);
    } catch (err: any) {
      setError(err.message || "An error occurred during sign-up.");
    }
  };

  /** Handles confirmation code submission */
  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    try {
      await Auth.confirmSignUp(email, code);
      setSuccessMessage("Sign-up confirmed! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    } catch (err: any) {
      setError(err.message || "Invalid confirmation code.");
    }
  };

  /** Handles resending the confirmation code */
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setError("");
    setSuccessMessage("");
    try {
      await Auth.resendSignUp(email);
      setSuccessMessage("Confirmation code resent! Check your email.");
      setResendTimer(15);
    } catch (err: any) {
      setError(err.message || "Error resending the confirmation code.");
    }
  };

  /** Countdown Timer Effect */
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card p-4 shadow-sm" style={{ width: "400px" }}>
        <h2 className="text-center mb-3">Sign Up</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        {!showConfirmation ? (
          /** Sign Up Form */
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
              />
              {passwordErrors.length > 0 && (
                <ul className="text-danger mt-1 small">
                  {passwordErrors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  validateConfirmPassword(e.target.value);
                }}
                required
              />
              {confirmPasswordError && <div className="text-danger small">{confirmPasswordError}</div>}
            </div>
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="showPasswordCheck"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <label className="form-check-label" htmlFor="showPasswordCheck">
                Show Password
              </label>
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign Up</button>
          </form>
        ) : (
          /** Confirmation Code Form */
          <form onSubmit={handleConfirmSignUp}>
            <div className="mb-3">
              <label className="form-label">Confirmation Code</label>
              <input
                type="text"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">Confirm Sign Up</button>
          </form>
        )}

        <div className="text-center mt-3">
          <p>
            Already have an account? <Link to="/">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
