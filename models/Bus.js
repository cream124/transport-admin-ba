import mongoose from "mongoose";

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  licensePlate: { type: String, required: true },
  owner: { type: String, required: true },
  numberOfSeats: { type: Number, required: true },
  status: { type: String, enum: ["ACTIVE", "INACTIVE", "MAINTENANCE"], required: true },
});

export default mongoose.model("Bus", busSchema);
