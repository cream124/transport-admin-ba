import mongoose from "mongoose";

const OwnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: false },
  secondLastName: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  cell: { type: String },
  photo: { type: String }, // URL o base64
});

const Owner = mongoose.model("Owner", OwnerSchema);
export default Owner;
