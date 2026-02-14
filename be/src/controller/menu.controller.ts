import { NextFunction, Request, Response } from "express";
import * as menuService from "../service/menu.service";
import { MenuQuery } from "../types/menu.types";

export const getMenu = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = menuService.getMenu(req.query as unknown as MenuQuery);

    res.status(200).json({
      success: true,
      data: result.menu,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categories = menuService.getCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getMenuItemById = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const item = menuService.getMenuItemById(req.params.id as string);
    if (!item) {
      res.status(404).json({
        success: false,
        error: "Menu item not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};
