import React, { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Alert, Form } from "react-bootstrap";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser(authUser);
        const session = await Auth.currentSession();
        setAccessToken(session.getAccessToken().getJwtToken());
        setIdToken(session.getIdToken().decodePayload());
      } catch (err) {
        console.error("Error fetching user:", err);
        navigate("/"); // Redirect if not authenticated
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await Auth.signOut();
      navigate("/"); // Redirect to login page
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col md={{ span: 8, offset: 2 }}>
          <Card className="shadow-sm p-4 bg-white rounded">
            <h2 className="text-center mb-4">Welcome to the My APP!</h2>

            {user ? (
              <>
                <Card.Body>
                  <h4>User Details</h4>
                  <Alert variant="info">
                    <strong>Email:</strong> {user.attributes?.email || "N/A"}
                    <br />
                    <strong>Username:</strong> {user.username}
                  </Alert>

                  <h4 className="mt-3">Access Token</h4>
                  <Form.Control
                    as="textarea"
                    readOnly
                    value={accessToken || "Fetching token..."}
                    rows={5}
                    className="mb-3"
                  />

                  <h4>ID Token</h4>
                  <Alert variant="light">
                    <strong>Email:</strong> {idToken?.email || "N/A"}
                  </Alert>
                </Card.Body>

                <div className="text-center">
                  <Button variant="danger" onClick={handleSignOut} className="w-100">
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <Alert variant="warning">Loading user details...</Alert>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
