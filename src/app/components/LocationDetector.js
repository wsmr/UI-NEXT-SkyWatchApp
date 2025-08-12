// import React, { useState, useEffect } from 'react';
//
// interface Location {
//     latitude: number;
//     longitude: number;
// }
//
// interface LocationDetectorProps {
//     onLocationDetected: (location: Location) => void;
// }
//
// const LocationDetector: React.FC<LocationDetectorProps> = ({ onLocationDetected }) => {
//     const [location, setLocation] = useState<Location | null>(null);
//     const [error, setError] = useState<string | null>(null);
//
//     useEffect(() => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setLocation({ latitude, longitude });
//                     onLocationDetected({ latitude, longitude });
//                 },
//                 (error) => {
//                     setError(error.message);
//                 }
//             );
//         } else {
//             setError("Geolocation is not supported by this browser.");
//         }
//     }, [onLocationDetected]);
//
//     return (
//         <div>
//             {error && <p>Error: {error}</p>}
//             {location && (
//                 <p>
//                     Location detected: Latitude {location.latitude}, Longitude {location.longitude}
//                 </p>
//             )}
//         </div>
//     );
// };
//
// export default LocationDetector;
