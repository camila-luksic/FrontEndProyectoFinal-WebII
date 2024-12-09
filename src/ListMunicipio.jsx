import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavMenu from "./components/NavMenu";
import { useAuth } from "../src/hooks/useAuth";
const ListaMunicipios = () => {
    useAuth();
    const [Listamunicipios, setListamunicipios] = useState([]);
    useEffect(() => {
        getListamunicipios();
        document.title = "ABC";
    }, []) 

    const getListamunicipios = () => {
        axios.get('http://localhost:3025/municipios/')
            .then(res => {
                setListamunicipios(res.data);
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
        axios.delete(`http://localhost:3025/municipios/${id}`)
            .then(res => {
                console.log(res.data);
                getListamunicipios();
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
                                    <h2>Lista de municipios</h2>
                                </Card.Title>
                                <Table >
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nombre</th>
                                            <th>Creado por</th>
                                            <th>Editado por</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Listamunicipios.map(municipio =>
                                            <tr key={municipio.id}>
                                                <td>{municipio.id}</td>
                                                <td>{municipio.nombre}</td>
                                                <td>
                                                    {municipio.creador 
                                                        ? municipio.creador.email 
                                                        : "Desconocido"}
                                                </td>
                                                <td>
                                                    {municipio.editor
                                                        ? municipio.editor.email 
                                                        : "Desconocido"}
                                                </td>
                                                <td><Link className="btn btn-primary" to={"/municipio/" + municipio.id}>Editar</Link></td>
                                                <td><Button variant="danger" onClick={() => { eliminar(municipio.id) }}>Eliminar</Button></td>
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

export default ListaMunicipios;