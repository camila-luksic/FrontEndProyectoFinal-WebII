import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";

const FormPunto = () => {
    useAuth();
    const navigate = useNavigate();
    const [puntos, setPuntos] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [selectedCarretera, setSelectedCarretera] = useState("");
    useEffect(() => {
        axios
            .get("http://localhost:3025/carreteras")
            .then((res) => {
                setCarreteras(res.data);
            })
            .catch((err) => {
                console.error("Error al obtener las carreteras:", err);
                alert("No se pudieron cargar las carreteras.");
            });
    }, []);

    const agregarPunto = (lat, lng) => {
        const nuevoPunto = { latitud: lat, longitud: lng };
        setPuntos((prevPuntos) => [...prevPuntos, nuevoPunto]);
    };

    const onGuardarLugares = (e) => {
        e.preventDefault();

        if (!puntos.length || !selectedCarretera) {
            alert("Por favor selecciona al menos un punto y una carretera.");
            return;
        }

        axios
            .post("http://localhost:3025/puntos",{ puntos: puntos })
            .then((res) => {
                console.log("Respuesta del servidor:", res.data);
                if (res.data && Array.isArray(res.data.puntos)) {
                    const puntosIds = res.data.puntos.map((punto) => punto.id);
                    console.log("IDs de puntos creados:", puntosIds);
                    alert("Puntos guardados exitosamente.");

                    return axios.post(
                        `http://localhost:3025/carreteras/${selectedCarretera}/punto`,
                        { puntosIds }
                    );
                } else {
                    console.error("Respuesta inesperada del servidor", res.data);
                    alert("Hubo un error con la respuesta del servidor.");
                }
            })
            .then(() => {
                alert("Puntos asignados a la carretera exitosamente.");
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                alert("Hubo un error al guardar los puntos o asignarlos a la carretera.");
            });
    };

    const Marcador = () => {
        useMapEvents({
            click(e) {
                agregarPunto(e.latlng.lat, e.latlng.lng);
            },
        });

        return puntos.map((punto, index) => (
            <Marker key={index} position={[punto.latitud, punto.longitud]}></Marker>
        ));
    };

    return (
        <Container>
            <Row className="mt-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h3>Registrar Puntos</h3>
                            </Card.Title>
                            <Form onSubmit={onGuardarLugares}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Puntos Seleccionados</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={puntos
                                            .map((p) => `(${p.latitud}, ${p.longitud})`)
                                            .join(", ")}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Seleccionar Carretera</Form.Label>
                                    <Form.Select
                                        value={selectedCarretera}
                                        onChange={(e) => setSelectedCarretera(e.target.value)}
                                    >
                                        <option value="">Selecciona una carretera</option>
                                        {carreteras.map((carretera) => (
                                            <option key={carretera.id} value={carretera.id}>
                                                {carretera.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                                <Button type="submit">Guardar Puntos</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <MapContainer
                        center={[-17.753888888889, -62.996944444444]}
                        zoom={10}
                        style={{ height: "400px", width: "100%" }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution="&copy; OpenStreetMap contributors"
                        />
                        <Marcador />
                    </MapContainer>
                </Col>
            </Row>
        </Container>
    );
};

export default FormPunto;
