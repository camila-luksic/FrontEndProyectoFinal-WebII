import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import { useAuth } from "../src/hooks/useAuth";
const ListaPuntos = () => {
    useAuth();
    const [Listapuntos, setListapuntos] = useState([]);
    useEffect(() => {
        getListapuntos();
        document.title = "ABC";
    }, []) 

    const getListapuntos = () => {
        axios.get('http://localhost:3025/puntos/')
            .then(res => {
                setListapuntos(res.data);
                // console.log(res.data);
            }).catch(error => {
                console.log(error);
            });
    }
    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3025/puntos/${id}`)
            .then(res => {
                console.log(res.data);
                getListapuntos();
            }).catch(error => {
                console.log(error);
            });
    }

    return (
        <>
        <NavMenu/>
            <Container className="mt-3 mb-3">
            <Row >
                <Col md={18}>
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    <h2>Lista de puntos</h2>
                                </Card.Title>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Latitud</th>
                                            <th>Longitud</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Listapuntos.map(punto =>
                                            <tr key={punto.id}>
                                                <td>{punto.id}</td>
                                                <td>{punto.latitud}</td>
                                                <td>{punto.longitud}</td>
                                                <td><Link className="btn btn-primary" to={"/punto/" + punto.id}>Editar</Link></td>
                                                <td><Button variant="danger" onClick={() => { eliminar(punto.id) }}>Eliminar</Button></td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        </>
    );
}

export default ListaPuntos;