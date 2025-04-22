import { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { GoogleMap, LoadScript, MarkerF } from "@react-google-maps/api";
import NavMenu from "./components/NavMenu";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -17.753888888889,
  lng: -62.996944444444,
};

const tipoBloqueoMap = {
  0: "Libre",
  1: "Transitable con desvíos y/o horarios de circulación",
  2: "No transitable por conflictos sociales",
  3: "Restricción vehicular",
  4: "No transitable tráfico cerrado",
  5: "Restricción vehicular especial",
};

const bloqueoColors = {
  0: "#00FF00", // Verde - Libre
  1: "#FFFF00", // Amarillo - Desvíos
  2: "#FF0000", // Rojo - Conflictos sociales
  3: "#FFA500", // Naranja - Restricción vehicular
  4: "#8B0000", // Granate - Tráfico cerrado
  5: "#800080", // Morado - Restricción especial
};

const App = () => {
  const [municipios, setMunicipios] = useState([]);
  const [carreteras, setCarreteras] = useState([]);
  const [searchedMunicipio, setSearchedMunicipio] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const mapRef = useRef();
  const polylinesRef = useRef([]);
  const [activeCarretera, setActiveCarretera] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3025/municipios")
      .then((res) => {
        console.log("Municipios:", res.data);
        setMunicipios(res.data);
      })
      .catch((err) => console.error("Error al obtener municipios:", err));

    axios
      .get("http://localhost:3025/carreteras")
      .then((res) => {
        console.log("Carreteras:", res.data);
        setCarreteras(res.data);
      })
      .catch((err) => console.error("Error al obtener carreteras:", err));
  }, []);


  const handleMarkerClick = (municipio, map) => {
    const infoWindow = new window.google.maps.InfoWindow({
      content: `<h5>${municipio.nombre}</h5>`,
    });
    infoWindow.setPosition({
      lat: parseFloat(municipio.latitud),
      lng: parseFloat(municipio.longitud),
    });
    infoWindow.open(map);
  };
  const handleSearchResultClick = (municipio) => {
    setSearchedMunicipio(municipio);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: parseFloat(municipio.latitud),
        lng: parseFloat(municipio.longitud),
      });
    }
  };

  const handleShowImage = (id) => {
    const imageUrl = `http://localhost:3025/public/imagenes/carreterasBloqueadas/${id}.jpg`;
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };
 
  const groupBlockedByType = (carreteras) => {
    const grouped = new Map();
    carreteras.forEach((carretera) => {
      const { idTipoBloqueo } = carretera;
      if (!grouped.has(idTipoBloqueo)) {
        grouped.set(idTipoBloqueo, []);
      }
      grouped.get(idTipoBloqueo).push(carretera);
    });
    return grouped;
  };

  const libres = carreteras.filter((carretera) => carretera.estado === 0);
  const bloqueadas = carreteras.filter((carretera) => carretera.estado === 1);
  const bloqueadasPorTipo = groupBlockedByType(bloqueadas);

 const drawCarreteras = () => {
    const map = mapRef.current;
    if (!map || !window.google) return;
    polylinesRef.current.forEach((polyline) => polyline.setMap(null));
    polylinesRef.current = [];

    const carreterasToDraw = activeCarretera
      ? carreteras.filter((c) => c.id === activeCarretera)
      : carreteras;

    carreterasToDraw.forEach((carretera) => {
      const path = carretera.puntos.map((p) => ({
        lat: parseFloat(p.latitud),
        lng: parseFloat(p.longitud),
      }));

      const polyline = new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: bloqueoColors[carretera.idTipoBloqueo] || "#000000",
        strokeOpacity: 1.0,
        strokeWeight: carretera.id === activeCarretera ? 5 : 3,
        map,
      });

      polylinesRef.current.push(polyline);
    });
  };

  useEffect(() => {
    if (mapRef.current) {
      drawCarreteras();
    }
  }, [carreteras, activeCarretera]);

  const handleVerCarretera = (carretera) => {
    setActiveCarretera(carretera.id);
    const map = mapRef.current;
    if (carretera.puntos && carretera.puntos.length > 0) {
      const path = carretera.puntos.map((punto) => ({
        lat: parseFloat(punto.latitud),
        lng: parseFloat(punto.longitud),
      }));
      map.current.panTo(path[0]);
    }
  }
  return (

    <>
      <NavMenu onSearch={(municipio) => handleSearchResultClick(municipio)} />
      <Container>
        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h3>Municipios en el Mapa</h3>
                </Card.Title>
                <LoadScript googleMapsApiKey="----">
                  <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={10}
                    onLoad={(map) => (mapRef.current = map)}
                  >
                    {municipios.length > 0 ? (
                      municipios.map((municipio, index) => {
                        const lat = parseFloat(municipio.latitud);
                        const lng = parseFloat(municipio.longitud);
                        const isSearched = searchedMunicipio?.id === municipio.id;

                        return (
                          <MarkerF
                            key={index}
                            position={{ lat, lng }}
                            icon={{
                              url: isSearched
                                ? "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                : "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            }}
                            onClick={() => handleMarkerClick(municipio, mapRef.current)}
                          />
                        );
                      })
                    ) : (
                      <p>Cargando municipios...</p>
                    )}
                  </GoogleMap>
                </LoadScript>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h3>Carreteras Libres</h3>
                </Card.Title>
                {libres.length > 0 ? (
                  libres.map((carretera, index) => (
                    <div key={index}>
                      <h5>{carretera.nombre}</h5>
                      <p>
                        Origen:{" "}
                        {municipios.find((m) => m.id === carretera.municipioOrigenId)?.nombre || "Desconocido"}
                      </p>
                      <p>
                        Destino:{" "}
                        {municipios.find((m) => m.id === carretera.municipioDestinoId)?.nombre || "Desconocido"}
                      </p>
                        <Button onClick={() => handleVerCarretera(carretera)}>Ver Carretera</Button>
                        <hr />
                      </div>
                        ))
                      ) : (
                        <p>No hay carreteras libres.</p>
                      )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={12}>
            <Card>
              <Card.Body>
                <Card.Title>
                  <h3>Carreteras Bloqueadas</h3>
                </Card.Title>
                {Array.from(bloqueadasPorTipo.entries()).map(([tipo, carreteras]) => (
                  <div key={tipo}>
                    <h4>Tipo de Bloqueo: {tipoBloqueoMap[tipo] || "Desconocido"}</h4>
                    {carreteras.map((carretera, index) => (
                      <div key={index}>
                        <h5>{carretera.nombre}</h5>
                        <p>
                          Origen:{" "}
                          {municipios.find((m) => m.id === carretera.municipioOrigenId)?.nombre || "Desconocido"}
                        </p>
                        <p>
                          Destino:{" "}
                          {municipios.find((m) => m.id === carretera.municipioDestinoId)?.nombre || "Desconocido"}
                        </p>
                        <Button onClick={() => handleShowImage(carretera.id)}>Ver Motivo</Button>
                        <Button onClick={() => handleVerCarretera(carretera)}>Ver Carretera</Button>
                        <hr />
                      </div>
                    ))}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Motivo del Bloqueo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Motivo del Bloqueo"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );}

export default App;
