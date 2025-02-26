import React, { useState } from "react";
import { CognitoHostedUIIdentityProvider } from "@aws-amplify/auth";
import { Auth } from "aws-amplify";
import { Link, useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert, Row, Col } from "react-bootstrap";

const Welcome: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  /** Handles Email/Password Sign-In */
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const user = await Auth.signIn(email, password);
      console.log("User signed in:", user);
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Sign-in failed. Please try again.");
    }
  };

  /** Handles Google Sign-In */
  const handleGoogleSignIn = async () => {
    try {
      await Auth.federatedSignIn({ provider: CognitoHostedUIIdentityProvider.Google });
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "Google sign-in failed. Try again.");
    }
  };

  /** Handles LinkedIn OIDC Sign-In */
  const handleLinkedInSignIn = async () => {
    try {
      await Auth.federatedSignIn({ customProvider: 'LinkedIn' }); // Use 'oidc' for LinkedIn
      navigate("/home");
    } catch (err: any) {
      setError(err.message || "LinkedIn sign-in failed. Try again.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card style={{ width: "400px", padding: "20px" }}>
        <Card.Body>
          <h2 className="text-center mb-4">Welcome to My App</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSignIn}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100">
              Sign In
            </Button>
          </Form>

          <hr />

          <Row className="text-center">
            <Col>
              <Button onClick={handleGoogleSignIn} variant="danger" className="w-100 mb-2">
                Sign in with Google
              </Button>
            </Col>
          </Row>

          <Row className="text-center">
            <Col>
              <Button onClick={handleLinkedInSignIn} variant="dark" className="w-100">
                Sign in with LinkedIn
              </Button>
            </Col>
          </Row>

          <div className="text-center mt-3">
            <p>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
            <p>
              <Link to="/forgot-password">Forgot Password?</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Welcome;
