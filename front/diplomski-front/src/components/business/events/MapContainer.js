import React from 'react';
import '../../../assets/styles/business.css';
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import '../../../assets/styles/style.css'; 
import axios from 'axios'
import {useState, useEffect} from 'react';

// google maps api https://stackoverflow.com/questions/61277920/how-to-display-google-map-in-reactjs-inside-of-page-height-and-width
// positionstack geocoding 
//      data returns like: http://api.positionstack.com/v1/forward?access_key=c34ca23bddd0452df4c8b1bc32eb43a7&query=Backa+Topola,+Petefi+Sandora+14
//      documentation https://positionstack.com/documentation

export function MapContainer({google, address}){

    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [map, setMap] = useState();

    useEffect(() => {
        // get coordinates
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBN5Z2mibX_vZ8hradriKQUniPPdPydzc4`)
        .then(response => response.json())
        .then(data => {
          // Extract latitude and longitude from the API response
          const { lat, lng } = data.results[0].geometry.location;
          setLatitude(lat);
          setLongitude(lng);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }, [address])

    useEffect(() => {
        setMap(<Map 
            google={google}
            
            style={ {
                width: '100%',
                height: '300px'
                }}
            center={{
                lat: latitude,
                lng: longitude
                }}
            initialCenter={
                {
                  lat: latitude,
                  lng: longitude
                }}  
            className="mapContainerWrapper"
            zoom={16}
        >
            <Marker position={
                {
                  lat: latitude,
                  lng: longitude
                }
            }  />
    
            <style jsx>{`
                .mapContainerWrapper{
                    position:relative !important;   
                }
    
                .mapContainerWrapper div:first-child{
                    position:relative !important;
                }
            `}</style>
    
        </Map>);
    }, [longitude, latitude, google])
    

    return      (map)              
};

export default GoogleApiWrapper({
    apiKey: "AIzaSyBN5Z2mibX_vZ8hradriKQUniPPdPydzc4"
})(MapContainer);