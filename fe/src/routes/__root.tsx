import { createRootRoute, Outlet } from "@tanstack/react-router";
import { CartProvider } from "../context/CartContext";
import "../App.css";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <CartProvider>
      <div className="app">
        <header className="app-header">
          <h1>FoodExpress</h1>
          <p className="tagline">Delicious food delivered to your door</p>
        </header>

        <main className="app-main">
          <Outlet />
        </main>

        <footer className="app-footer">
          <p>© 2026 FoodExpress. Made with ❤️ for delicious food lovers.</p>
        </footer>
      </div>
    </CartProvider>
  );
}
