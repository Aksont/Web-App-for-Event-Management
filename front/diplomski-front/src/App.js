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
import { getUserType } from './services/utils/AuthService';
import AdminNavbar from './layouts/AdminNavbar';
import UnderConstructionPage from './components/business/UnderConstructionPage';
import { CreateEventForm } from './components/forms/CreateEventForm';
import ExplorePage from './components/business/events/ExplorePage';
import MyEventsPage from './components/business/events/MyEventsPage';
import PendingEventsPage from './components/business/events/PendingEventsPage';
import EventDetailedPreview from './components/business/events/EventDetailedPreview';
import TicketsPage from './components/business/tickets/TicketsPage';
import TicketDetailedPreview from './components/business/tickets/TicketDetailedPreview';
import SettingsPage from './components/business/profile/SettingsPage';
import ReportsPage from './components/business/reports/ReportsPage';

function App() {
  const registrationForm = <Container><RegistrationForm /></Container>
  const loginForm = <Container><LoginForm /></Container>
  const logoutPage = <Container><LogoutPage /></Container>

  const settingsPage = <Container><SettingsPage /></Container> 

  const unavailablePage = <Container><UnavailablePage /></Container>
  const underConstructionPage = <Container><UnderConstructionPage /></Container>

  // const requestsList = <Container><RequestsList /></Container>
  // const requestPreview = <Container><RequestPreview /></Container>
  // const certificatesList = <Container><CertificatesList /></Container>
  // const certificatePreview = <Container><CertificatePreview /></Container>
  // const adminFirstPage = <Container><AdminFirstPage /></Container>
  // const clientFirstPage = <Container><ClientFirstPage /></Container>
  const createEventForm = <Container><CreateEventForm /></Container>
  const explorePage = <Container><ExplorePage /></Container>
  const myEventsPage = <Container><MyEventsPage /></Container>
  const pendingEventsPage = <Container><PendingEventsPage /></Container>
  const eventDetailedPreview = <Container><EventDetailedPreview /></Container>

  const ticketsPage = <Container><TicketsPage /></Container> 
  const ticketDetailedPreview = <Container><TicketDetailedPreview /></Container> 
  const reportsPage = <Container><ReportsPage /></Container> 
  // const userObjectsList = <Container><UserObjectsList /></Container>
  // const allObjectsList = <Container><AllObjectsList /></Container>
  // const createObjectForm = <Container><CreateObjectForm /></Container>'

  const [navBar, setNavBar] = useState(getNavbarByUserType());

  window.addEventListener('userUpdated', () => {
    setNavBar(getNavbarByUserType())
  })

  function getNavbarByUserType(){
    let userType = getUserType();

    if(userType === "PHYSICAL"){
      return <PhysicalNavbar />;
    } else if(userType === "BUSINESS"){
      return <BusinessNavbar />;
    } else if(userType === "ADMIN"){
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
                  <Route path="/unavailable" element={unavailablePage} />

                  <Route path="/explore" element={explorePage} />
                  <Route path="/explore/:id" element={eventDetailedPreview} />

                  <Route path="/profile/settings" element={settingsPage} />

                  <Route path="/business/organize" element={createEventForm} />
                  <Route path="/business/my-events" element={myEventsPage} />
                  <Route path="/business/reports" element={reportsPage} />

                  <Route path="/client/tickets" element={ticketsPage} />
                  <Route path="/client/tickets/:id" element={ticketDetailedPreview} />

                  <Route path="/admin/pending-events" element={pendingEventsPage} />

                  <Route path="*" element={unavailablePage} />
                </Route>
              </Routes>
          </Router>);
}

export default App;
