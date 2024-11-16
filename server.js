const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/contactDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const contactSchema = new mongoose.Schema({
  Fistname: { type: String, required: true },
  Lastname: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  company: String,
  jobTitle: String,
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/api/contacts", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

app.post("/api/contacts", async (req, res) => {
  const newContact = new Contact(req.body);
  await newContact.save();
  res.json(newContact);
});

app.put("/api/contacts/:id", async (req, res) => {
  const updatedContact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedContact);
});

app.delete("/api/contacts/:id", async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  res.json({ message: "Contact deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
