import "leaflet/dist/leaflet.css";
import { useState ,useEffect} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Button, Container, Form, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate,useParams , useSearchParams} from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";
const FormMunicipio = () => {
    useAuth();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState("");
    const [latitud, setLatitud] = useState(null);
    const [longitud, setLongitud] = useState(null);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");


    useEffect(() => {
        if (id) {
            getMunicipioById();
        }
    }, [id]);

    const getMunicipioById = () => {
        axios.get(`http://localhost:3025/municipios/${id}`)
            .then(res => {
                const genero = res.data;
                setNombre(genero.nombre);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const onNombreChange = (e) => setNombre(e.target.value);

    const onGuardarLugar = (e) => {
        e.preventDefault();
        if (!nombre || !latitud || !longitud) {
            alert("Por favor completa todos los campos.");
            return;
        }

        const municipio = { nombre, latitud, longitud ,userId};
        if (id) {
            console.log("Municipio enviado al backend:", municipio);
            editMunicipio(municipio);
        } else {
            console.log("Municipio enviado al backend:", municipio);
            insertMunicipio(municipio);
        }
    };

    const editMunicipio = (municipio) => {
        axios.put(`http://localhost:3025/municipios/${id}`,municipio)
            .then(res => {
                console.log(res.data);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const insertMunicipio = (municipio) => {
        axios.post("http://localhost:3025/municipios", municipio)
            .then((res) => {
                console.log(res.data);
                alert("Municipio guardado exitosamente.");
                navigate('/');
            })
            .catch((err) => {
                console.error(err);
                alert("Hubo un error al guardar el municipio.");
            });
    };

    const Marcador = () => {
        useMapEvents({
            click(e) {
                setLatitud(e.latlng.lat);
                setLongitud(e.latlng.lng);
            },
        });

        return latitud && longitud ? (
            <Marker position={[latitud, longitud]}></Marker>
        ) : null;
    };

    return (
        <Container>
            <Row className="mt-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h3>Registrar Municipio</h3>
                            </Card.Title>
                            <Form onSubmit={onGuardarLugar}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Nombre del Municipio</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={nombre}
                                        onChange={onNombreChange}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Coordenadas</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={`Latitud: ${latitud || ""}, Longitud: ${longitud || ""}`}
                                        readOnly
                                    />
                                </Form.Group>
                                <Button type="submit">Guardar Lugar</Button>
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

export default FormMunicipio;
