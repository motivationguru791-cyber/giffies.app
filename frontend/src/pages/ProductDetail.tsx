import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, ShoppingBag, ChevronLeft, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product not found");
        setLoading(false);
        return;
      }
      try {
        const data = await api.getProduct(id);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAddingToCart(true);
    try {
      for (let i = 0; i < quantity; i++) {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
        });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex items-center justify-center min-h-screen">
        <Loader2 size={40} className="text-primary animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/shop")}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-premium mb-8"
        >
          <ChevronLeft size={20} />
          Back to Shop
        </button>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">Oops! Product not found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate("/shop")}
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-premium"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <button
        onClick={() => navigate("/shop")}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-premium mb-8"
      >
        <ChevronLeft size={20} />
        Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="flex items-center justify-center bg-secondary rounded-lg overflow-hidden aspect-square">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-primary text-sm uppercase tracking-[0.2em] font-medium mb-3">Product Details</p>
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">{product.name}</h1>
            
            <div className="mb-8">
              <div className="text-4xl font-bold text-primary mb-2">${product.price?.toFixed(2)}</div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="font-semibold text-foreground mb-3">Description</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4 pt-8 border-t border-border">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">Quantity</label>
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-premium"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-semibold text-foreground w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-premium"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-3 flex flex-col">
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-premium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Buy Now
                  </>
                )}
              </button>
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full bg-secondary text-foreground py-3 rounded-md font-medium text-sm uppercase tracking-wider hover:bg-secondary/80 transition-premium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
