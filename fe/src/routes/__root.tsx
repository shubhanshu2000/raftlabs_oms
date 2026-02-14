import { createRootRoute, Outlet } from "@tanstack/react-router";
import { CartProvider } from "../context/CartContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <header className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white py-8 px-4 shadow-brand-lg">
          <h1 className="text-4xl font-bold text-center mb-2">FoodExpress</h1>
          <p className="text-center text-brand-primary-light text-lg">Delicious food delivered to your door</p>
        </header>

        <main className="flex-1 max-w-[1400px] mx-auto py-8 px-4 w-full">
          <Outlet />
        </main>

        <footer className="bg-gray-800 text-white p-6 text-center mt-auto">
          <p>© 2026 FoodExpress. Made with ❤️ for delicious food lovers.</p>
        </footer>
      </div>
    </CartProvider>
  );
}
