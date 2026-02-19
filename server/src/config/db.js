import mongoose from "mongoose";

export const connectDatabase = async (mongodbUri) => {
  await mongoose.connect(mongodbUri);
};
