import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/auth.js';
import { createOrder, deleteOrder, getOrderById, listOrders, updateOrder } from '../services/orderService.js';

export const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.get('/', async (req, res) => {
  try {
    const result = await listOrders(req.query, req.user);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

ordersRouter.get('/:id', async (req, res) => {
  try {
    const order = await getOrderById(req.params.id, req.user);
    res.json(order);
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : error.message === 'Forbidden' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

ordersRouter.post('/', requireRole('admin'), async (req, res) => {
  try {
    const order = await createOrder(req.body, req.user);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

ordersRouter.patch('/:id', requireRole('admin'), async (req, res) => {
  try {
    const order = await updateOrder(req.params.id, req.body, req.user);
    res.json(order);
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : error.message === 'Forbidden' ? 403 : 400;
    res.status(status).json({ message: error.message });
  }
});

ordersRouter.delete('/:id', requireRole('admin'), async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.status(204).send();
  } catch (error) {
    const status = error.message === 'Order not found' ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
});
