import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import axios from "axios";

const App = () => {
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [form, setForm] = useState({ Fistname: "",Lastname: "", email: "", phoneNumber : "", company: "", jobTitle: "" });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    const res = await axios.get("/api/contacts");
    setContacts(res.data);
  };

  const handleOpen = (contact = null) => {
    setEditContact(contact);
    setForm(contact || { Fistname: "",Lastname: "", email: "", phoneNumber : "", company: "", jobTitle: "" });
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editContact) {
      await axios.put(`/api/contacts/${editContact._id}`, form);
    } else {
      await axios.post("/api/contacts", form);
    }
    fetchContacts();
    handleClose();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/contacts/${id}`);
    fetchContacts();
  };

  return (
    <Container>
      <h1>Contact Management</h1>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Contact
      </Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fistname</TableCell>
              <TableCell>Lastname</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>phoneNumber</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact._id}>
                <TableCell>{contact.Fistname}</TableCell>
                <TableCell>{contact.Lastname}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phoneNumber}</TableCell>
                <TableCell>{contact.company}</TableCell>
                <TableCell>{contact.jobTitle}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(contact)}>
                    Edit
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(contact._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editContact ? "Edit Contact" : "Add Contact"}</DialogTitle>
        <DialogContent>
          {["Fistname","Lastname", "email", "phoneNumber", "company", "jobTitle"].map((field) => (
            <TextField
              key={field}
              margin="dense"
              Fistname={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              fullWidth
              value={form[field]}
              onChange={handleChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default App;
