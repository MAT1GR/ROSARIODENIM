import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Minus,
  CheckCircle,
  HelpCircle,
  Truck,
  ShieldCheck,
  Undo2,
} from "lucide-react";
import { Product } from "../types";
import { useCart } from "../hooks/useCart";
import ProductMediaGallery from "../components/ProductMediaGallery";
import SizeGuideModal from "../components/SizeGuideModal";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import ProductCard from "../components/ProductCard";

interface ShippingOption {
  id: string;
  name: string;
  cost: number;
}

const Breadcrumbs: React.FC<{ product: Product }> = ({ product }) => (
  <nav className="text-sm text-gris-oscuro/70 mb-4">
    <Link to="/" className="hover:text-gris-oscuro">
      Inicio
    </Link>
    <span className="mx-2">/</span>
    <Link to="/tienda" className="hover:text-gris-oscuro uppercase">
      {product.category}
    </Link>
  </nav>
);

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [postalCode, setPostalCode] = useState("");
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const relatedRef = useScrollAnimation<HTMLElement>();

  const STANDARD_SIZES = ["34", "36", "38", "40", "42", "44"];

  useEffect(() => {
    const fetchProductData = async () => {
      if (!id) return;
      setIsLoading(true);
      window.scrollTo(0, 0);
      try {
        const productRes = await fetch(`/api/products/${id}`);

        if (productRes.ok) {
          const productData = await productRes.json();
          setProduct(productData);

          const availableSizes = Object.keys(productData.sizes).filter(
            (size) =>
              productData.sizes[size].available &&
              productData.sizes[size].stock > 0
          );
          if (availableSizes.length > 0) {
            setSelectedSize(availableSizes[0]);
          } else {
            setSelectedSize("");
          }

          const allProductsRes = await fetch("/api/products/all");
          if (allProductsRes.ok) {
            const allProducts = await allProductsRes.json();
            const filteredRelated = allProducts
              .filter(
                (p: Product) =>
                  p.id !== productData.id && p.category === productData.category
              )
              .slice(0, 4);
            setRelatedProducts(filteredRelated);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  useEffect(() => {
    if (product && selectedSize) {
      setQuantity(1);
    }
  }, [selectedSize, product]);

  useEffect(() => {
    if (descriptionRef.current) {
      // Check if the text is overflowing the container (which is capped at 2 lines)
      if (descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight) {
        setShowReadMore(true);
      }
    }
  }, [product?.description]);

  const handleAddToCart = () => {
    if (product && selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    }
  };

  const handleBuyNow = () => {
    if (product && selectedSize && isInStock) {
      addToCart(product, selectedSize, quantity);
      navigate("/checkout");
    }
  };

  const handleCalculateShipping = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postalCode) return;
    setIsCalculatingShipping(true);
    setShippingOptions([]);
    try {
      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode }),
      });
      const data = await response.json();
      if (data.options && data.options.length > 0) {
        setShippingOptions(data.options);
      } else {
        alert("No se encontraron opciones de envío para este código postal.");
      }
    } catch (error) {
      console.error("Error al calcular envío:", error);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanco-hueso text-gris-oscuro">
        <p>Cargando producto...</p>
      </div>
    );
  }
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanco-hueso text-gris-oscuro">
        <p>Producto no encontrado.</p>
      </div>
    );
  }

  const selectedSizeInfo = selectedSize ? product.sizes[selectedSize] : null;
  const isInStock = selectedSizeInfo?.available && selectedSizeInfo?.stock > 0;
  const maxStock = selectedSizeInfo?.stock || 0;

  return (
    <>
      <div className="bg-blanco-hueso text-gris-oscuro">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-0">
          <div className="flex flex-col lg:flex-row lg:gap-16">
            <div className="lg:w-1/2">
              <ProductMediaGallery images={product.images} />
            </div>

            <div className="lg:w-1/2 w-full lg:sticky lg:top-28 h-fit">
              <div className="py-8 lg:py-0">
                <Breadcrumbs product={product} />
                <h1 className="text-4xl font-bold tracking-tight">
                  {product.name}
                </h1>
                <p className="text-3xl font-normal mt-4 text-black">
                  ${product.price.toLocaleString("es-AR")}
                </p>

                <div className="mt-8">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm font-bold tracking-wider">TALLE</p>
                    <button
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="flex items-center gap-1 text-sm text-[#7a7a7a] hover:underline font-medium"
                    >
                      <HelpCircle size={16} />
                      Guía de talles
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {STANDARD_SIZES.map((size) => {
                      const sizeInfo = product.sizes[size];
                      const isAvailable =
                        sizeInfo?.available && sizeInfo?.stock > 0;
                      return (
                        <button
                          key={size}
                          onClick={() => isAvailable && setSelectedSize(size)}
                          disabled={!isAvailable}
                          className={`px-4 py-2 text-center border rounded-md transition-all duration-200 text-sm font-medium relative ${
                            !isAvailable
                              ? "border-arena text-arena/80 bg-blanco-hueso cursor-not-allowed line-through"
                              : selectedSize === size
                              ? "bg-black text-white border-black"
                              : "border-arena text-black hover:border-black"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || !isInStock || addedToCart}
                    className={`w-full py-2 text-sm font-bold rounded-md flex items-center justify-center transition-colors border ${
                      addedToCart
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : selectedSize && isInStock
                        ? "bg-[#333333] text-white border-[#333333] hover:opacity-90"
                        : "bg-arena/50 text-gris-oscuro/50 cursor-not-allowed border-arena"
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <CheckCircle className="mr-2" size={16} /> AGREGADO
                      </>
                    ) : (
                      "AGREGAR AL CARRITO"
                    )}
                  </button>
                </div>

                <div className="mt-3 mb-8">
                  <button
                    onClick={handleBuyNow}
                    disabled={!selectedSize || !isInStock}
                    className={`w-full py-4 text-base font-bold rounded-md flex items-center justify-center transition-opacity ${
                      selectedSize && isInStock
                        ? "bg-black hover:opacity-90 text-white"
                        : "bg-arena/50 text-gris-oscuro/50 cursor-not-allowed"
                    }`}
                  >
                    COMPRAR AHORA
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#7a7a7a]">
                    <ShieldCheck size={18} className="text-[#7a7a7a]" />
                    <span>
                      Compra <b>100% Segura</b> con Mercado Pago
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7a7a7a]">
                    <Undo2 size={18} className="text-[#7a7a7a]" />
                    <span>
                      <b>30 días</b> para cambios y devoluciones
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#7a7a7a]">
                    <Truck size={18} className="text-[#7a7a7a]" />
                    <span>
                      Envíos a <b>todo el país</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-0 pb-12">
            <div className="prose max-w-none">
              <h3 className="text-xl font-bold mb-4">Descripción</h3>
              <div className={`relative ${!isDescriptionExpanded ? 'max-h-14 overflow-hidden' : ''}`}>
                <p ref={descriptionRef}>{product.description}</p>
                {!isDescriptionExpanded && showReadMore && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-blanco-hueso to-transparent" />
                )}
              </div>
              {showReadMore && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-black font-bold mt-2"
                >
                  {isDescriptionExpanded ? 'Leer menos' : 'Leer más'}
                </button>
              )}
            </div>
          </div>
        )}

        {relatedProducts.length > 0 && (
          <section ref={relatedRef} className="pt-24 pb-12">
            <div className="container mx-auto max-w-7xl px-4">
              <h2 className="text-2xl font-bold text-center mb-12 tracking-wider">
                PRODUCTOS RELACIONADOS
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
      {isSizeGuideOpen && (
        <SizeGuideModal onClose={() => setIsSizeGuideOpen(false)} />
      )}
    </>
  );
};

export default ProductPage;
