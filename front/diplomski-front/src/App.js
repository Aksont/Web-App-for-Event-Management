// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import {Container, Navbar} from 'react-bootstrap'
import { RegistrationForm } from './components/forms/RegistrationForm';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './assets/styles/style.css';
// import RequestsList from './components/business/RequestsList';
// import RequestPreview from './components/business/RequestPreview';
// import CertificatesList from './components/business/CertificatesList';
// import CertificatePreview from './components/business/CertificatePreview';
import GuestNavbar from './layouts/GuestNavbar';
import PhysicalNavbar from './layouts/PhysicalNavbar';
import { LoginForm } from './components/forms/LoginForm';
// import AdminFirstPage from './components/business/AdminFirstPage';
// import ClientFirstPage from './components/business/ClientFirstPage';
import LogoutPage from './layouts/LogoutPage';
import UnavailablePage from './components/business/UnavailablePage';
import { useEffect, useState } from 'react';
import BusinessNavbar from './layouts/BusinessNavbar';
// import UserObjectsList from './components/business/UserObjectsList';
// import AllObjectsList from './components/business/AllObjectsList';
// import { CreateObjectForm } from './components/forms/CreateObjectForm';
import { getRole } from './services/utils/AuthService';
import AdminNavbar from './layouts/AdminNavbar';
import UnderConstructionPage from './components/business/UnderConstructionPage';
import { CreateEventForm } from './components/forms/CreateEventForm';

function App() {
  const registrationForm = <Container><RegistrationForm /></Container>
  const loginForm = <Container><LoginForm /></Container>
  const logoutPage = <Container><LogoutPage /></Container>

  const unavailablePage = <Container><UnavailablePage /></Container>
  const underConstructionPage = <Container><UnderConstructionPage /></Container>

  // const requestsList = <Container><RequestsList /></Container>
  // const requestPreview = <Container><RequestPreview /></Container>
  // const certificatesList = <Container><CertificatesList /></Container>
  // const certificatePreview = <Container><CertificatePreview /></Container>
  // const adminFirstPage = <Container><AdminFirstPage /></Container>
  // const clientFirstPage = <Container><ClientFirstPage /></Container>
  const createEventForm = <Container><CreateEventForm /></Container>
  // const userObjectsList = <Container><UserObjectsList /></Container>
  // const allObjectsList = <Container><AllObjectsList /></Container>
  // const createObjectForm = <Container><CreateObjectForm /></Container>'

  const [navBar, setNavBar] = useState(getNavbarByUserRole());

  window.addEventListener('userRoleUpdated', () => {
    setNavBar(getNavbarByUserRole())
  })

  function getNavbarByUserRole(){
    let userRole = getRole();

    if(userRole === "PHYSICAL"){
      return <PhysicalNavbar />;
    } else if(userRole === "BUSINESS"){
      return <BusinessNavbar />;
    } else if(userRole === "ADMIN"){
      return <AdminNavbar />;
    } else{
      return <GuestNavbar />;
    }
  }

  return  (<Router>
              {navBar}
              <Routes>
                <Route path="" >
                  <Route path="/register" element={registrationForm} />
                  <Route path="/login" element={loginForm} />
                  <Route path="/logout" element={logoutPage} />

                  <Route path="/explore" element={underConstructionPage} />

                  <Route path="/business/organize" element={createEventForm} />
                  <Route path="/business/my-events" element={underConstructionPage} />
                  <Route path="/business/settings" element={underConstructionPage} />

                  <Route path="/client/tickets" element={underConstructionPage} />

                  <Route path="/admin/events-to-approve" element={underConstructionPage} />
                  <Route path="/admin/reviews-to-approve" element={underConstructionPage} /> 

                  <Route path="*" element={unavailablePage} />
                </Route>
              </Routes>
          </Router>);
}

export default App;
