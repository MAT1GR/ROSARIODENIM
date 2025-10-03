import { Router } from "express";
import * as customerController from "../controllers/customerController";

const router = Router();

router.get("/", customerController.getAllCustomers);
// --- CORRECCIÓN ---
// La ruta estaba mal formada. Se ha corregido para que tenga un nombre de parámetro válido.
router.get("/:id", customerController.getCustomerById);
router.post("/", customerController.createCustomer);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

export default router;
