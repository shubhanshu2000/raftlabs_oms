import { NextFunction, Request, Response } from "express";
import * as menuService from "../service/menu.service";
import { MenuQuery } from "../types/menu.types";

export const getMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const queryParams = (req as any).query;
    const result = menuService.getMenu(queryParams as any);

    (res as any).status(200).json({
      success: true,
      data: result.menu,
      pagination: {
        total: result.total,
        page: Number(queryParams.page) || 1,
        limit: Number(queryParams.limit) || 10,
      },
    });
  } catch (err) {
    (next as any)(err);
  }
};

export const getCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = menuService.getCategories();

    (res as any).status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    (next as any)(err);
  }
};

export const getMenuItem = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = (req as any).params.id as string;
    const item = menuService.getMenuItemById(id);

    if (!item) {
      (res as any).status(404).json({
        success: false,
        error: "Menu item not found",
      });
      return;
    }

    (res as any).status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    (next as any)(err);
  }
};
