import React from 'react'
import '../assets/styles/nav.css';
import '../assets/styles/style.css';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';

export default function AdminNavbar(){
    const logo = require('../assets/images/logosh.png')

    return <Navbar bg="darkBlue" variant="dark" sticky='top' expand="md" collapseOnSelect> 
        <Navbar.Brand ><img src={logo}  className="brand" alt="logo" /> Eventer </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="ps-2">
            <Nav className="ms-auto">
                <Nav.Link href="/explore">Explore</Nav.Link>
                <Nav.Link href="/admin/pending-events">Pending events</Nav.Link>
                <Nav.Link href="/profile/settings">Settings</Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}