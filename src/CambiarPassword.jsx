import axios from "axios";
import { useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "./components/NavMenu";

const CambiarContrasena = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const [successText, setSuccessText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3025/usuarios/${id}/cambiar-contrasena`, { oldPassword, newPassword })
            .then(res => {
                setSuccessText(res.data.msg);
                setTimeout(() => navigate("/usuarios"), 3000);
            })
            .catch(err => {
                setErrorText(err.response?.data?.msg || "Error al cambiar la contraseña");
            });
    }

    return (
        <>
            <NavMenu />
            <Container className="mt-3">
                <h2>Cambiar Contraseña</h2>
                {errorText && <Alert variant="danger">{errorText}</Alert>}
                {successText && <Alert variant="success">{successText}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="oldPassword">
                        <Form.Label>Contraseña antigua</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa la contraseña antigua"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="newPassword" className="mt-2">
                        <Form.Label>Contraseña nueva</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Ingresa la nueva contraseña"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-3">
                        Cambiar Contraseña
                    </Button>
                </Form>
            </Container>
        </>
    );
}

export default CambiarContrasena;
