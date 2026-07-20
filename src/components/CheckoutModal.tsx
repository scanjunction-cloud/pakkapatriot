/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CheckoutModal — full checkout flow with customer form, order summary,
 * and order submission to WooCommerce REST API (admin-only).
 * No external redirects — everything stays in the frontend app.
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  X, ArrowLeft, ArrowRight, ShoppingBag, Truck, CreditCard,
  MapPin, Phone, Mail, User, FileText, CheckCircle, Lock,
  RefreshCw, Package
} from "lucide-react";
import { CartItem, CheckoutFormData, OrderResult } from "../types";
import { useCart } from "./CartContext";
import { apiCreateOrder } from "../services/api";

interface CheckoutModalProps {
  onClose: () => void;
}

/* ─── Indian states ──────────────────────────────────────────────────────── */
const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman & Nicobar", "Chandigarh", "Dadra & Nagar Haveli",
  "Daman & Diu", "Delhi", "Jammu & Kashmir", "Ladakh",
  "Lakshadweep", "Puducherry",
];

type CheckoutStep = "review" | "shipping" | "payment" | "confirm";

export default function CheckoutModal({ onClose }: CheckoutModalProps) {
  const { state, totalPrice, totalItems, clearCart } = useCart();

  const [step, setStep] = useState<CheckoutStep>("review");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);

  /* ─── Form State ──────────────────────────────────────────────────────── */
  const [form, setForm] = useState<CheckoutFormData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    postcode: "",
    country: "IN",
    customer_note: "",
    shipping_same: true,
  });

  const updateField = <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ─── Submit Order ────────────────────────────────────────────────────── */
  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError(null);

    const line_items = state.items.map((item) => ({
      product_id: item.product.id,
      quantity: item.quantity,
      name: item.product.name,
      price: item.product.price,
      total: String(parseFloat(item.product.price) * item.quantity),
      subtotal: String(parseFloat(item.product.price) * item.quantity),
    }));

    try {
      const result = await apiCreateOrder({
        line_items,
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        address_1: form.address_1,
        address_2: form.address_2,
        city: form.city,
        state: form.state,
        postcode: form.postcode,
        country: form.country,
        customer_note: form.customer_note,
      });

      if (result.error && !result.order_id) {
        setError(result.error || "Order creation failed. Please try again.");
        setSubmitting(false);
        return;
      }

      setOrderResult(result);
      clearCart();
      setStep("confirm");
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Validation ──────────────────────────────────────────────────────── */
  const isShippingValid =
    form.first_name.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.phone.trim().length > 6 &&
    form.address_1.trim().length > 0 &&
    form.city.trim().length > 0 &&
    form.state.trim().length > 0 &&
    form.postcode.trim().length > 0;

  /* ─── Empty cart state ────────────────────────────────────────────────── */
  if (state.items.length === 0 && step !== "confirm") {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="relative bg-white max-w-md w-full rounded-3xl shadow-2xl border border-[#F0EBE0] p-8 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full cursor-pointer">
            <X size={18} />
          </button>
          <div className="py-8 space-y-4">
            <ShoppingBag size={48} className="mx-auto text-[#E4DCB9]" />
            <h3 className="font-display font-black text-xl text-[#0A2240]">Your bag is empty</h3>
            <p className="text-sm text-[#4E637A]">Add some patriotic merchandise to get started!</p>
            <button
              onClick={onClose}
              className="bg-[#EB5A12] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#D04D0E] transition-all cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step indicator ──────────────────────────────────────────────────── */
  const steps = [
    { id: "review" as const, label: "Review Bag", icon: ShoppingBag },
    { id: "shipping" as const, label: "Shipping", icon: Truck },
    { id: "payment" as const, label: "Payment", icon: CreditCard },
    { id: "confirm" as const, label: "Confirmed", icon: CheckCircle },
  ];

  const stepIndex = steps.findIndex((s) => s.id === step);

  /* ══════════════════════════════════════════════════════════════════════ */
  /*  RENDER                                                                 */
  /* ══════════════════════════════════════════════════════════════════════ */

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl border border-[#F0EBE0] max-h-[92vh] flex flex-col"
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="p-6 border-b border-[#F0EBE0] bg-[#FCFAF5] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/80 rounded-full text-[#4E637A] hover:text-[#0A2240] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <h2 className="font-display font-black text-xl text-[#0A2240]">CHECKOUT</h2>
          </div>
          {/* Step progress dots */}
          <div className="hidden sm:flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    i <= stepIndex
                      ? "bg-[#EB5A12] text-white"
                      : "bg-[#E4DCB9] text-[#8A9EB4]"
                  }`}
                >
                  {i < stepIndex ? <CheckCircle size={14} /> : <s.icon size={14} />}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-8 h-0.5 transition-colors ${
                      i < stepIndex ? "bg-[#EB5A12]" : "bg-[#E4DCB9]"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Scrollable Body ────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-grow">
          {/* ═══ STEP: Review Bag ═══ */}
          {step === "review" && (
            <div className="p-6 space-y-5">
              <h3 className="font-display font-bold text-lg text-[#0A2240] flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#EB5A12]" />
                Review Your Items
              </h3>
              <div className="space-y-3">
                {state.items.map((item) => (
                  <CartReviewItem key={item.product.id} item={item} />
                ))}
              </div>
              <div className="border-t border-[#F0EBE0] pt-4 space-y-1.5">
                <div className="flex justify-between text-sm text-[#4E637A]">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-[#0A2240]">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-[#4E637A]">
                  <span>Shipping</span>
                  <span className="font-bold text-[#587760]">India-wide free shipping</span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#0A2240] pt-2 border-t border-[#F0EBE0]">
                  <span>Total</span>
                  <span className="text-[#EB5A12]">₹{totalPrice}</span>
                </div>
              </div>
              <button
                onClick={() => setStep("shipping")}
                className="w-full bg-[#EB5A12] hover:bg-[#D04D0E] text-white py-3.5 rounded-xl font-bold text-sm shadow hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Proceed to Shipping <ArrowRight size={16} />
              </button>
            </div>
          )}

          {/* ═══ STEP: Shipping ═══ */}
          {step === "shipping" && (
            <div className="p-6 space-y-5">
              <h3 className="font-display font-bold text-lg text-[#0A2240] flex items-center gap-2">
                <Truck size={18} className="text-[#EB5A12]" />
                Shipping Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField label="First Name *" icon={User} value={form.first_name} onChange={(v) => updateField("first_name", v)} placeholder="Aarav" />
                <InputField label="Last Name" icon={User} value={form.last_name} onChange={(v) => updateField("last_name", v)} placeholder="Sharma" />
                <InputField label="Email *" icon={Mail} type="email" value={form.email} onChange={(v) => updateField("email", v)} placeholder="aarav@example.com" />
                <InputField label="Phone *" icon={Phone} type="tel" value={form.phone} onChange={(v) => updateField("phone", v)} placeholder="+91 98765 43210" />
                <div className="sm:col-span-2">
                  <InputField label="Address Line 1 *" icon={MapPin} value={form.address_1} onChange={(v) => updateField("address_1", v)} placeholder="123, Heritage Colony" />
                </div>
                <div className="sm:col-span-2">
                  <InputField label="Address Line 2" value={form.address_2} onChange={(v) => updateField("address_2", v)} placeholder="Near Gandhi Chowk (optional)" />
                </div>
                <InputField label="City *" value={form.city} onChange={(v) => updateField("city", v)} placeholder="Jaipur" />
                <div>
                  <label className="block text-xs font-black text-[#0A2240] uppercase tracking-wider mb-1.5">State *</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9EB4]" />
                    <select value={form.state} onChange={(e) => updateField("state", e.target.value)}
                      className="w-full bg-white border border-[#DCD3B5] pl-9 pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] focus:ring-1 focus:ring-[#EB5A12] appearance-none text-[#0A2240]">
                      <option value="">Select state</option>
                      {INDIAN_STATES.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                </div>
                <InputField label="PIN Code *" value={form.postcode} onChange={(v) => updateField("postcode", v)} placeholder="302001" />
                <div className="sm:col-span-2">
                  <InputField label="Order Note (optional)" icon={FileText} value={form.customer_note} onChange={(v) => updateField("customer_note", v)} placeholder="Any special instructions for delivery?" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep("review")} className="flex-1 bg-white border border-[#DCD3B5] hover:bg-[#FAF6EC] text-[#0A2240] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowLeft size={16} /> Back
                </button>
                <button onClick={() => setStep("payment")} disabled={!isShippingValid}
                  className={`flex-[2] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isShippingValid ? "bg-[#EB5A12] hover:bg-[#D04D0E] text-white shadow" : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}>
                  Continue to Payment <ArrowRight size={16} />
                </button>
              </div>
              {!isShippingValid && (
                <p className="text-xs text-[#EB5A12] font-semibold text-center">Please fill in all required fields (*)</p>
              )}
            </div>
          )}

          {/* ═══ STEP: Payment ═══ */}
          {step === "payment" && (
            <div className="p-6 space-y-5">
              <h3 className="font-display font-bold text-lg text-[#0A2240] flex items-center gap-2">
                <CreditCard size={18} className="text-[#EB5A12]" />
                Place Order
              </h3>
              <div className="bg-[#FCFAF5] border border-[#F0EBE0] rounded-2xl p-4 space-y-2">
                <h4 className="text-xs font-black text-[#587760] uppercase tracking-wider">Order Summary</h4>
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-[#4E637A]">{item.product.name} <span className="text-[#8A9EB4]">× {item.quantity}</span></span>
                    <span className="font-bold text-[#0A2240]">₹{(parseFloat(item.product.price) * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
                <div className="border-t border-[#E4DCB9] pt-2 flex justify-between font-black text-lg">
                  <span>Total</span>
                  <span className="text-[#EB5A12]">₹{totalPrice}</span>
                </div>
              </div>
              <div className="bg-[#F8FAFB] border border-[#E4DCB9] rounded-2xl p-4 text-sm space-y-1">
                <h4 className="text-xs font-black text-[#587760] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin size={12} /> Shipping to
                </h4>
                <p className="font-bold text-[#0A2240]">{form.first_name} {form.last_name}</p>
                <p className="text-[#4E637A]">{form.address_1}{form.address_2 ? `, ${form.address_2}` : ""}</p>
                <p className="text-[#4E637A]">{form.city}, {form.state} - {form.postcode}</p>
                <p className="text-[#4E637A]">{form.email} | {form.phone}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                <Package size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-green-800 leading-relaxed">
                  <span className="font-bold">Admin-managed order</span>
                  <br />
                  Your order will be recorded on PakkaPatriot. Our team will review it and reach out to you for payment and delivery.
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <p className="text-xs text-red-700 font-semibold">{error}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep("shipping")} className="flex-1 bg-white border border-[#DCD3B5] hover:bg-[#FAF6EC] text-[#0A2240] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <ArrowLeft size={16} /> Edit
                </button>
                <button onClick={handlePlaceOrder} disabled={submitting}
                  className={`flex-[2] py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    submitting ? "bg-gray-400 text-white cursor-wait" : "bg-[#EB5A12] hover:bg-[#D04D0E] text-white shadow-lg"
                  }`}>
                  {submitting ? (
                    <><RefreshCw size={16} className="animate-spin" /> Placing Order...</>
                  ) : (
                    <><Lock size={16} /> Place Order – ₹{totalPrice}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP: Confirmed ═══ */}
          {step === "confirm" && orderResult && (
            <div className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle size={40} className="text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-2xl text-[#0A2240]">Order Received! 🎉</h3>
                <p className="text-sm text-[#4E637A] font-semibold">
                  Your order <span className="font-black text-[#EB5A12]">#{orderResult.order_id}</span> has been recorded successfully.
                </p>
              </div>
              <div className="bg-[#FCFAF5] border border-[#F0EBE0] rounded-2xl p-5 max-w-sm mx-auto space-y-2 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-[#8A9EB4]">Order ID</span>
                  <span className="font-bold text-[#0A2240]">#{orderResult.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A9EB4]">Total</span>
                  <span className="font-black text-[#EB5A12]">{orderResult.currency} {orderResult.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A9EB4]">Status</span>
                  <span className="font-bold capitalize text-[#587760]">{orderResult.status}</span>
                </div>
              </div>
              <p className="text-xs text-[#4E637A] max-w-sm mx-auto leading-relaxed">
                Your order is now with the PakkaPatriot team. We'll review it and get back to you at <span className="font-bold">{form.email}</span> with payment and delivery details.
              </p>
              <div className="pt-2">
                <button onClick={onClose} className="bg-[#EB5A12] hover:bg-[#D04D0E] text-white px-8 py-3 rounded-xl font-bold text-sm shadow transition-all cursor-pointer">
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        {step !== "confirm" && (
          <div className="p-3 border-t border-[#F0EBE0] bg-[#FCFAF5] flex items-center justify-center gap-1.5 text-[10px] text-[#8A9EB4] font-bold uppercase tracking-wider flex-shrink-0">
            <Lock size={10} />
            Orders are recorded and managed by the PakkaPatriot team
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────── */

const CartReviewItem: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  return (
    <div className="flex gap-4 p-4 bg-[#FCFAF5] border border-[#F0EBE0] rounded-2xl items-center">
      <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#FAF6EC] flex-shrink-0">
        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>
      <div className="flex-grow min-w-0">
        <span className="text-[10px] font-black text-[#587760] uppercase tracking-wide block">{item.product.category}</span>
        <h4 className="font-display font-bold text-sm text-[#0A2240] truncate">{item.product.name}</h4>
        <p className="font-black text-sm text-[#EB5A12]">₹{item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center border border-[#DCD3B5] rounded-lg overflow-hidden">
          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 text-sm font-bold hover:bg-[#FAF6EC] text-[#0A2240] transition-colors cursor-pointer">−</button>
          <span className="px-2 py-1 text-sm font-bold text-[#0A2240] min-w-[24px] text-center border-x border-[#DCD3B5]">{item.quantity}</span>
          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 text-sm font-bold hover:bg-[#FAF6EC] text-[#0A2240] transition-colors cursor-pointer">+</button>
        </div>
        <button onClick={() => removeItem(item.product.id)} className="text-xs text-[#8A9EB4] hover:text-red-500 font-semibold transition-colors cursor-pointer">Remove</button>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  label: string;
  icon?: React.ComponentType<{ size: number }>;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ label, icon: Icon, type = "text", value, onChange, placeholder }) => {
  return (
    <div>
      <label className="block text-xs font-black text-[#0A2240] uppercase tracking-wider mb-1.5">{label}</label>
      <div className="relative">
        {Icon && <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9EB4]" />}
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className={`w-full bg-white border border-[#DCD3B5] ${Icon ? "pl-9" : "pl-4"} pr-4 py-2.5 rounded-xl text-sm font-semibold focus:outline-none focus:border-[#EB5A12] focus:ring-1 focus:ring-[#EB5A12] text-[#0A2240]`} />
      </div>
    </div>
  );
};
