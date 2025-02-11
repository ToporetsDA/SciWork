const mongoose = require("mongoose")

// Project schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  access: { type: Number, required: true },
  activities: [
    {
      name: { type: String, required: true },
      startDate: { type: String, required: true },
      endDate: { type: String, required: true },
      startTime: { type: String, default: "" },
      endTime: { type: String, default: "" },
      page: { type: Boolean, default: false },
      repeat: { type: Boolean, default: false },
      days: { type: [String], default: [] }, // Array of days
      thirdParty: { type: Boolean, default: false },
      serviceName: { type: String, default: null },
      id: { type: String, required: true }
    }
  ],
  userList: [
    {
      id: { type: String, required: true },
      access: { type: Number, required: true }
    }
  ],
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true } // Ensures proper ObjectId creation
})

// Export the Project model
const Project = mongoose.model("Project", projectSchema, "projects")

module.exports = Project
