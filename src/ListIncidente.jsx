import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import NavMenu from "./components/NavMenu";
import { useAuth } from "../src/hooks/useAuth";
const ListaIncidentes = () => {
    useAuth();
    const [Listaincidentes, setListaincidentes] = useState([]);

    useEffect(() => {
        getListaincidentes();
        document.title = "ABC";
    }, []);

    const getListaincidentes = () => {
        axios.get('http://localhost:3025/solicitudIncidente/')
            .then(res => {
                setListaincidentes(res.data);
            }).catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3025/solicitudIncidente/${id}`)
            .then(res => {
                console.log(res.data);
                getListaincidentes();
            }).catch(error => {
                console.log(error);
            });
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
                                    <h2>Lista de incidentes</h2>
                                </Card.Title>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Foto</th>
                                            <th>Detalle</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
    {Listaincidentes.map(incidente => {
        console.log("Imagen del incidente:", incidente.imagen);

        return (
            <tr key={incidente.id}>
                <td>{incidente.id}</td>
                <td>
                        <img
                            src={`http://localhost:3025/public/imagenes/solicitudIncidente/${incidente.id}.jpg`}
                            alt="Incidente"
                            style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        />
                </td>
                <td>{incidente.detalle}</td>
                <td>
                    <Button variant="danger" onClick={() => eliminar(incidente.id)}>
                        Eliminar
                    </Button>
                </td>
            </tr>
        );
    })}
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

export default ListaIncidentes;
