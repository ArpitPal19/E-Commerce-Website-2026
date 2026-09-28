import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";

// ================= REGISTER =================

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    // Validations
    if (!name) {
      return res.send({ message: "Name is Required" });
    }

    if (!email) {
      return res.send({ message: "Email is Required" });
    }

    if (!password) {
      return res.send({ message: "Password is Required" });
    }

    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }

    if (!address) {
      return res.send({ message: "Address is Required" });
    }

    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    // Check existing user
    const exisitingUser = await userModel.findOne({ email });

    if (exisitingUser) {
      return res.status(200).send({
        success: true,
        message: "Already Register please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in Registeration",
      error,
    });
  }
};

// ================= LOGIN =================

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registerd",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Create token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// ================= FORGOT PASSWORD =================

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      return res.status(400).send({
        message: "Email is required",
      });
    }

    if (!answer) {
      return res.status(400).send({
        message: "answer is required",
      });
    }

    if (!newPassword) {
      return res.status(400).send({
        message: "New Password is required",
      });
    }

    // Check user
    const user = await userModel.findOne({
      email,
      answer,
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong Email Or Answer",
      });
    }

    const hashed = await hashPassword(newPassword);

    await userModel.findByIdAndUpdate(user._id, {
      password: hashed,
    });

    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// ================= TEST CONTROLLER =================

export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// ================= UPDATE PROFILE =================

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone, answer } = req.body;

    // Find current user
    const user = await userModel.findById(req.user._id);

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Password validation
    if (password && password.length < 6) {
      return res.status(400).json({
        error: "Password is required and 6 character long",
      });
    }

    // Hash new password only if user entered one
    const hashedPassword = password
      ? await hashPassword(password)
      : user.password;

    // Update user
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
        answer: answer || user.answer,
      },
      {
        new: true,
      },
    );

    res.status(200).send({
      success: true,
      message: "Profile Updated Successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);

    res.status(400).send({
      success: false,
      message: "Error while Update profile",
      error: error.message,
    });
  }
};

// ================= GET USER ORDERS =================

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Getting Orders",
      error,
    });
  }
};

// ================= GET ALL ORDERS =================

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Getting Orders",
      error,
    });
  }
};

// ================= UPDATE ORDER STATUS =================

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    res.json(orders);
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Updating Orders",
      error,
    });
  }
};

// ================= GET ALL USERS =================

export const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({})
      .select("-password -answer")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All Users Retrieved Successfully",
      users,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Error while Getting Users",
      error: error.message,
    });
  }
};
