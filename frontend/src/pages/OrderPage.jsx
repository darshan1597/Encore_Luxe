import React, { useState, useMemo } from "react";

// OrdersPage.jsx
// Single-file React component using TailwindCSS (no TypeScript).
// Features:
// - Filter tabs (All / Processing / Shipped / Delivered / Cancelled)
// - Search (by order id, customer, or product)
// - Sort by date/amount
// - Responsive table + mobile cards
// - Order detail drawer
// - Simple pagination (client-side)

const MOCK_ORDERS = [
  {
    id: "ORD-1001",
    customer: "Aisha Kumar",
    date: "2025-10-08",
    amount: 1299.0,
    status: "Processing",
    items: [
      { sku: "JKT-001", name: "Men's Leather Bomber", qty: 1, price: 1299 },
    ],
    shipping: { address: "Bengaluru, KA, India", method: "Standard" },
  },
  {
    id: "ORD-1002",
    customer: "Ravi Patel",
    date: "2025-09-29",
    amount: 2599.5,
    status: "Shipped",
    items: [
      { sku: "JKT-003", name: "Unisex Puffer Jacket", qty: 2, price: 1299.75 },
    ],
    shipping: { address: "Mysuru, KA, India", method: "Express" },
  },
  {
    id: "ORD-1003",
    customer: "Sneha Rao",
    date: "2025-08-11",
    amount: 3499.0,
    status: "Delivered",
    items: [
      { sku: "JKT-002", name: "Women's Woolen Coat", qty: 1, price: 3499 },
    ],
    shipping: { address: "Hubli, KA, India", method: "Standard" },
  },
  {
    id: "ORD-1004",
    customer: "Karan Mehta",
    date: "2025-10-12",
    amount: 899.0,
    status: "Cancelled",
    items: [
      { sku: "JKT-007", name: "Lightweight Packable Jacket", qty: 1, price: 899 },
    ],
    shipping: { address: "Udupi, KA, India", method: "Standard" },
  },
];

const STATUSES = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

function formatDate(d) {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString();
  } catch (e) {
    return d;
  }
}

function statusBadge(status) {
  const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
  switch (status) {
    case "Processing":
      return <span className={`${base} bg-yellow-100 text-yellow-800`}>{status}</span>;
    case "Shipped":
      return <span className={`${base} bg-blue-100 text-blue-800`}>{status}</span>;
    case "Delivered":
      return <span className={`${base} bg-green-100 text-green-800`}>{status}</span>;
    case "Cancelled":
      return <span className={`${base} bg-red-100 text-red-800`}>{status}</span>;
    default:
      return <span className={`${base} bg-gray-100 text-gray-800`}>{status}</span>;
  }
}

