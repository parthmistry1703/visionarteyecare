import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminView = "appointments" | "orders" | "products";
type ProductCategory =
  | "Eyeglasses"
  | "Sunglasses"
  | "Contact Lenses"
  | "Blue Light"
  | "Kids";

type ProductForm = {
  id: number | null;
  name: string;
  category: ProductCategory;
  description: string;
  price: string;
  badge: string;
  imageHint: string;
  featured: boolean;
  inStock: boolean;
};

const emptyProductForm: ProductForm = {
  id: null,
  name: "",
  category: "Eyeglasses",
  description: "",
  price: "",
  badge: "",
  imageHint: "",
  featured: false,
  inStock: true,
};

export default function AdminDashboard() {
  const [view, setView] = useState<AdminView>("appointments");
  const [productForm, setProductForm] = useState<ProductForm>(emptyProductForm);

  const appointmentsQuery = trpc.appointments.list.useQuery();
  const ordersQuery = trpc.orders.list.useQuery();
  const productsQuery = trpc.products.list.useQuery();

  const refreshAll = async () => {
    await Promise.all([
      appointmentsQuery.refetch(),
      ordersQuery.refetch(),
      productsQuery.refetch(),
    ]);
  };

  const updateAppointmentStatusMutation = trpc.appointments.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success("Appointment status updated");
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update appointment");
    },
  });

  const deleteAppointmentMutation = trpc.appointments.delete.useMutation({
    onSuccess: async () => {
      toast.success("Appointment deleted");
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete appointment");
    },
  });

  const updateOrderStatusMutation = trpc.orders.updateStatus.useMutation({
    onSuccess: async () => {
      toast.success("Order status updated");
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order");
    },
  });

  const deleteOrderMutation = trpc.orders.delete.useMutation({
    onSuccess: async () => {
      toast.success("Order deleted");
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete order");
    },
  });

  const createProductMutation = trpc.products.create.useMutation({
    onSuccess: async () => {
      toast.success("Product added");
      setProductForm(emptyProductForm);
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add product");
    },
  });

  const updateProductMutation = trpc.products.update.useMutation({
    onSuccess: async () => {
      toast.success("Product updated");
      setProductForm(emptyProductForm);
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  const deleteProductMutation = trpc.products.delete.useMutation({
    onSuccess: async () => {
      toast.success("Product deleted");
      if (productForm.id !== null) {
        setProductForm(emptyProductForm);
      }
      await refreshAll();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const appointments = appointmentsQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const isLoading =
    appointmentsQuery.isLoading || ordersQuery.isLoading || productsQuery.isLoading;

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "pending").length,
    [orders]
  );
  const pendingAppointments = useMemo(
    () => appointments.filter((item) => item.status === "pending").length,
    [appointments]
  );

  function resetProductForm() {
    setProductForm(emptyProductForm);
  }

  function loadProductIntoForm(product: (typeof products)[number]) {
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: String(product.price),
      badge: product.badge,
      imageHint: product.imageHint,
      featured: product.featured,
      inStock: product.inStock,
    });
    setView("products");
  }

  function submitProductForm(e: React.FormEvent) {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.description.trim() || !productForm.price) {
      toast.error("Name, price, and description are required");
      return;
    }

    const payload = {
      name: productForm.name.trim(),
      category: productForm.category,
      description: productForm.description.trim(),
      price: Number(productForm.price),
      badge: productForm.badge.trim() || undefined,
      imageHint: productForm.imageHint.trim() || undefined,
      featured: productForm.featured,
      inStock: productForm.inStock,
    };

    if (Number.isNaN(payload.price) || payload.price <= 0) {
      toast.error("Enter a valid product price");
      return;
    }

    if (productForm.id === null) {
      createProductMutation.mutate(payload);
      return;
    }

    updateProductMutation.mutate({
      id: productForm.id,
      ...payload,
    });
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">
              Visionart Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage online products, orders, and clinic appointments from one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="/shop"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Open Shop
            </a>
            <a
              href="/"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground"
            >
              Open Home
            </a>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-5">
          {[
            ["Appointments", `${appointments.length}`],
            ["Orders", `${orders.length}`],
            ["Products", `${products.length}`],
            ["Pending Orders", `${pendingOrders}`],
            ["Pending Appointments", `${pendingAppointments}`],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="p-6">
                <div className="text-sm text-muted-foreground">{label}</div>
                <div className="mt-2 text-3xl font-bold">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {([
            ["appointments", "Appointments"],
            ["orders", "Orders"],
            ["products", "Products"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setView(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                view === value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-background text-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : view === "appointments" ? (
          <Card>
            <CardHeader>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>{appointments.length} appointment request(s)</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date/Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id}>
                          <TableCell className="font-medium">
                            {appointment.name}
                            <div className="text-xs text-muted-foreground">
                              {appointment.email || "No email"}
                            </div>
                          </TableCell>
                          <TableCell>{appointment.phone}</TableCell>
                          <TableCell>{appointment.service}</TableCell>
                          <TableCell>
                            {appointment.preferredDateTime
                              ? new Date(appointment.preferredDateTime).toLocaleString()
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={appointment.status}
                              onValueChange={(value) =>
                                updateAppointmentStatusMutation.mutate({
                                  id: appointment.id,
                                  status: value as
                                    | "pending"
                                    | "confirmed"
                                    | "completed"
                                    | "cancelled",
                                })
                              }
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="max-w-xs whitespace-normal text-sm text-muted-foreground">
                            {appointment.message || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm("Delete this appointment?")) {
                                  deleteAppointmentMutation.mutate({ id: appointment.id });
                                }
                              }}
                              disabled={deleteAppointmentMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No appointments yet
                </div>
              )}
            </CardContent>
          </Card>
        ) : view === "orders" ? (
          <Card>
            <CardHeader>
              <CardTitle>Online Orders</CardTitle>
              <CardDescription>{orders.length} order(s) placed online</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Mode</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                            <div className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{order.customerName}</div>
                            <div className="text-xs text-muted-foreground">{order.phone}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.email || "No email"}
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{order.deliveryMode}</TableCell>
                          <TableCell className="max-w-xs whitespace-normal text-sm">
                            {order.items.map((item) => (
                              <div key={`${order.id}-${item.productId}`}>
                                {item.productName} x {item.quantity}
                              </div>
                            ))}
                          </TableCell>
                          <TableCell>Rs. {order.subtotal.toLocaleString("en-IN")}</TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                updateOrderStatusMutation.mutate({
                                  id: order.id,
                                  status: value as
                                    | "pending"
                                    | "confirmed"
                                    | "processing"
                                    | "ready"
                                    | "shipped"
                                    | "delivered"
                                    | "cancelled",
                                })
                              }
                            >
                              <SelectTrigger className="w-36">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="ready">Ready</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="max-w-xs whitespace-normal text-sm text-muted-foreground">
                            {order.notes || "-"}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                if (confirm("Delete this order?")) {
                                  deleteOrderMutation.mutate({ id: order.id });
                                }
                              }}
                              disabled={deleteOrderMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No orders yet</div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.05fr_.95fr]">
            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>Manage your online glasses and lens catalog</CardDescription>
              </CardHeader>
              <CardContent>
                {products.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Featured</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">
                              {product.name}
                              <div className="text-xs text-muted-foreground">
                                {product.badge || "In Store"}
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>Rs. {product.price.toLocaleString("en-IN")}</TableCell>
                            <TableCell>{product.inStock ? "In Stock" : "Out of Stock"}</TableCell>
                            <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => loadProductIntoForm(product)}
                                >
                                  <Pencil size={16} />
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm("Delete this product?")) {
                                      deleteProductMutation.mutate({ id: product.id });
                                    }
                                  }}
                                  disabled={deleteProductMutation.isPending}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No products yet
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{productForm.id === null ? "Add Product" : "Edit Product"}</CardTitle>
                <CardDescription>
                  Create a new product or update an existing one for the shop page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submitProductForm} className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Product Name</label>
                    <input
                      value={productForm.name}
                      onChange={(e) =>
                        setProductForm((current) => ({ ...current, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2"
                      placeholder="Premium rimless frame"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Category</label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) =>
                        setProductForm((current) => ({
                          ...current,
                          category: value as ProductCategory,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Eyeglasses">Eyeglasses</SelectItem>
                        <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                        <SelectItem value="Contact Lenses">Contact Lenses</SelectItem>
                        <SelectItem value="Blue Light">Blue Light</SelectItem>
                        <SelectItem value="Kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Price (INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm((current) => ({ ...current, price: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2"
                      placeholder="2999"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Badge</label>
                    <input
                      value={productForm.badge}
                      onChange={(e) =>
                        setProductForm((current) => ({ ...current, badge: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2"
                      placeholder="Best Seller"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Short Display Hint</label>
                    <input
                      value={productForm.imageHint}
                      onChange={(e) =>
                        setProductForm((current) => ({ ...current, imageHint: e.target.value }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2"
                      placeholder="Lightweight premium finish"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">Description</label>
                    <textarea
                      rows={4}
                      value={productForm.description}
                      onChange={(e) =>
                        setProductForm((current) => ({
                          ...current,
                          description: e.target.value,
                        }))
                      }
                      className="w-full rounded-xl border border-border bg-background px-3 py-2"
                      placeholder="Describe the frame, lens, or product..."
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-3">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(e) =>
                          setProductForm((current) => ({
                            ...current,
                            featured: e.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm font-medium">Show as featured</span>
                    </label>
                    <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-3">
                      <input
                        type="checkbox"
                        checked={productForm.inStock}
                        onChange={(e) =>
                          setProductForm((current) => ({
                            ...current,
                            inStock: e.target.checked,
                          }))
                        }
                      />
                      <span className="text-sm font-medium">In stock</span>
                    </label>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={
                        createProductMutation.isPending || updateProductMutation.isPending
                      }
                    >
                      {productForm.id === null ? (
                        <>
                          <Plus size={16} />
                          <span className="ml-2">Add Product</span>
                        </>
                      ) : (
                        "Save Product"
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetProductForm}>
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
