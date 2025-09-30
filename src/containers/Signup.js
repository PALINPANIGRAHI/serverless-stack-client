import { useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import LoaderButton from "../components/LoaderButton";
import { useAppContext } from "../libs/contextLib";
import { useFormFields } from "../libs/hooksLib";
import { onError } from "../libs/errorLib";
import "./Signup.css";

export default function Signup() {
    const [fields, handleFieldChange] = useFormFields({
        username: "",
        email: "",
        firstName: "",
        password: "",
        confirmPassword: "",
        confirmationCode: "",
    });

    const [newUser, setNewUser] = useState(null);
    const { userHasAuthenticated } = useAppContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function validateForm() {
        return (
            fields.username.length > 0 &&
            fields.password.length > 0 &&
            fields.password === fields.confirmPassword
        );
    }

    function validateConfirmationForm() {
        return fields.confirmationCode.length > 0;
    }

    async function handleSubmit(event) {
event.preventDefault();
setIsLoading(true);
try {
const newUser = await Auth.signUp({
username: fields.username,
password: fields.password,
attributes: {
        email: fields.email,           // if your pool expects 'email', or 'emails' if it really requires that
        given_name: fields.firstName,
}});
setIsLoading(false);
setNewUser(newUser);
} catch (e) {
onError(e);
setIsLoading(false);
}
}

    async function handleConfirmationSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    try {
        await Auth.confirmSignUp(fields.username, fields.confirmationCode);
        await Auth.signIn(fields.username, fields.password);
        userHasAuthenticated(true);
        navigate("/");
    } catch (e) {
        onError(e);
        setIsLoading(false);
    }
}


    function renderConfirmationForm() {
        return (
            <Form onSubmit={handleConfirmationSubmit}>
                <Form.Group controlId="confirmationCode" size="lg">
                    <Form.Label>Confirmation Code</Form.Label>
                    <Form.Control
                        autoFocus
                        type="tel"
                        onChange={handleFieldChange}
                        value={fields.confirmationCode}
                    />
                    <Form.Text muted>Please check your email for the code.</Form.Text>
                </Form.Group>
                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateConfirmationForm()}
                >
                    Verify
                </LoaderButton>
            </Form>

        );
    }

    function renderForm() {
        return (
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="username" size="lg">
                    <Form.Label>UserName</Form.Label>
                    <Form.Control
                        name="username"
                        autoFocus
                        type="text"
                        value={fields.username}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="password" size="lg">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={fields.password}
                        onChange={handleFieldChange}
                    />
                </Form.Group>
                <Form.Group controlId="confirmPassword" size="lg">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                        type="password"
                        onChange={handleFieldChange}
                        value={fields.confirmPassword}
                    />
                </Form.Group>
                <Form.Group controlId="email" size="lg">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        value={fields.email}
                        onChange={handleFieldChange}
                    />
                </Form.Group>

                <Form.Group controlId="firstName" size="lg">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={fields.firstName}
                        onChange={handleFieldChange}
                    />
                </Form.Group>

                <LoaderButton
                    block
                    size="lg"
                    type="submit"
                    variant="success"
                    isLoading={isLoading}
                    disabled={!validateForm()}
                >
                    Signup
                </LoaderButton>
            </Form>
        );
    }

    return (
        <div className="Signup">
            {newUser === null ? renderForm() : renderConfirmationForm()}
        </div>
    );
}