import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_EVENT, GET_EVENTS, GET_USERS, GET_LOCATIONS } from "./Queries";

import "../styles/addEventForm.css";

const AddEventForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [time, setTime] = useState("");
  const [userId, setUserId] = useState("");
  const [locationId, setLocationId] = useState("");

  const {
    data: userData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(GET_USERS);
  const {
    data: locationData,
    loading: locationsLoading,
    error: locationsError,
  } = useQuery(GET_LOCATIONS);

  const [createEvent, { loading, error }] = useMutation(CREATE_EVENT, {
    refetchQueries: [{ query: GET_EVENTS }],
  });

  const today = new Date().toISOString().slice(0, 16);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      //const { data } = 
      await createEvent({
        variables: {
          title: title,
          userId: userId,
          locationId: locationId,
          description: description,
          time: time,
        },
      });
      setTitle("");
      setDescription("");
      setTime("");
      setUserId("");
      setLocationId("");
      //alert(`Event "${data.addEvent.title}" created successfully!`);
      //console.log("Event created:", data);
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event");
    }
  };

  if (loading || usersLoading || locationsLoading) return <p>Loading...</p>;
  if (error || usersError || locationsError)
    return (
      <p>
        Error:{" "}
        {error?.message || usersError?.message || locationsError?.message}
      </p>
    );

  return (
    <div className="addEventForm">
      <h2 className="addEventForm-title">Create New Event</h2>
      <form onSubmit={handleSubmit} className="addEventForm-form">
        <div className="addEventForm-Input">
          <label>Event Name:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
            required
          />
        </div>
        <div className="addEventForm-Input">
          <label>Event Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event Description"
            required
          />
        </div>
        <div className="addEventForm-Input">
          <label>Event Time:</label>
          <input
            type="datetime-local"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            min={today}
            required
          />
        </div>
        <div className="addEventForm-Input">
          <label>User ID</label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          >
            <option value="">Select a User</option>
            {userData?.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>
        <div className="addEventForm-Input">
          <label>Location ID:</label>
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            required
          >
            <option value="">Select a Location</option>
            {locationData?.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <button className="eventCreateBttn" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default AddEventForm;
