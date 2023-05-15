import React from 'react'
import '../assets/styles/nav.css';
import '../assets/styles/style.css';
import {Nav, Navbar, NavDropdown} from 'react-bootstrap';

export default function BusinessNavbar(){
    const logo = require('../assets/images/logosh.png')

    return <Navbar bg="darkBlue" variant="dark" sticky='top' expand="md" collapseOnSelect> 
        <Navbar.Brand ><img src={logo}  className="brand" alt="logo" /> Eventer </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="ps-2">
            <Nav className="ms-auto">
                <Nav.Link href="/events">Explore</Nav.Link>
                <Nav.Link href="/organize">Organize</Nav.Link>
                <Nav.Link href="/my-events">My events</Nav.Link>
                {/* <Nav.Link href="/profile">Profile</Nav.Link> maybe make it possible to see the profile but different origin */}
                <Nav.Link href="/settings">Settings</Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
}