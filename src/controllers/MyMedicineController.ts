import { Request, Response } from "express";
import Medicine from "../models/medicine";
import cloudinary from "cloudinary";
import mongoose from "mongoose";
import Order from "../models/order";

const getMyMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findOne({ user: req.userId });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json(medicine);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Error fetching medicine" });
  }
};

const createMyMedicine = async (req: Request, res: Response) => {
  try {
    const existingMedicine = await Medicine.findOne({ user: req.userId });

    if (existingMedicine) {
      return res
        .status(409)
        .json({ message: "User medicine already exists" });
    }

    const imageUrl = await uploadImage(req.file as Express.Multer.File);

    const medicine = new Medicine(req.body);
    medicine.imageUrl = imageUrl;
    medicine.user = new mongoose.Types.ObjectId(req.userId);
    medicine.lastUpdated = new Date();
    await medicine.save();

    res.status(201).send(medicine);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const updateMyMedicine = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findOne({
      user: req.userId,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicine.medicineName = req.body.medicineName;
    medicine.city = req.body.city;
    medicine.country = req.body.country;
    medicine.deliveryPrice = req.body.deliveryPrice;
    medicine.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    medicine.categories = req.body.categories;
    medicine.menuItems = req.body.menuItems;
    medicine.lastUpdated = new Date();

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      medicine.imageUrl = imageUrl;
    }

    await medicine.save();
    res.status(200).send(medicine);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getMyMedicineOrders = async (req: Request, res: Response) => {
  try {
    const medicine = await Medicine.findOne({ user: req.userId });
    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const orders = await Order.find({ medicine: medicine._id })
      .populate("medicine")
      .populate("user");

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const medicine = await Medicine.findById(order.medicine);

    if (medicine?.user?._id.toString() !== req.userId) {
      return res.status(401).send();
    }

    order.status = status;
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "unable to update order status" });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  updateOrderStatus,
  getMyMedicineOrders,
  getMyMedicine,
  createMyMedicine,
  updateMyMedicine,
};
