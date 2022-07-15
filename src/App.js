import { useState,useEffect,useCallback } from "react";
import { BiCalendar } from "react-icons/bi";
import Search from "./components/Search";
import AddAppointment from "./components/AddAppointment";

import Appointmetninfo from "./components/Appointmentinfo";

function App() {
  let [appointmentlist, setAppointmentlist] = useState([]);
  let [query, setQuery] = useState("");
  let [sortBy, setSortBy] = useState("petName");
  let [orderBy, setOrderBy] = useState('asc');

  const filteredAppointments = appointmentlist.filter(
    item =>{
      return(

        item.petName.toLowerCase().includes(query.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
        item.aptNotes.toLowerCase().includes(query.toLowerCase())

      )
    }
  ).sort((a,b) => {
    let order = (orderBy === 'asc') ? 1:-1;
    return(
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() 
      ? -1 * order : 1 * order
    )
  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      setAppointmentlist(data)
    });
  },[])

  useEffect(() => {
    fetchData()
  },[fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-3">
        <BiCalendar className="inline-block text-red-800 align-top"/>Your Appointments</h1>
      <AddAppointment 
      onSendAppointment = {myAppointment => setAppointmentlist([...appointmentlist, myAppointment])}
      lastId={appointmentlist.reduce((max, item) => Number(item.id) > max ? Number(item.id): max,0)}
      />
      <Search query={query}
      onQueryChange = {myQuery => setQuery(myQuery)} 
      orderBy = {orderBy}
      onOrderByChange = {mySort => setOrderBy(mySort)}
      sortBy = {sortBy}
      onSortByChange = {mySort => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments
        .map(appointment => (
          <Appointmetninfo key={appointment.id}
          appointment={appointment}
          onDeleteAppointment = {
            appointmentID => setAppointmentlist(appointmentlist.filter(appointment => 
              appointment.id !== appointmentID ))
          }
          />
        ))
        }

      </ul>


    </div>
  );
}

export default App;
