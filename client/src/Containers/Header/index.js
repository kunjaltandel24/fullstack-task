import React, { useState } from 'react';
import { Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import { Link, withRouter } from 'react-router-dom';

import {useDispatch, useSelector} from 'react-redux';
import './index.css';
import {logOutUser} from '../../Stores';

const Header = ({ history }) => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const [navExpanded, setNavExpanded] = useState(false);
    const closeNav = () => {
        setNavExpanded(false);
    };
    const logout = () => dispatch(logOutUser());
    return <Navbar
        bg="light"
        variant="light"
        fixed="top"
        expand="md"
        className="px-3"
        onToggle={setNavExpanded}
        expanded={navExpanded}
    >
        <Navbar.Brand as={Link} to="/">Car Inventory</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            <Nav onSelect={closeNav}>
                <Dropdown id="nav-dropdown">
                    <Dropdown.Toggle as={Nav.Link}>{user.username}</Dropdown.Toggle>
                    <Dropdown.Menu alignRight>
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    </Dropdown.Menu>
                </Dropdown>
                <Nav.Link as={Link} to="/">Inventory</Nav.Link>
                <Nav.Link as={Link} to="/sales">Sales</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}

export default withRouter(Header);
