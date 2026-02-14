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
    <div className="menu-item card">
      <img src={item.image} alt={item.name} className="menu-item-image" />
      <div className="menu-item-content">
        <h3 className="menu-item-name">{item.name}</h3>
        <p className="menu-item-description">{item.description}</p>
        <div className="menu-item-footer">
          <span className="menu-item-price">${item.price.toFixed(2)}</span>
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
