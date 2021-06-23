import userModel from "../models/userModel.js";
import authenticationHelper from "../helpers/authenticationHelper.js";
import bcrypt from "bcrypt";
import createHttpError from "http-errors";
import ipController from "./ipController.js";

const login = async (req, res, next) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) throw createHttpError.NotFound("User not found");

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPassword) throw createHttpError.Unauthorized("Invalid password");

        ipController.delete(req, res, next);

        res.status(200).json({ userId: user._id, token: authenticationHelper.createToken(user._id) });
    } catch (error) {
        next(error);
    }
};

export default { login };
