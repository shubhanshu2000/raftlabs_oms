import { NextFunction, Request, Response } from "express";
import * as orderService from "../service/order.service";
import { CreateOrderRequest } from "../types/order.types";
import logger from "../utils/logger";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderRequest: CreateOrderRequest = (req as any).body;
    // Validation is handled by middleware
    const order = orderService.createOrder(orderRequest);

    logger.info(`Order created: ${order?.id}`);

    (res as any).status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    (next as any)(err);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as any).params.id as string;
    const order = orderService.getOrderById(id);

    if (!order) {
      (res as any).status(404).json({
        success: false,
        error: "Order not found",
      });
      return;
    }

    (res as any).status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    (next as any)(err);
  }
};

export const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as any).params.id as string;
    const { status } = (req as any).body;

    const order = orderService.updateOrderStatus(id, status);

    if (!order) {
      (res as any).status(404).json({
        success: false,
        error: "Order not found",
      });
      return;
    }

    logger.info(`Order status updated: ${id} -> ${status}`);

    (res as any).status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    (next as any)(err);
  }
};

export const getAllOrders = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orders = orderService.getAllOrders();

    (res as any).status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    (next as any)(err);
  }
};