export default function OrdersPage() {
  const [orders] = useState(MOCK_ORDERS);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date_desc");
  const [page, setPage] = useState(1);
  const [perPage] = useState(6);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = useMemo(() => {
    let list = [...orders];

    if (statusFilter !== "All") {
      list = list.filter((o) => o.status === statusFilter);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customer.toLowerCase().includes(q) ||
          o.items.some((it) => it.name.toLowerCase().includes(q))
      );
    }

    if (sortBy === "date_desc") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortBy === "date_asc") {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortBy === "amount_desc") {
      list.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === "amount_asc") {
      list.sort((a, b) => a.amount - b.amount);
    }

    return list;
  }, [orders, statusFilter, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  function openOrder(order) {
    setSelectedOrder(order);
    // keep page scroll locked if needed
    document.body.style.overflow = "hidden";
  }

  function closeOrder() {
    setSelectedOrder(null);
    document.body.style.overflow = "auto";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Orders</h1>
            <p className="text-sm text-gray-500">Manage orders, view details and update statuses.</p>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center border rounded-md overflow-hidden bg-white">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 w-64 text-sm outline-none"
                placeholder="Search by order, customer or product"
              />
              <button
                onClick={() => setQuery("")}
                className="px-3 border-l text-sm text-gray-600 hover:bg-gray-100"
                aria-label="clear"
              >
                Clear
              </button>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm rounded-md border bg-white"
            >
              <option value="date_desc">Newest</option>
              <option value="date_asc">Oldest</option>
              <option value="amount_desc">Amount: High - Low</option>
              <option value="amount_asc">Amount: Low - High</option>
            </select>
          </div>
        </header>

        <nav className="mb-4">
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-md text-sm font-medium ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white"
                    : "bg-white border text-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </nav>

        <main>
          {/* Desktop table */}
          <div className="hidden md:block bg-white shadow-sm rounded-md">
            <table className="min-w-full divide-y">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageData.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{o.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(o.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{o.items.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">₹{o.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{statusBadge(o.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => openOrder(o)}
                        className="inline-flex items-center px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-50"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}

                {pageData.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">Showing {filtered.length} orders</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded-md text-sm"
                  disabled={page === 1}
                >
                  Prev
                </button>
                <div className="text-sm">{page} / {totalPages}</div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 border rounded-md text-sm"
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Mobile list */}
          <div className="md:hidden space-y-3">
            {pageData.map((o) => (
              <div key={o.id} className="bg-white shadow-sm rounded-md p-4 flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium text-gray-800">{o.id}</div>
                    <div>{statusBadge(o.status)}</div>
                  </div>
                  <div className="text-sm text-gray-600">{o.customer}</div>
                  <div className="text-xs text-gray-500 mt-1">{formatDate(o.date)} • {o.items.length} item(s)</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold">₹{o.amount.toFixed(2)}</div>
                  <button
                    onClick={() => openOrder(o)}
                    className="mt-2 px-3 py-1 rounded-md text-sm border bg-white"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}

            {pageData.length === 0 && (
              <div className="text-center text-sm text-gray-500">No orders found.</div>
            )}

            {/* Mobile pagination */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border rounded-md text-sm"
                disabled={page === 1}
              >
                Prev
              </button>
              <div className="text-sm">{page} / {totalPages}</div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border rounded-md text-sm"
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Drawer / Modal for order details */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={closeOrder} />
          <aside className="relative ml-auto w-full max-w-2xl bg-white h-full shadow-xl overflow-auto">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Order {selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.customer} • {formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <button onClick={closeOrder} className="px-3 py-1 rounded-md border">Close</button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="text-sm text-gray-500">Shipping</div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="text-sm">{selectedOrder.shipping.address}</div>
                    <div className="text-xs text-gray-500">{selectedOrder.shipping.method}</div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">Items</div>
                  <div className="space-y-2">
                    {selectedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 border rounded-md bg-white flex justify-between items-center">
                        <div>
                          <div className="text-sm font-medium">{it.name}</div>
                          <div className="text-xs text-gray-500">SKU: {it.sku}</div>
                        </div>
                        <div className="text-sm">{it.qty} × ₹{it.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm text-gray-500">Summary</div>
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex justify-between text-sm text-gray-700">
                      <div>Subtotal</div>
                      <div>₹{(selectedOrder.amount).toFixed(2)}</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700 mt-2">
                      <div>Shipping</div>
                      <div>₹0.00</div>
                    </div>
                    <div className="flex justify-between text-sm font-semibold mt-3">
                      <div>Total</div>
                      <div>₹{selectedOrder.amount.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">Status</div>
                  <div className="flex items-center gap-3">
                    {statusBadge(selectedOrder.status)}
                    <select className="px-3 py-1 rounded-md border bg-white text-sm" defaultValue={selectedOrder.status} onChange={(e) => {
                      // Note: in this mock component we don't update the main dataset.
                      // Integrate with your API to POST status changes.
                      alert(`Change status to ${e.target.value} (connect to API)`);
                    }}>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md">Open in Admin</button>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-right">
                <button onClick={closeOrder} className="px-4 py-2 border rounded-md mr-3">Close</button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md">Print / Invoice</button>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
