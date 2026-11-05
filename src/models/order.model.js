import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_user_id: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /*
        order_checkout: {
            total_price,
            total_apply_discount,
            fee_ship
        }    
    */
    order_shipping: { type: Object, default: {} },
    /*
        order_shipping: {
            street,
            city,
            state,
            country,
        }
    */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_tracking_number: { type: String, default: "" },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  },
);

export default model(DOCUMENT_NAME, orderSchema);
