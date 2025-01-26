import React from "react";
import { useQuery } from "@apollo/client";
import { GET_EVENTS } from "./Queries";

import "../styles/eventList.css"

const EventsList = () => {
  const { loading, error, data } = useQuery(GET_EVENTS);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("tr-TR", { 
      year: "numeric", 
      month: "2-digit", 
      day: "2-digit", 
      hour: "2-digit", 
      minute: "2-digit"
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="eventList">
      <h1>Etkinlikler</h1>
      <ul className="eventList-ul">
        {data.events.map((event, key) => (
          <li key={key} className="eventItem">
            <div className="eventInfo">
              <div className="eventTitle">{event.title}</div>
              <p className="eventDescription">{event.description}</p>
              <p className="eventTime">{formatDateTime(event.time)}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventsList;
