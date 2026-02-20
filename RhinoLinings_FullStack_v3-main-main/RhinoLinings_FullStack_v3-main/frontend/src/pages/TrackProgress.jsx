// src/pages/TrackProgress.jsx
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import API from "../services/api"; // axios instance; baseURL -> backend /api

export default function TrackProgress() {
  const { ticketId } = useParams();
  const [tickets, setTickets] = useState([]);
  const [ticket, setTicket] = useState(null);
  const [err, setErr] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (ticketId) {
      // fetch specific ticket
      API.get(`/tickets/track/${ticketId}`)
        .then((res) => setTicket(res.data))
        .catch((e) => setErr(e.response?.data?.message || "Not found"));
    } else {
      // no ticketId -> admin wants list of tickets
      if (!user || user.role !== "admin") {
        setErr("Unauthorized");
        return;
      }
      API.get("/tickets")
        .then((res) => setTickets(res.data))
        .catch((e) => setErr(e.response?.data?.message || "Failed to load"));
    }
  }, [ticketId]);

  if (err === "Unauthorized") {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="pt-24 px-6">
      <h2 className="text-3xl text-rhinoYellow mb-4">Track Progress</h2>

      {ticketId ? (
        ticket ? (
          <div className="bg-rhinoBlack p-4 rounded text-rhinoWhite">
            <div><strong>ID:</strong> {ticket._id}</div>
            <div><strong>Status:</strong> {ticket.status}</div>
            <div><strong>Assigned:</strong> {ticket.assignedTo?.name || "None"}</div>
            <div><strong>Notes:</strong> {ticket.notes}</div>
          </div>
        ) : (
          <p className="text-rhinoWhite">Loading ticket...</p>
        )
      ) : (
        <>
          <h3 className="text-xl mb-4 text-rhinoWhite">All Tickets (Admin)</h3>
          {tickets.length === 0 ? (
            <p className="text-rhinoWhite">No tickets found.</p>
          ) : (
            <ul className="space-y-3">
              {tickets.map((t) => (
                <li key={t._id} className="bg-rhinoBlack p-3 rounded text-rhinoWhite">
                  <div><strong>{t._id}</strong> — {t.status}</div>
                  <div>Assigned: {t.assignedTo?.name || "None"}</div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
