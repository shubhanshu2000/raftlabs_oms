import type { MenuItem as MenuItemType } from "../types";

interface MenuItemProps {
  item: MenuItemType;
  onAddToCart: (item: MenuItemType, quantity: number) => void;
}

export const MenuItem = ({ item, onAddToCart }: MenuItemProps) => {
  const handleAddToCart = () => {
    onAddToCart(item, 1);
  };

  return (
    <div className="card p-4 flex flex-col animate-fade-in">
      <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded-brand mb-4" />
      <div className="flex-1 flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-gray-500 text-sm mb-4 flex-1">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-brand-primary">${item.price.toFixed(2)}</span>
          <button
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={!item.available}
          >
            {item.available ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </div>
    </div>
  );
};
