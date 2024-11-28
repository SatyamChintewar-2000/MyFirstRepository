import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { collection, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

import { db, auth } from '../util/firebase';

const SignupForm = () => {

    const [formData, setFormData] = useState({
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        mobilenumber: '',

    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.confirmEmail) newErrors.confirmEmail = 'Confirm Email is required';
        if (formData.email !== formData.confirmEmail) newErrors.confirmEmail = 'Emails do not match';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword)
            newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.mobilenumber) newErrors.mobilenumber = 'Mobile number is required';
        else if (!/^\d{10}$/.test(formData.mobilenumber))
            newErrors.mobilenumber = 'Mobile number must be 10 digits';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
        } else {
            setErrors({});
            setLoading(true);
            try {

                // Create user using Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    formData.email,
                    formData.password,
                    formData.mobilenumber
                );
                console.log('User created1:', userCredential.user);

                await addDoc(collection(db, 'users'), {
                    email: formData.email,
                    password: formData.password,
                    mobilenumber: formData.mobilenumber,
                    uid: userCredential.user.uid

                });

                console.log('Form submitted successfully:', formData);
                setFormData({
                    email: '',
                    confirmEmail: '',
                    password: '',
                    confirmPassword: '',
                    mobilenumber: '',
                });
                alert('Signup successful!');
            } catch (error) {
                console.error('Error adding user: ', error);
                alert('An error occurred. Please try again.');
            }
            setLoading(false);

        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <h2 className="text-center">Welcome to Trudose User Signup</h2>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmEmail">
                            <Form.Label>Confirm Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Confirm email"
                                name="confirmEmail"
                                value={formData.confirmEmail}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmEmail}
                            />
                            <Form.Control.Feedback type="invalid">{errors.confirmEmail}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Confirm password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="mobilenumber">
                            <Form.Label>Mobile Number</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter mobile number"
                                name="mobilenumber"
                                value={formData.mobilenumber}
                                onChange={handleChange}
                                isInvalid={!!errors.mobilenumber}
                            />
                            <Form.Control.Feedback type="invalid">{errors.mobilenumber}</Form.Control.Feedback>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                            {loading ? 'Signing Up...' : 'Signup'}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignupForm;
