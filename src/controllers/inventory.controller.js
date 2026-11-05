import * as inventoryService from "../services/inventory.service.js";
import { SuccessResponse } from "../core/success.response.js";

export const addStock = async (req, res, next) => {
  try {
    new SuccessResponse({
      message: "Add stock to inventory successfully!",
      metadata: await inventoryService.addStockToInventory(req.body),
    }).send(res);
  } catch (error) {
    next(error);
  }
};
