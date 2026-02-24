import { useEffect, useState } from "react";
import { api, Order } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Package, Calendar, MapPin, Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-12">
        <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-2">Welcome</p>
        <h1 className="font-display text-4xl font-bold text-foreground">Account Dashboard</h1>
      </div>

      {/* Account Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-semibold text-sm">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Full Name</p>
                <p className="text-foreground font-medium">{user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-muted-foreground" />
              <div>
                <p className="text-muted-foreground text-sm">Email</p>
                <p className="text-foreground font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-soft border border-border">
          <h2 className="font-display text-xl font-semibold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Total Orders</p>
              <p className="text-foreground font-semibold text-3xl">{orders.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm">Total Spent</p>
              <p className="text-foreground font-semibold text-3xl">
                ${orders.reduce((sum, order) => sum + order.totalAmount, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Package size={28} /> My Orders
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={32} className="text-primary animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-lg border border-border">
            <Package size={48} className="mx-auto text-muted-foreground/40 mb-4" />
            <h3 className="text-foreground font-medium mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-sm">Start shopping to see your orders here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-card rounded-lg p-6 shadow-soft border border-border hover:shadow-md transition-premium animate-fade-in"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Order Number</p>
                    <p className="font-mono text-foreground font-semibold text-sm">{order.orderNumber || `GIFF-${new Date(order.createdAt).getFullYear()}-${order._id.slice(-6).toUpperCase()}`}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Order Date</p>
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar size={16} className="text-primary" />
                      <span className="font-medium">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pb-4 border-b border-border">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Amount</p>
                    <p className="font-semibold text-foreground text-lg">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Recipient</p>
                    <p className="font-medium text-foreground">{order.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Email</p>
                    <p className="font-medium text-foreground text-sm">{order.email}</p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-border">
                  <div className="flex items-start gap-2 text-muted-foreground text-sm">
                    <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground mb-1">Shipping Address</p>
                      <p className="text-foreground">{order.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-3">Items</p>
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.name} <span className="text-muted-foreground">x{item.quantity}</span>
                        </span>
                        <span className="text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
