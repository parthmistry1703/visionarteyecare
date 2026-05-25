import { useMemo, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

type DeliveryMode = "pickup" | "delivery";

type CartItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  badge: string;
  category: string;
};

const whatsappBase =
  "https://wa.me/918866778396?text=Hello%20Dr.%20Milan%20Mistry%2C%20I%20want%20to%20place%20an%20order%20from%20Visionart%20Optical%20%26%20Eyecare.";

export default function Shop() {
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>("pickup");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((product) => product.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [cart]
  );

  const orderMutation = trpc.orders.create.useMutation({
    onSuccess: (order) => {
      setLastOrderId(order.id);
      setCart([]);
      setCustomerName("");
      setPhone("");
      setEmail("");
      setNotes("");
      setDeliveryMode("pickup");
      toast.success(`Order #${order.id} placed successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "Could not place order");
    },
  });

  function addToCart(product: (typeof products)[number]) {
    setCart((current) => {
      const existing = current.find((item) => item.productId === product.id);
      if (existing) {
        return current.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [
        ...current,
        {
          productId: product.id,
          productName: product.name,
          quantity: 1,
          unitPrice: product.price,
          badge: product.badge,
          category: product.category,
        },
      ];
    });

    toast.success(`${product.name} added to cart`);
  }

  function updateQuantity(productId: number, nextQuantity: number) {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity: nextQuantity } : item
      )
    );
  }

  function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) {
      toast.error("Add at least one product to your cart");
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }

    orderMutation.mutate({
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      notes: notes.trim() || undefined,
      deliveryMode,
      items: cart.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  }

  return (
    <div className="min-h-screen bg-[#071120] text-white">
      <section className="border-b border-[rgba(255,255,255,.08)] bg-[radial-gradient(circle_at_top,rgba(46,127,194,.16),transparent_30%),linear-gradient(180deg,#071120_0%,#0b1930_100%)] px-[6%] pb-18 pt-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#e8a820]">
              Online Shop + Clinic Booking
            </p>
            <h1 className="font-serif text-5xl font-bold leading-tight text-[#f8f4ee] md:text-6xl">
              Buy Glasses Online,
              <br />
              then book your eye
              <br />
              test with us.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#a7b6cc] md:text-base">
              Explore frames, sunglasses, blue-light options, and contact lenses.
              Place an order online and coordinate fitting, pickup, or delivery
              directly with Visionart Optical &amp; Eyecare.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="/"
                className="rounded-full border border-[rgba(255,255,255,.12)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-[#e8a820] hover:text-[#e8a820]"
              >
                Back to Home
              </a>
              <a
                href={whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-[#062313] transition-transform hover:-translate-y-[2px]"
              >
                WhatsApp Dr. Milan
              </a>
            </div>
          </div>

          <div className="grid w-full max-w-[640px] grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["Products", `${products.length}+`],
              ["Cart Items", `${cart.length}`],
              ["Pickup / Delivery", "2 Options"],
              ["Support", "WhatsApp"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex min-h-[148px] flex-col justify-between rounded-[28px] border border-[rgba(255,255,255,.08)] bg-[linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.025))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,.03)]"
              >
                <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[#8aa0bf]">
                  {label}
                </div>
                <div className="mt-4 max-w-full break-words font-serif text-[1.2rem] font-bold leading-[1.12] text-[#f8f4ee] sm:text-[1.35rem]">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[6%] py-14">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <div>
            <div className="mb-6 flex flex-col gap-3 rounded-[30px] border border-[rgba(255,255,255,.07)] bg-[linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.02))] px-6 py-6 shadow-[0_18px_50px_rgba(0,0,0,.14)]">
              <div className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#e8a820]">
                Curated Collection
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#f8f4ee]">
                    Shop Frames, Sunglasses, and Lenses
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#9fb0c8]">
                    Browse a premium starter catalog and place an order directly with
                    Visionart. Use filters below to explore categories.
                  </p>
                </div>
                <div className="rounded-full border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)] px-4 py-2 text-sm font-semibold text-[#d6e1ef]">
                  {filteredProducts.length} items available
                </div>
              </div>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategory === category
                      ? "bg-[#e8a820] text-[#1b1302]"
                      : "border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.03)] text-[#c8d5e5]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-[rgba(255,255,255,.08)] bg-[rgba(255,255,255,.03)] p-8 text-center text-[#a7b6cc]">
                Loading products...
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="overflow-hidden rounded-[30px] border border-[rgba(255,255,255,.08)] bg-[linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.02))] shadow-[0_22px_55px_rgba(3,10,24,.2)] transition-transform duration-300 hover:-translate-y-[4px]"
                  >
                    <div className={`bg-gradient-to-br ${product.colorway} p-6`}>
                      <div className="mb-12 inline-flex rounded-full bg-[rgba(255,255,255,.18)] px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-white">
                        {product.badge}
                      </div>
                      <div className="font-serif text-3xl font-bold text-white">
                        {product.name}
                      </div>
                      <div className="mt-2 text-sm text-[rgba(255,255,255,.86)]">
                        {product.imageHint}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <span className="rounded-full border border-[rgba(255,255,255,.1)] px-3 py-1 text-[0.72rem] uppercase tracking-[0.14em] text-[#8aa0bf]">
                          {product.category}
                        </span>
                        <span className="font-serif text-3xl font-bold text-[#e8a820]">
                          Rs. {product.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <p className="min-h-[72px] text-sm leading-6 text-[#a7b6cc]">
                        {product.description}
                      </p>
                      <button
                        type="button"
                        onClick={() => addToCart(product)}
                        className="mt-5 w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-[#081426] transition-transform hover:-translate-y-[2px]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-[32px] border border-[rgba(255,255,255,.08)] bg-[linear-gradient(180deg,rgba(255,255,255,.055),rgba(255,255,255,.025))] p-6 shadow-[0_25px_55px_rgba(0,0,0,.22)]">
              <div className="mb-5">
                <p className="text-[0.76rem] font-semibold uppercase tracking-[0.16em] text-[#e8a820]">
                  Your Cart
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[#f8f4ee]">
                  Checkout in one place
                </h2>
              </div>

              <div className="space-y-3">
                {cart.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-[rgba(255,255,255,.14)] px-4 py-8 text-center text-sm text-[#8aa0bf]">
                    Add frames or lenses to start your order.
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-2xl border border-[rgba(255,255,255,.08)] bg-[rgba(0,0,0,.18)] p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{item.productName}</div>
                          <div className="mt-1 text-xs uppercase tracking-[0.12em] text-[#8aa0bf]">
                            {item.category} · {item.badge}
                          </div>
                        </div>
                        <div className="font-bold text-[#e8a820]">
                          Rs. {(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="h-9 w-9 rounded-full border border-[rgba(255,255,255,.12)]"
                          >
                            -
                          </button>
                          <span className="min-w-6 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="h-9 w-9 rounded-full border border-[rgba(255,255,255,.12)]"
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, 0)}
                          className="text-sm font-semibold text-[#ff9aa4]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-2xl bg-[rgba(255,255,255,.05)] px-4 py-4">
                <span className="text-sm uppercase tracking-[0.14em] text-[#8aa0bf]">
                  Subtotal
                </span>
                <span className="font-serif text-3xl font-bold text-[#e8a820]">
                  Rs. {subtotal.toLocaleString("en-IN")}
                </span>
              </div>

              <form onSubmit={submitOrder} className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Customer Name</label>
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] px-4 py-3 text-white outline-none"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Phone Number</label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] px-4 py-3 text-white outline-none"
                    placeholder="+91 98xxxxxxx"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] px-4 py-3 text-white outline-none"
                    placeholder="Optional email"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Delivery Mode</label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      ["pickup", "Store Pickup"],
                      ["delivery", "Home Delivery"],
                    ] as const).map(([value, label]) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setDeliveryMode(value)}
                        className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                          deliveryMode === value
                            ? "bg-[#e8a820] text-[#1b1302]"
                            : "border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.03)] text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Notes</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full rounded-2xl border border-[rgba(255,255,255,.1)] bg-[rgba(255,255,255,.04)] px-4 py-3 text-white outline-none"
                    placeholder="Prescription details, frame color, or delivery instructions"
                  />
                </div>

                <button
                  type="submit"
                  disabled={orderMutation.isPending || cart.length === 0}
                  className="w-full rounded-2xl bg-gradient-to-r from-[#2e7fc2] to-[#4a9e5c] px-5 py-3 text-sm font-bold text-white disabled:opacity-50"
                >
                  {orderMutation.isPending ? "Placing Order..." : "Place Order"}
                </button>
              </form>

              <a
                href={whatsappBase}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block rounded-2xl border border-[rgba(37,211,102,.35)] bg-[rgba(37,211,102,.12)] px-5 py-3 text-center text-sm font-bold text-[#8ff1b6]"
              >
                Ask Product Questions on WhatsApp
              </a>

              {lastOrderId ? (
                <div className="mt-5 rounded-2xl border border-[rgba(74,158,92,.24)] bg-[rgba(74,158,92,.12)] px-4 py-4 text-sm text-[#d6f9df]">
                  Order #{lastOrderId} saved successfully. You can now review it
                  in the admin dashboard.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
