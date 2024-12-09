import axios from "axios";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FotoIncidente = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const [FotoIncidente, setFotoIncidente] = useState(null);
    const [validated] = useState(false);

    const handleMapClick = (e) => {
        setLatitud(e.latlng.lat);
        setLongitud(e.latlng.lng);
    };

    const onChangeFoto = (e) => {
        setFotoIncidente(e.target.files[0]);
    };

    const onGuardarClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!latitud || !longitud) {
            alert("Por favor, seleccione una ubicación en el mapa.");
            return;
        }

        try {
            const incidenteData = {
                latitud,
                longitud,
                carreteraIncidenteId: id,
            };
            const incidenteResponse = await axios.post(
                "http://localhost:3025/incidentes",
                incidenteData
            );

            console.log("Incidente creado:", incidenteResponse.data);
            if (FotoIncidente) {
                const formData = new FormData();
                formData.append("imagen", FotoIncidente);

                const imagenResponse = await axios.post(
                    `http://localhost:3025/incidentes/${id}/imagen`,
                    formData
                );
                console.log("Imagen subida:", imagenResponse.data);
            }

            navigate(`/carretera/${id}`);
        } catch (error) {
            console.error(error);
        }
    };

    const MapClickHandler = () => {
        useMapEvents({
            click: handleMapClick,
        });
        return latitud && longitud ? (
            <Marker position={[latitud, longitud]}></Marker>
        ) : null;
    };

    return (
        <Container>
            <Row className="mt-3">
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>Crear incidente</h2>
                            </Card.Title>
                            <p>Seleccione la ubicación del incidente haciendo clic en el mapa:</p>
                            <MapContainer
                                 center={[-17.753888888889, -62.996944444444]} 
                                 zoom={10} 
                                 style={{ height: "400px", width: "100%" }}
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <MapClickHandler />
                            </MapContainer>
                            <p>
                                {latitud && longitud
                                    ? `Ubicación seleccionada: (${latitud}, ${longitud})`
                                    : "No se ha seleccionado una ubicación."}
                            </p>
                            <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                                <Form.Group>
                                    <Form.Label>Seleccione una imagen:</Form.Label>
                                    <Form.Control required type="file" onChange={onChangeFoto} />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un archivo.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mt-3">
                                    <Button type="submit">Guardar incidente</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FotoIncidente;
