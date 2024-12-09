import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Form, FormControl, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
const NavMenu = ({ onSearch }) => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (token) {
            getUserInfo();
        }
    }, []);

    const getUserInfo = () => {
        axios.get('http://localhost:3025/auth/me', {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => {
            setUser(res.data);
        }).catch(error => {
            console.error(error);
        });
    };

    const onCerrarSesionClick = () => {
        axios.post('http://localhost:3025/auth/logout', {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(() => {
            localStorage.removeItem('token');
            navigate('/');
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim() !== "") {
            axios.get(`http://localhost:3025/municipios/buscar?q=${searchTerm}`)
                .then(res => {
                    if (res.data.length > 0) {
                        onSearch(res.data[0]); 
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        }
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">ABC</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token &&
                            <>
                                <NavDropdown title="Municipios" id="municipios-dropdown">
                                    <Link className="dropdown-item" to={`/municipios?userId=${user?.id}`}>Lista de Municipios</Link>
                                    <Link className="dropdown-item"  to={`/municipio/create?userId=${user?.id}`}state={{ userId: user?.id }}>
                                        Crear Municipio
                                    </Link>
                                </NavDropdown>
                                <NavDropdown title="Carreteras" id="carreteras-dropdown">
                                    <Link className="dropdown-item" to={"/carreteras"}>Lista de Carreteras</Link>
                                    <Link className="dropdown-item" to={`/carretera/create?userId=${user?.id}`}state={{ userId: user?.id }}>
                                        Crear Carretera
                                    </Link>
                                </NavDropdown>
                                <NavDropdown title="Puntos" id="dropdown-puntos">
                                    <Link className="dropdown-item" to={"/puntos"}>Ver Puntos </Link>
                                    <Link className="dropdown-item" to={`/punto/create?userId=${user?.id}`}state={{ userId: user?.id }}>Crear Punto</Link>
                                </NavDropdown>
                                <NavDropdown title="Usuarios" id="usuarios-dropdown">
                                    <Link className="dropdown-item" to={"/usuarios"}>Lista de Usuarios</Link>
                                    <Link className="dropdown-item" to="/usuario/create">
                                        Crear Usuario
                                    </Link>
                                </NavDropdown>
                                <NavDropdown title=" Solicitud Incidentes" id="incidentes-dropdown">
                                    <Link className="dropdown-item" to={"/incidentes"}>Lista de Incidentes</Link>
                                    <Link className="dropdown-item" to="/foto">
                                        Crear Incidente
                                    </Link>
                                </NavDropdown>
                                {user &&
                                    <NavDropdown title={user.email} id="login-dropdown">
                                        <button className="dropdown-item" onClick={onCerrarSesionClick}>Cerrar sesión</button>
                                    </NavDropdown>}
                            </>
                        }
                        {!token &&
                            <>
                                <Link className="nav-link" to="/login">Iniciar sesión</Link>
                                <Link className="nav-link" to="/usuario/create">Registro</Link>
                                <Link className="nav-link" to="/foto">Reportar Incidente</Link>
                            </>
                        }
                    </Nav>
                    <Form className="d-flex" onSubmit={handleSearchSubmit}>
                        <FormControl
                            type="search"
                            placeholder="Buscar Municipios..."
                            className="me-2"
                            aria-label="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button variant="outline-light" type="submit">Buscar</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

NavMenu.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
export default NavMenu;
