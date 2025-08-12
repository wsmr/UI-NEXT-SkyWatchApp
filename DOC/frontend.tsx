// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// const App = () => {
//     const [location, setLocation] = useState('');
//     const [events, setEvents] = useState([]);
//     const [loading, setLoading] = useState(false);
//
//     const fetchEvents = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`https://api.example.com/astronomical-events?location=${location}`);
//             setEvents(response.data.events);
//         } catch (error) {
//             console.error('Error fetching events:', error);
//         }
//         setLoading(false);
//     };
//
//     useEffect(() => {
//         if (location) {
//             fetchEvents();
//         }
//     }, [location]);
//
//     return (
//         <div>
//             <h1>Night Sky Events</h1>
//             <input
//                 type="text"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//                 placeholder="Enter your location"
//             />
//             <button onClick={fetchEvents}>Get Events</button>
//
//             {loading ? (
//                 <p>Loading...</p>
//             ) : (
//                 <div>
//                     {events.map((event, index) => (
//                         <div key={index}>
//                             <h2>{event.name}</h2>
//                             <p>{event.description}</p>
//                             <p>Time: {event.time}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// };
//
// export default App;
