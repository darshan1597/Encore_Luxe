import OrderCounter from "../models/orderCounter.model.js";

export const generateOrderNumber = async () => {

    let counter = await OrderCounter.findOne({ name: "guestOrder" });

    if (!counter) {
        counter = await OrderCounter.create({
            name: "guestOrder",
            value: 100000,
        });
    }

    counter.value += 1;
    await counter.save();

    const visible = counter.value; // e.g. 100001
    const padded = visible.toString().padStart(10, "0"); // e.g. 0000100001

    return { padded, visible };
};
