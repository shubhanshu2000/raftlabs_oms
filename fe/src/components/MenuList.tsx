import { useState, useEffect } from "react";
import type { MenuItem as MenuItemType } from "../types";
import { fetchMenu, fetchCategories } from "../services/api";
import { MenuItem } from "./MenuItem";
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
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl font-bold text-gray-800">Our Menu</h2>
      
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            className={`px-6 py-3 rounded-full font-medium border cursor-pointer transition-all duration-200 ${
              selectedCategory === category 
                ? "bg-brand-primary text-white border-brand-primary shadow-brand-md" 
                : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {menuItems.map((item) => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
      
      {menuItems.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">No items found in this category.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-8 mt-12 pb-8">
          <button 
            className="px-6 py-3 border-2 border-gray-200 bg-white rounded-full cursor-pointer font-semibold text-gray-800 transition-all duration-300 shadow-brand-sm flex items-center gap-2 hover:not-disabled:border-brand-primary hover:not-disabled:text-brand-primary hover:not-disabled:bg-red-50 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-brand-md active:not-disabled:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-transparent disabled:shadow-none" 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="font-semibold text-base text-gray-500 tracking-wider bg-brand-bg px-4 py-2 rounded-brand">
            Page {page} of {totalPages}
          </span>
          <button 
            className="px-6 py-3 border-2 border-gray-200 bg-white rounded-full cursor-pointer font-semibold text-gray-800 transition-all duration-300 shadow-brand-sm flex items-center gap-2 hover:not-disabled:border-brand-primary hover:not-disabled:text-brand-primary hover:not-disabled:bg-red-50 hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-brand-md active:not-disabled:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-transparent disabled:shadow-none" 
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
