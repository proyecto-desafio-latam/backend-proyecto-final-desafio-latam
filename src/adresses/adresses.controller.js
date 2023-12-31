import { handleErrors } from "../database/errors.js";
import { addressesModel } from "./adresses.model.js";

const getAllRegionsCommunes = async (req, res) => {
  try {
    const result = await addressesModel.findAllAddresses();
    console.log(result);
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    console.log(error, message);
    return res.status(status).json({ ok: false, result: message });
  }
};

const getAddress = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await addressesModel.allAddresses(user_id);
    console.log(result);
    return res.status(200).json({ ok: true, result });
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    console.log(error, message);
    return res.status(status).json({ ok: false, result: message });
  }
};

const newAddress = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { address, commune_id } = req.body;
    const result = await addressesModel.addAddress(
      address,
      commune_id,
      user_id
    );
    console.log(result);
    return res
      .status(201)
      .json({ ok: true, message: "Nueva Dirección Agregada", result });
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    console.log(error, message);
    return res.status(status).json({ ok: false, result: message });
  }
};

const modifyAddress = async (req, res) => {
  try {
    const { address, commune_id } = req.body;
    const { user_id } = req.params;
    const result = await addressesModel.updateAddress(
      address,
      commune_id,
      user_id
    );
    console.log(result);
    return res
      .status(201)
      .json({ ok: true, message: "La dirección fue modificada", result });
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    console.log(error, message);
    return res.status(status).json({ ok: false, result: message });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  try {
    const count = await addressesModel.countPurchases(id)
    if(count.length > 0){
      return res.status(400).json({ok: false, message: "No puedes borrar esta dirección, porque tienes compras asociadas"})
    }
    const result = await addressesModel.removeAddress(id);
    return res.status(204).json({ ok: true, result });
  } catch (error) {
    const { status, message } = handleErrors(error.code);
    console.error(error, message);
    return res.status(status).json({ ok: false, result: message });
  }
}

export const addressController = {
  getAddress,
  newAddress,
  modifyAddress,
  getAllRegionsCommunes,
  deleteAddress,
};
