import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rol, setRol] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (id) {
            getUsuarioById();
        }
    }, [id]);

    const getUsuarioById = () => {
        axios.get(`http://localhost:3025/usuarios/${id}`, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => {
                const usuario = res.data;
                setEmail(usuario.email);
                setRol(usuario.rol);
            })
            .catch((error) => {
                console.error(error);
                setErrorText("Error al cargar el usuario.");
            });
    };

    const onChangeEmail = (e) => setEmail(e.target.value);
    const onChangePassword = (e) => setPassword(e.target.value);
    const onChangeRol = (e) => setRol(e.target.value);

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            setValidated(true);
            return;
        }

        const usuario = { email, rol };
        if (!id) {
            usuario.password = password;
            insertUsuario(usuario);
        } else {
            editUsuario(usuario);
        }
    };

    const insertUsuario = (usuario) => {
        axios.post('http://localhost:3025/usuarios', usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })
            .then(() => {
                return axios.post('http://localhost:3025/auth/login', {
                    email: usuario.email,
                    password: usuario.password,
                });
            })
            .then((res) => {
                localStorage.setItem("token", res.data.token);
                navigate('/usuarios');
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.msg || "Error al crear el usuario o iniciar sesión.";
                setErrorText(errorMsg);
                console.error(error);
            });
    };

    const editUsuario = (usuario) => {
        axios.put(`http://localhost:3025/usuarios/${id}`, usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
        })
            .then(() => {
                navigate('/usuarios');
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.msg || "Error al editar el usuario.";
                setErrorText(errorMsg);
                console.error(error);
            });
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? "Editar Usuario" : "Registrar Usuario"}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                {errorText && <Alert variant="danger">{errorText}</Alert>}

                                <Form.Group>
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control
                                        required
                                        type="email"
                                        value={email}
                                        onChange={onChangeEmail}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingrese un correo válido.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {!id && (
                                    <Form.Group>
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control
                                            required
                                            type="password"
                                            value={password}
                                            onChange={onChangePassword}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese una contraseña.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                )}

                                <Form.Group className="mt-3">
                                    <Form.Label>Rol:</Form.Label>
                                    <Form.Select required value={rol} onChange={onChangeRol}>
                                        <option value="">Seleccione un rol</option>
                                        <option value="Administrador">Administrador</option>
                                        <option value="Verificador">Verificador</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un rol.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3">
                                    <Button type="submit">{id ? "Guardar Cambios" : "Registrar"}</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormUsuario;
