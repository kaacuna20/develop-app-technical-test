import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/public/HomePage";
import AboutPage from "./pages/public/AboutPage";
import Login from "./pages/public/Login";
import Register from "./pages/public/Register";
import PublicLayout from "./layouts/PublicLayout";
import CategoryProducts from "./pages/public/CategoryProducts";
import ProductDetails from "./pages/public/ProductDetails";
import SearchPage from "./pages/public/SearchPage";
import CartPage from "./pages/public/CartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/public/Profile";
import HistoryOrder from "./pages/public/HistoryOrderUser";
import CheckOut from "./pages/public/CheckOut";
import Order from "./pages/public/OrderPage";
import AdminLayout from "./layouts/AdminLayout";
import AdminRoute from "./components/AdminRoute";
import AdminPannel from "./pages/admin/AdminPannel";
import AdminHistorialOrders from "./pages/admin/AdminHistorialOrders";
import CreateProduct from "./pages/admin/AdminCreateProduct";
import AdminProduct from "./pages/admin/AdminProduct";
import AdminAlterProduct from "./pages/admin/AdminAlterProduct";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="login" element={<Login />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="register" element={<Register />} />
          <Route path="category/:category_id" element={<CategoryProducts />} />
          <Route path="/:slug" element={<ProductDetails />} />
          <Route path="cart" element={<CartPage />} />
          <Route
            path="/profile"
            element={<ProtectedRoute element={Profile} />}
          />
          <Route
            path="/history-orders"
            element={<ProtectedRoute element={HistoryOrder} />}
          />
          <Route
            path="/checkout"
            element={<ProtectedRoute element={CheckOut} />}
          />
          <Route
            path="/order/:order_id"
            element={<ProtectedRoute element={Order} />}
          />
        </Route>

        {/* Rutas de administración */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminPannel />} />
          <Route path="historial" element={<AdminHistorialOrders />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="alter-product" element={<AdminAlterProduct />} />
          {/* Otras rutas protegidas de administración */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
