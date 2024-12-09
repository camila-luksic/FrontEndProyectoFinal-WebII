
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -17.753888888889,
  lng: -62.996944444444
};

function MapaGoogle() {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDjBVszJd4JRyO8qW_KA0oxRUfYs6r5SV4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
}

export default MapaGoogle;
