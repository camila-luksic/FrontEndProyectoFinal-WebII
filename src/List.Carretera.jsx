import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import { useAuth } from "../src/hooks/useAuth";
const ListaCarreteras = () => {
    useAuth();
    const [Listacarreteras, setListacarreteras] = useState([]);

    useEffect(() => {
        getListacarreteras();
        document.title = "ABC";
    }, []);

    const getListacarreteras = () => {
        axios.get('http://localhost:3025/carreteras/')
            .then(res => {
                setListacarreteras(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3025/carreteras/${id}`)
            .then(res => {
                console.log(res.data);
                getListacarreteras();
            }).catch(error => {
                console.log(error);
            });
    };

    const getEstado = (estado) => {
        return estado === 0 ? "Libre" : "Bloqueado";
    };

    const getidTipoBloqueo = (idtipoBloqueo) => {
        switch (idtipoBloqueo) {
            case 0 : return "Sin bloqueo";
            case 1: return "Transitable con desvíos y/o horarios de circulación";
            case 2: return "No transitable por conflictos sociales";
            case 3: return "Restricción vehicular";
            case 4: return "No transitable tráfico cerrado";
            case 5:  return "Restricción vehicular, especial";
        }
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-3 mb-3">
                <Row>
                    <Col md={18}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de carreteras</h2>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Estado</th>
                                            <th>Tipo Bloqueo</th>
                                            <th>Creado por</th>
                                            <th>Editado por</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Listacarreteras.map(carretera => (
                                            <tr key={carretera.id}>
                                                <td>{carretera.id}</td>
                                                <td>{carretera.nombre}</td>
                                                <td>{getEstado(carretera.estado)}</td>
                                                <td>{getidTipoBloqueo(carretera.idTipoBloqueo)}</td>
                                                <td>
                                                    {carretera.creador 
                                                        ? carretera.creador.email 
                                                        : "Desconocido"}
                                                </td>
                                                <td>
                                                    {carretera.editor 
                                                        ? carretera.editor.email 
                                                        : "Desconocido"}
                                                </td>
                                                <td>
                                                    <Link className="btn btn-primary" to={`/carretera/${carretera.id}`}>
                                                        Editar
                                                    </Link>
                                                </td>
                                                <td>
                                                    <Button variant="danger" onClick={() => eliminar(carretera.id)}>
                                                        Eliminar
                                                    </Button>
                                                </td>
                                                <td>
                                                    <Link className="btn btn-primary" to={`/foto/${carretera.id}`}>
                                                        Agregar Incidente
                                                    </Link>
                                                </td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default ListaCarreteras;
