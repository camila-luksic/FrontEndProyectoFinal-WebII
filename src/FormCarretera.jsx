import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Card, Col, Container, Form, Row, Alert } from "react-bootstrap";
import { useNavigate, useParams,useSearchParams } from "react-router-dom";
import { useAuth } from "../src/hooks/useAuth";

const FormCarretera = () => {
    useAuth();
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [estado, setEstado] = useState('0');
    const [idTipoBloqueo, setIdTipoBloqueo] = useState('');
    const [municipioOrigen, setMunicipioOrigen] = useState('');
    const [municipioDestino, setMunicipioDestino] = useState('');
    const [municipios, setMunicipios] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userId");


    useEffect(() => {
        if (id) {
            getCarreteraById();
        }
    }, [id]);

    const getCarreteraById = () => {
        axios.get(`http://localhost:3025/carreteras/${id}`)
            .then(res => {
                const carretera = res.data;
                setNombre(carretera.nombre);
                setEstado(carretera.estado);
                setIdTipoBloqueo(carretera.idTipoBloqueo);
                setMunicipioOrigen(carretera.municipioOrigen);
                setMunicipioDestino(carretera.municipioDestino);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        axios.get('http://localhost:3025/municipios')
            .then(res => {
                setMunicipios(res.data);
            })
            .catch(error => {
                console.error("Hubo un error al cargar los municipios", error);
                setErrorText("Error al cargar los municipios.");
            });
    }, []);

    const handleNombreChange = (e) => setNombre(e.target.value);

    const handleEstadoChange = (e) => {
        const selectedEstado = e.target.value;
        setEstado(selectedEstado);
        if (selectedEstado === '0') {
            setIdTipoBloqueo('0');
        }
    };

    const handleIdTipoBloqueoChange = (e) => setIdTipoBloqueo(e.target.value);

    const handleMunicipioOrigenChange = (e) => setMunicipioOrigen(e.target.value);

    const handleMunicipioDestinoChange = (e) => setMunicipioDestino(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (e.currentTarget.checkValidity() === false) {
            return;
        }

        setErrorText('');

        const carretera = {
            nombre,
            estado,
            idTipoBloqueo,
            municipioOrigen,
            municipioDestino,
            userId
        };

        if (id) {
            axios.put(`http://localhost:3025/carreteras/${id}`, carretera)
                .then(res => {
                    console.log(res.data);
                    navigate('/');
                })
                .catch(error => {
                    console.error(error);
                    setErrorText('Error al actualizar la carretera');
                });
        } else {
            axios.post('http://localhost:3025/carreteras', carretera)
                .then(res => {
                    console.log(res.data);
                    navigate('/');
                })
                .catch(error => {
                    console.error(error);
                    setErrorText('Error al crear la carretera');
                });
        }
    };

    return (
        <Container>
            <Row className="mt-3 mb-3">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>
                                <h2>{id ? 'Editar Carretera' : 'Nueva Carretera'}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                {errorText && <Alert variant="danger">{errorText}</Alert>}

                                <Form.Group controlId="formNombre">
                                    <Form.Label>Nombre:</Form.Label>
                                    <Form.Control 
                                        required 
                                        type="text" 
                                        placeholder="Ingrese el nombre de la carretera"
                                        value={nombre} 
                                        onChange={handleNombreChange} 
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingrese un nombre válido.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3" controlId="formEstado">
                                    <Form.Label>Estado:</Form.Label>
                                    <Form.Select
                                        required
                                        value={estado}
                                        onChange={handleEstadoChange}
                                    >
                                        <option value="">Seleccione un estado</option>
                                        <option value="0">Libre</option>
                                        <option value="1">Bloqueada</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un estado.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3" controlId="formTipoBloqueo">
                                    <Form.Label>Tipo de Bloqueo:</Form.Label>
                                    <Form.Select
                                        required={estado === '1'}
                                        value={idTipoBloqueo}
                                        onChange={handleIdTipoBloqueoChange}
                                    >
                                        <option value="">Seleccione un tipo de bloqueo</option>
                                        <option value="0">Libre</option>
                                        <option value="1">Transitable con desvíos y/o horarios de circulación</option>
                                        <option value="2">No transitable por conflictos sociales</option>
                                        <option value="3">Restricción vehicular</option>
                                        <option value="4">No transitable tráfico cerrado</option>
                                        <option value="5">Restricción vehicular especial</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un tipo de bloqueo.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3" controlId="formMunicipioOrigen">
                                    <Form.Label>Municipio de Origen:</Form.Label>
                                    <Form.Select
                                        required
                                        value={municipioOrigen}
                                        onChange={handleMunicipioOrigenChange}
                                    >
                                        <option value="">Seleccione un municipio de origen</option>
                                        {municipios.map(municipio => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un municipio de origen.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="mt-3" controlId="formMunicipioDestino">
                                    <Form.Label>Municipio de Destino:</Form.Label>
                                    <Form.Select
                                        required
                                        value={municipioDestino}
                                        onChange={handleMunicipioDestinoChange}
                                    >
                                        <option value="">Seleccione un municipio de destino</option>
                                        {municipios.map(municipio => (
                                            <option key={municipio.id} value={municipio.id}>
                                                {municipio.nombre}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        Por favor seleccione un municipio de destino.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button className="mt-3" type="submit">
                                    {id ? 'Actualizar Carretera' : 'Crear Carretera'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default FormCarretera;
