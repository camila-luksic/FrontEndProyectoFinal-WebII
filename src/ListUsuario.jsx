import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import { useAuth } from "../src/hooks/useAuth";

const ListaUsuarios = () => {
    const user = useAuth();
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const [Listausuarios, setListausuarios] = useState([]);

    useEffect(() => {
        if (!user) {
            return;
        }
        if (user.rol !== "Administrador") {
            setErrorText("Acceso denegado. Solo los administradores pueden ver esta página.");
            setTimeout(() => navigate("/"), 3000);
        } else {
            getListausuarios();
        }
    }, [user, navigate]);

    const getListausuarios = () => {
        axios.get('http://localhost:3025/usuarios/')
            .then(res => {
                setListausuarios(res.data);
            }).catch(error => {
                console.log(error);
            });
    }

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3025/usuarios/${id}`)
            .then(res => {
                console.log(res.data);
                getListausuarios();
            }).catch(error => {
                console.log(error);
            });
    }

    if (errorText) {
        return (
            <Container className="mt-3">
                <Alert variant="danger">{errorText}</Alert>
            </Container>
        );
    }

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col md={18}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de usuarios</h2>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Email</th>
                                            <th></th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Listausuarios.map(usuario =>
                                            <tr key={usuario.id}>
                                                <td>{usuario.id}</td>
                                                <td>{usuario.email}</td>
                                                <td><Link className="btn btn-primary" to={"/usuario/" + usuario.id}>Editar</Link></td>
                                                <td><Button variant="danger" onClick={() => { eliminar(usuario.id) }}>Eliminar</Button></td>
                                                <td><Link className="btn btn-warning" to={"/cambiar-contrasena/" + usuario.id}>Cambiar contraseña</Link></td> {/* Botón para cambiar contraseña */}
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default ListaUsuarios;
