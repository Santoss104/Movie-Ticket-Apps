import React, { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error("useTickets must be used within a TicketProvider");
  }
  return context;
};

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticketData) => {
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      status: "Current",
      bookingDate: new Date().toISOString(),
    };

    setTickets((prevTickets) => [...prevTickets, newTicket]);
  };

  const updateTicketStatus = (ticketId, newStatus) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const getTicketsByStatus = (status) => {
    return tickets.filter(
      (ticket) => ticket.status.toLowerCase() === status.toLowerCase()
    );
  };

  const value = {
    tickets,
    addTicket,
    updateTicketStatus,
    getTicketsByStatus,
  };

  return (
    <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
  );
};

export default TicketProvider;