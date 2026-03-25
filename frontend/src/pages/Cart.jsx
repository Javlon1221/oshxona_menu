import React, { useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateQuantity, clearCart } from '../redux/features/cartSlice';
import { useCreateOrder } from '../api/hooks/useOrders';

const fallbackUrl = 'https://static.vecteezy.com/system/resources/previews/009/291/628/original/restaurant-logo-design-vector.jpg';

const formatCurrency = (value) => {
  const v = Number(value) || 0;
  return new Intl.NumberFormat('uz-UZ', { maximumFractionDigits: 0 }).format(v);
};

const Cart = () => {
  const { items: storeItems, totalAmount: storeTotalAmount, totalQuantity } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createOrderMutation = useCreateOrder();

  const [paymentType, setPaymentType] = useState('naqd');

  const items = useMemo(() => (Array.isArray(storeItems) ? storeItems : []), [storeItems]);

  const computedTotals = useMemo(() => {
    let amount = 0;
    let qty = 0;
    for (const it of items) {
      const price = Number(it.narxi) || 0;
      const q = Number(it.quantity) || 0;
      amount += price * q;
      qty += q;
    }
    return { amount, qty };
  }, [items]);

  const totalAmount = Number(storeTotalAmount) || computedTotals.amount;
  const totalQty = totalQuantity || computedTotals.qty;

  const handleQuantityChange = (recipeId, newQuantity) => {
    const q = Number(newQuantity) || 0;
    if (q <= 0) {
      dispatch(removeFromCart(recipeId));
    } else {
      dispatch(updateQuantity({ recipeId, quantity: q }));
    }
  };

  const handleRemoveItem = (recipeId) => {
    dispatch(removeFromCart(recipeId));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/cart')}`);
      return;
    }

    if (createOrderMutation?.isLoading) return;

    // Backend structure ga mos formatda payload tayyorlash
    const orderItems = items.map(item => ({
      ovqat_id: Number(item.id), // Backend ovqat_id kutmoqda
      miqdor: Number(item.quantity) || 1,
    }));

    const orderData = {
      items: orderItems,
      tolov_turi: paymentType, // 'naqd' yoki 'karta'
    };

    try {
      await createOrderMutation.mutateAsync(orderData);
      
      dispatch(clearCart());
      navigate('/profile');
    } catch (error) {
      const message = error?.response?.data?.message || 
                     error?.message || 
                     'Buyurtma yuborishda xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.';
      alert(message);
      console.error('Order creation failed:', error);
    }
  };

  if (!items.length) {
    return (
      <div className="min-h-screen bg-[color:var(--brand-bg)] flex items-center justify-center p-6">
        <div className="text-center max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-black/10">
          <div className="w-32 h-32 bg-[color:var(--brand-accent)]/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse border border-black/10">
            <svg className="w-16 h-16 text-[color:var(--brand-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[color:var(--brand-primary)] mb-3 tracking-tight">Savatcha bo'sh</h2>
          <p className="text-black/70 mb-8 text-lg">Hozircha savatchangizda hech narsa yo'q</p>
          <Link
            to="/menu"
            className="inline-block bg-[color:var(--brand-accent)] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl transform transition-all duration-300"
          >
            🍽️ Menyuni ko'rish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--brand-bg)] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-[color:var(--brand-primary)] mb-3 tracking-tight">
            🛒 Savatcha
          </h1>
          <p className="text-black/70 text-lg">Buyurtmangizni yakunlang</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-black/10 overflow-hidden">
              <div className="px-6 py-5 bg-white/60 border-b border-black/10 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-bold text-[color:var(--brand-primary)]">
                  📦 Buyurtma ({totalQty} ta mahsulot)
                </h2>
                <button
                  onClick={() => dispatch(clearCart())}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 hover:underline transition-all"
                >
                  🗑️ Savatchani tozalash
                </button>
              </div>

              <div className="divide-y divide-black/10">
                {items.map((item) => {
                  const price = Number(item.narxi) || 0;
                  const q = Number(item.quantity) || 0;
                  const subTotal = price * q;
                  return (
                    <div key={item.id} className="px-6 py-6 hover:bg-black/5 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="relative group">
                          <img
                            src={item.image_path || fallbackUrl}
                            alt={item.ovqat_nomi || 'Ovqat rasmi'}
                            className="w-full sm:w-24 sm:h-24 object-cover rounded-2xl shadow-lg group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = fallbackUrl;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all"></div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-[color:var(--brand-primary)] mb-1">{item.ovqat_nomi}</h3>
                          <p className="text-[color:var(--brand-accent)] font-semibold text-sm">
                            💰 {formatCurrency(price)} so'm / dona
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-center gap-3">
                          <button
                            onClick={() => handleQuantityChange(item.id, q - 1)}
                            aria-label={`Kamaytirish ${item.ovqat_nomi}`}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-xl font-bold text-gray-800 transition-all shadow-md hover:shadow-lg active:scale-95"
                          >
                            −
                          </button>

                          <input
                            type="number"
                            min="1"
                            value={q}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            className="w-16 text-center font-bold text-[color:var(--brand-text)] text-lg border border-black/15 bg-white rounded-xl px-2 py-1 focus:border-[color:var(--brand-accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/25"
                            aria-label={`Miqdor ${item.ovqat_nomi}`}
                          />

                          <button
                            onClick={() => handleQuantityChange(item.id, q + 1)}
                            aria-label={`Ko'paytirish ${item.ovqat_nomi}`}
                            className="w-10 h-10 rounded-xl bg-[color:var(--brand-accent)] hover:bg-[#F25F2F] text-xl font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right sm:min-w-[130px]">
                          <p className="text-xl font-black text-[color:var(--brand-text)] mb-1">
                            {formatCurrency(subTotal)} so'm
                          </p>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 text-sm font-semibold hover:text-red-700 hover:underline transition-colors"
                            aria-label={`O'chirish ${item.ovqat_nomi}`}
                          >
                            ✕ O'chirish
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-black/10 p-6 sm:p-7 sticky top-6">
              <h2 className="text-2xl font-black text-[color:var(--brand-primary)] mb-6 text-center">📋 Buyurtma xulosasi</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-3 border-b border-black/10">
                  <span className="text-black/70 font-medium">Mahsulotlar ({totalQty} ta)</span>
                  <span className="font-bold text-[color:var(--brand-text)]">{formatCurrency(totalAmount)} so'm</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-black/10">
                  <span className="text-black/70 font-medium">Yetkazib berish</span>
                  <span className="font-bold text-green-600">✓ Bepul</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-[color:var(--brand-primary)]/10 rounded-2xl px-4 border border-black/10">
                  <span className="text-xl font-black text-[color:var(--brand-primary)]">Jami</span>
                  <span className="text-2xl font-black text-[color:var(--brand-primary)]">
                    {formatCurrency(totalAmount)} so'm
                  </span>
                </div>
              </div>

              {/* Payment type */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-black/70 mb-3">💳 To'lov turi</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`cursor-pointer px-4 py-3 rounded-xl border-2 font-semibold text-center transition-all ${
                    paymentType === 'karta' 
                      ? 'border-[color:var(--brand-accent)] bg-[color:var(--brand-accent)]/10 text-[color:var(--brand-primary)] shadow-md' 
                      : 'border-black/15 bg-white text-black/70 hover:border-[color:var(--brand-accent)]/60'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="karta"
                      checked={paymentType === 'karta'}
                      onChange={() => setPaymentType('karta')}
                      className="sr-only"
                      aria-label="Karta bilan to'lash"
                    />
                    💳 Karta
                  </label>
                  <label className={`cursor-pointer px-4 py-3 rounded-xl border-2 font-semibold text-center transition-all ${
                    paymentType === 'naqd' 
                      ? 'border-[color:var(--brand-accent)] bg-[color:var(--brand-accent)]/10 text-[color:var(--brand-primary)] shadow-md' 
                      : 'border-black/15 bg-white text-black/70 hover:border-[color:var(--brand-accent)]/60'
                  }`}>
                    <input
                      type="radio"
                      name="paymentType"
                      value="naqd"
                      checked={paymentType === 'naqd'}
                      onChange={() => setPaymentType('naqd')}
                      className="sr-only"
                      aria-label="Naqt pul bilan to'lash"
                    />
                    💵 Naqd
                  </label>
                </div>
              </div>

              {isAuthenticated ? (
                <button
                  onClick={handleCheckout}
                  disabled={createOrderMutation?.isLoading}
                  className={`w-full bg-[color:var(--brand-accent)] text-white py-4 rounded-2xl font-black text-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-2xl ${
                    createOrderMutation?.isLoading ? 'opacity-60 cursor-not-allowed' : ''
                  }`}
                >
                  {createOrderMutation?.isLoading ? '⏳ Buyurtma berilmoqda...' : '✅ Buyurtma berish'}
                </button>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-black/70 text-center font-medium">
                    🔒 Buyurtma berish uchun tizimga kiring
                  </p>
                  <Link
                    to={`/login?redirect=${encodeURIComponent('/cart')}`}
                    className="block w-full bg-[color:var(--brand-accent)] text-white text-center py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  >
                    🔑 Kirish
                  </Link>
                </div>
              )}

              <Link
                to="/menu"
                className="block w-full text-center mt-5 text-[color:var(--brand-primary)] font-bold hover:opacity-90 transition-colors text-lg"
              >
                ← Menyuga qaytish
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
