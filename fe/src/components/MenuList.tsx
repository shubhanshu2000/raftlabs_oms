import { useState, useEffect } from "react";
import type { MenuItem as MenuItemType } from "../types";
import { fetchMenu, fetchCategories } from "../services/api";
import { MenuItem } from "./MenuItem";
import "./MenuList.css";
import { useNavigate, useSearch } from "@tanstack/react-router";

interface MenuListProps {
  onAddToCart: (item: MenuItemType, quantity: number) => void;
}


export const MenuList = ({ onAddToCart }: MenuListProps) => {
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // URL State
  const navigate = useNavigate({ from: "/" });
  const search = useSearch({ from: "/" });
  const page = search.page || 1;
  const selectedCategory = search.category || "All";
  const limit = search.limit || 6;
  
  // Local state for total items (returned from API)
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadMenu();
  }, [page, selectedCategory]);

  const loadCategories = async () => {
    try {
      const cats = await fetchCategories();
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const { menu, total } = await fetchMenu(
        page,
        limit,
        selectedCategory === "All" ? undefined : selectedCategory
      );
      setMenuItems(menu);
      setTotalItems(total);
    } catch (err) {
      setError("Failed to load menu. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    navigate({
      search: (old) => ({ ...old, category, page: 1 }),
    });
  };

  const handlePageChange = (newPage: number) => {
      navigate({
        search: (old) => ({ ...old, page: newPage }),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPages = Math.ceil(totalItems / limit);

  if (loading && menuItems.length === 0) {
    return <div className="loading">Loading menu...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <p>{error}</p>
        <button onClick={() => loadMenu()} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="menu-list">
      <h2>Our Menu</h2>
      
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? "active" : ""}`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
      
      {menuItems.length === 0 && !loading && (
          <div className="no-items">No items found in this category.</div>
      )}

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="page-info">
            Page {page} of {totalPages}
          </span>
          <button 
            className="pagination-btn" 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
