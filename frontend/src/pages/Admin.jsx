import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Users,
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  TriangleAlert,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { useGetRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from '../api/hooks/useRecipe';
import { useGetOrders, useUpdateOrderStatus } from '../api/hooks/useOrders';
import { useGetUsers } from '../api/hooks/useFoydalanuvchi';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const STATUS_CONFIG = {
  yangi: { label: 'Kutilmoqda', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Clock3 },
  jarayonda: { label: 'Tayyorlanmoqda', color: 'bg-sky-100 text-sky-800 border-sky-200', icon: UtensilsCrossed },
  tayyor: { label: 'Tayyor', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: CheckCircle2 },
  yetkazildi: { label: 'Yetkazildi', color: 'bg-violet-100 text-violet-800 border-violet-200', icon: Truck },
  bekor_qilindi: { label: 'Bekor qilingan', color: 'bg-rose-100 text-rose-800 border-rose-200', icon: XCircle }
};

const FALLBACK_RECIPE_IMG = 'https://static.vecteezy.com/system/resources/previews/009/291/628/original/restaurant-logo-design-vector.jpg';

const INITIAL_RECIPE_FORM = {
  ovqat_nomi: '',
  tayyorlanish_vaqti: '',
  masalliqlar: '',
  narxi: '',
  image_path: '',
  tavsif: ''
};

const normalizeText = (value) => String(value || '').toLowerCase();

const Admin = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeForm, setRecipeForm] = useState(INITIAL_RECIPE_FORM);
  const [recipeImageFile, setRecipeImageFile] = useState(null);
  const [imagePreviewSrc, setImagePreviewSrc] = useState('');

  const { data: recipes, isLoading: recipesLoading, error: recipesError } = useGetRecipes();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetOrders();
  const { data: users, isLoading: usersLoading, error: usersError } = useGetUsers();

  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const setPreviewUrl = useCallback((nextUrl) => {
    setImagePreviewSrc((prev) => {
      if (prev && prev.startsWith('blob:')) {
        URL.revokeObjectURL(prev);
      }
      return nextUrl || '';
    });
  }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewSrc && imagePreviewSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewSrc);
      }
    };
  }, [imagePreviewSrc]);

  useEffect(() => {
    if (!isRecipeModalOpen) {
      setEditingRecipe(null);
      setRecipeForm(INITIAL_RECIPE_FORM);
      setRecipeImageFile(null);
      setPreviewUrl('');
    }
  }, [isRecipeModalOpen, setPreviewUrl]);

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!recipeForm.ovqat_nomi.trim()) {
        alert('Iltimos, taom nomini kiriting');
        return;
      }

      const narx = Number(recipeForm.narxi);
      if (!narx || narx <= 0 || !Number.isFinite(narx)) {
        alert("Iltimos, to'g'ri narx kiriting");
        return;
      }

      const recipeData = {
        ovqat_nomi: recipeForm.ovqat_nomi.trim(),
        tayyorlanish_vaqti: recipeForm.tayyorlanish_vaqti || '',
        masalliqlar: recipeForm.masalliqlar || '',
        narxi: narx,
        image_path: recipeForm.image_path.trim() || '',
        image_file: recipeImageFile || undefined,
        tavsif: recipeForm.tavsif || ''
      };

      if (editingRecipe?.id) {
        await updateRecipeMutation.mutateAsync({ id: editingRecipe.id, ...recipeData });
      } else {
        await createRecipeMutation.mutateAsync(recipeData);
      }

      setIsRecipeModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.userMessage || "Taomni saqlashda xato yuz berdi.";
      alert(errorMessage);
    }
  };

  const handleEditRecipe = useCallback((recipe) => {
    setEditingRecipe(recipe);
    setRecipeForm({
      ovqat_nomi: recipe.ovqat_nomi || '',
      tayyorlanish_vaqti: recipe.tayyorlanish_vaqti || '',
      masalliqlar: recipe.masalliqlar || '',
      narxi: recipe.narxi != null ? String(recipe.narxi) : '',
      image_path: recipe.image_path || '',
      tavsif: recipe.tavsif || ''
    });
    setRecipeImageFile(null);
    setPreviewUrl(recipe.image_path || '');
    setIsRecipeModalOpen(true);
  }, [setPreviewUrl]);

  const handleImageFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        alert('Faqat rasm fayl tanlang (jpg, png, webp va h.k.)');
        e.target.value = '';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Rasm hajmi 5MB dan oshmasligi kerak');
        e.target.value = '';
        return;
      }

      setRecipeImageFile(file);
      setRecipeForm((prev) => ({ ...prev, image_path: '' }));
      setPreviewUrl(URL.createObjectURL(file));
    },
    [setPreviewUrl]
  );

  const handleDeleteRecipe = async (id, name) => {
    if (!window.confirm(`"${name}" taomini o'chirishni tasdiqlaysizmi?\nBu amalni ortga qaytarib bo'lmaydi.`)) return;
    try {
      await deleteRecipeMutation.mutateAsync(id);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.userMessage || "O'chirishda xatolik yuz berdi.";
      alert(errorMessage);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, holat: newStatus });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.userMessage || 'Holatni yangilashda xato yuz berdi.';
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return dateString;
    return d.toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => `${new Intl.NumberFormat('uz-UZ').format(Number(amount) || 0)} so'm`;

  const search = normalizeText(searchTerm);

  const filteredRecipes = useMemo(
    () =>
      (recipes || []).filter((r) => {
        const ovqatNomi = normalizeText(r.ovqat_nomi);
        const masalliqlar = normalizeText(r.masalliqlar);
        const tavsif = normalizeText(r.tavsif);
        return ovqatNomi.includes(search) || masalliqlar.includes(search) || tavsif.includes(search);
      }),
    [recipes, search]
  );

  const filteredOrders = useMemo(
    () =>
      (orders || []).filter((o) => {
        const ovqatNomi = normalizeText(o.ovqat_nomi);
        const ism = normalizeText(o.foydalanuvchi_ism);
        const telefon = String(o.foydalanuvchi_telefon || '');
        return ovqatNomi.includes(search) || ism.includes(search) || telefon.includes(searchTerm);
      }),
    [orders, search, searchTerm]
  );

  const filteredUsers = useMemo(
    () =>
      (users || []).filter((u) => {
        const ism = normalizeText(u.ism);
        const telefon = String(u.telefon || '');
        const manzil = normalizeText(u.manzil);
        return ism.includes(search) || telefon.includes(searchTerm) || manzil.includes(search);
      }),
    [users, search, searchTerm]
  );

  const creating = createRecipeMutation.isLoading || createRecipeMutation.isPending;
  const updating = updateRecipeMutation.isLoading || updateRecipeMutation.isPending;
  const deleting = deleteRecipeMutation.isLoading || deleteRecipeMutation.isPending;
  const updatingOrder = updateOrderStatusMutation.isLoading || updateOrderStatusMutation.isPending;
  const handleRecipeModalClose = useCallback(() => {
    if (creating || updating) return;
    setIsRecipeModalOpen(false);
  }, [creating, updating]);

  const stats = useMemo(
    () => ({
      recipes: recipes?.length || 0,
      orders: orders?.length || 0,
      users: users?.length || 0,
      revenue: orders?.reduce((sum, o) => sum + (Number(o.umumiy_summa) || 0), 0) || 0,
      pendingOrders: orders?.filter((o) => o.holat === 'yangi').length || 0,
      activeOrders: orders?.filter((o) => o.holat === 'jarayonda').length || 0
    }),
    [recipes, orders, users]
  );

  const tabs = [
    { id: 'recipes', name: 'Taomlar', count: stats.recipes, icon: UtensilsCrossed },
    { id: 'orders', name: 'Buyurtmalar', count: stats.orders, icon: ClipboardList },
    { id: 'users', name: 'Foydalanuvchilar', count: stats.users, icon: Users }
  ];

  if (recipesError || ordersError || usersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--brand-bg)] p-4">
        <div className="max-w-md w-full rounded-3xl border border-rose-200 bg-white p-8 text-center shadow-lg">
          <TriangleAlert className="mx-auto h-12 w-12 text-rose-500" />
          <h2 className="mt-4 text-2xl font-bold text-[color:var(--brand-primary)]">Xatolik yuz berdi</h2>
          <p className="mt-2 text-black/70">Ma'lumotlarni yuklashda muammo yuz berdi.</p>
          <Button onClick={() => window.location.reload()} className="mt-6 gap-2">
            <RefreshCw className="h-4 w-4" />
            Qayta yuklash
          </Button>
        </div>
      </div>
    );
  }

  if (recipesLoading && ordersLoading && usersLoading && !recipes && !orders && !users) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--brand-bg)]">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-black/70">Ma'lumotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),rgba(255,248,225,1)_48%,rgba(255,240,220,1))]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="mb-8 rounded-3xl border border-black/10 bg-white/75 backdrop-blur-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-black/70">
                <LayoutDashboard className="h-3.5 w-3.5" />
                ADMIN
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-black tracking-tight text-[color:var(--brand-primary)]">
                Oshxona Boshqaruv Paneli
              </h1>
              <p className="mt-2 text-black/70">Taomlar, buyurtmalar va foydalanuvchilarni bir joydan boshqaring.</p>
            </div>
            <Button onClick={() => setIsRecipeModalOpen(true)} className="gap-2 self-start md:self-auto">
              <Plus className="h-4 w-4" />
              Yangi taom qo'shish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Jami taomlar</p>
                <p className="mt-1 text-3xl font-bold text-[color:var(--brand-primary)]">{stats.recipes}</p>
              </div>
              <div className="rounded-xl bg-orange-100 p-2.5 text-orange-700">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Jami buyurtmalar</p>
                <p className="mt-1 text-3xl font-bold text-[color:var(--brand-primary)]">{stats.orders}</p>
                <p className="mt-1 text-xs text-black/50">{stats.pendingOrders} kutilmoqda - {stats.activeOrders} jarayonda</p>
              </div>
              <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Foydalanuvchilar</p>
                <p className="mt-1 text-3xl font-bold text-[color:var(--brand-primary)]">{stats.users}</p>
              </div>
              <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-black/60">Umumiy daromad</p>
                <p className="mt-1 text-2xl font-bold text-[color:var(--brand-primary)]">{formatCurrency(stats.revenue)}</p>
              </div>
              <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white/85 shadow-sm overflow-hidden">
          <nav className="flex flex-col sm:flex-row">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                  }}
                  className={`flex-1 px-5 py-4 text-sm font-semibold transition-colors ${
                    isActive ? 'bg-[color:var(--brand-accent)] text-white' : 'text-black/70 hover:bg-black/5'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tab.name}
                    <span className={`rounded-full px-2 py-0.5 text-xs ${isActive ? 'bg-white/20' : 'bg-black/10'}`}>
                      {tab.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 mb-7">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'recipes'
                  ? "Taom nomi, masalliqlar yoki tavsif bo'yicha qidiring..."
                  : activeTab === 'orders'
                  ? "Mijoz, telefon yoki taom bo'yicha qidiring..."
                  : "Ism, telefon yoki manzil bo'yicha qidiring..."
              }
              className="w-full rounded-2xl border border-black/15 bg-white px-12 py-4 text-[color:var(--brand-text)] placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)]"
            />
          </div>
        </div>

        <div className="space-y-8">
          {activeTab === 'recipes' && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--brand-primary)]">Taomlar Boshqaruvi</h2>
                <p className="mt-1 text-black/60">Menyudagi barcha taomlarni tahrirlash va boshqarish.</p>
              </div>

              {recipesLoading ? (
                <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-black/70">Taomlar yuklanmoqda...</p>
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
                  <p className="text-lg font-semibold text-[color:var(--brand-primary)]">
                    {searchTerm ? "Qidiruv bo'yicha taom topilmadi" : 'Hozircha taomlar mavjud emas'}
                  </p>
                  <p className="mt-2 text-black/60">
                    {searchTerm ? "Boshqa kalit so'z bilan qayta urinib ko'ring." : "Yangi taom qo'shib boshlang."}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredRecipes.map((recipe) => (
                    <article
                      key={recipe.id}
                      className="group overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className="relative h-48 overflow-hidden bg-black/5">
                        <img
                          src={recipe.image_path || FALLBACK_RECIPE_IMG}
                          alt={recipe.ovqat_nomi || 'Taom rasmi'}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_RECIPE_IMG;
                          }}
                        />
                        <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--brand-primary)] shadow">
                          {formatCurrency(recipe.narxi)}
                        </div>
                        {!!recipe.tayyorlanish_vaqti && (
                          <div className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-medium text-white">
                            {recipe.tayyorlanish_vaqti}
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-[color:var(--brand-primary)] line-clamp-1">{recipe.ovqat_nomi}</h3>
                        <p className="mt-2 text-sm text-black/70 line-clamp-2">{recipe.tavsif || "Taom uchun tavsif kiritilmagan."}</p>

                        <div className="mt-4 flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => handleEditRecipe(recipe)}>
                            <Pencil className="h-3.5 w-3.5" />
                            Tahrirlash
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            className="flex-1 gap-1.5"
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.ovqat_nomi)}
                            loading={deleting}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            O'chirish
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}
          {activeTab === 'orders' && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--brand-primary)]">Buyurtmalar Boshqaruvi</h2>
                <p className="mt-1 text-black/60">Buyurtma holatlarini real vaqtga yaqin ko'rinishda yangilang.</p>
              </div>

              {ordersLoading ? (
                <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-black/70">Buyurtmalar yuklanmoqda...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
                  <p className="text-lg font-semibold text-[color:var(--brand-primary)]">
                    {searchTerm ? "Qidiruv bo'yicha buyurtma topilmadi" : 'Hozircha buyurtmalar mavjud emas'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
                  <table className="w-full min-w-[760px]">
                    <thead className="bg-black/[0.03]">
                      <tr className="text-left text-xs uppercase tracking-wide text-black/60">
                        <th className="px-5 py-4">ID</th>
                        <th className="px-5 py-4">Mijoz</th>
                        <th className="px-5 py-4">Taom</th>
                        <th className="px-5 py-4">Summa</th>
                        <th className="px-5 py-4">Sana</th>
                        <th className="px-5 py-4">Holat</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {filteredOrders.map((order) => {
                        const status = STATUS_CONFIG[order.holat] || STATUS_CONFIG.yangi;
                        const StatusIcon = status.icon;
                        return (
                          <tr key={order.id} className="hover:bg-black/[0.02]">
                            <td className="px-5 py-4 text-sm font-semibold text-[color:var(--brand-primary)]">#{order.id}</td>
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-black/85">{order.foydalanuvchi_ism || "Noma'lum"}</p>
                              <p className="text-xs text-black/60">{order.foydalanuvchi_telefon || '-'}</p>
                            </td>
                            <td className="px-5 py-4">
                              <p className="text-sm text-black/85">{order.ovqat_nomi || '-'}</p>
                              <p className="text-xs text-black/60">{order.miqdor || 0} ta</p>
                            </td>
                            <td className="px-5 py-4 text-sm font-semibold text-black/85">{formatCurrency(order.umumiy_summa)}</td>
                            <td className="px-5 py-4 text-sm text-black/70">{formatDate(order.sana)}</td>
                            <td className="px-5 py-4">
                              <div className="relative">
                                <select
                                  value={order.holat || 'yangi'}
                                  onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                  disabled={updatingOrder}
                                  className={`w-full rounded-full border px-3 py-2 pr-8 text-xs font-semibold transition-colors disabled:opacity-50 ${status.color}`}
                                >
                                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                                    <option key={key} value={key}>
                                      {val.label}
                                    </option>
                                  ))}
                                </select>
                                <StatusIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-current opacity-70" />
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {activeTab === 'users' && (
            <section className="space-y-5">
              <div>
                <h2 className="text-2xl font-bold text-[color:var(--brand-primary)]">Foydalanuvchilar Boshqaruvi</h2>
                <p className="mt-1 text-black/60">Tizimga ro'yxatdan o'tgan foydalanuvchilar ro'yxati.</p>
              </div>

              {usersLoading ? (
                <div className="rounded-2xl border border-black/10 bg-white p-10 text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-black/70">Foydalanuvchilar yuklanmoqda...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
                  <p className="text-lg font-semibold text-[color:var(--brand-primary)]">
                    {searchTerm ? "Qidiruv bo'yicha foydalanuvchi topilmadi" : "Hozircha foydalanuvchilar mavjud emas"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white shadow-sm">
                  <table className="w-full min-w-[700px]">
                    <thead className="bg-black/[0.03]">
                      <tr className="text-left text-xs uppercase tracking-wide text-black/60">
                        <th className="px-5 py-4">Foydalanuvchi</th>
                        <th className="px-5 py-4">Aloqa</th>
                        <th className="px-5 py-4">Manzil</th>
                        <th className="px-5 py-4">Ro'yxatdan o'tgan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-black/[0.02]">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--brand-primary)] text-sm font-bold text-white">
                                {user.ism?.charAt(0)?.toUpperCase() || 'U'}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-black/85">{user.ism || "Ism yo'q"}</p>
                                <p className="text-xs text-black/60">ID: #{user.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium text-black/80">{user.telefon || '-'}</td>
                          <td className="px-5 py-4 text-sm text-black/70">{user.manzil || 'Manzil kiritilmagan'}</td>
                          <td className="px-5 py-4 text-sm text-black/70">{formatDate(user.yaratilgan_vaqt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}
        </div>
      </div>

      <Modal
        isOpen={isRecipeModalOpen}
        onClose={handleRecipeModalClose}
        title={editingRecipe ? "Taomni tahrirlash" : "Yangi taom qo'shish"}
        size="lg"
        closeOnBackdropClick={!creating && !updating}
      >
        <form onSubmit={handleRecipeSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--brand-primary)]">
                Taom nomi <span className="text-rose-500">*</span>
              </span>
              <input
                type="text"
                value={recipeForm.ovqat_nomi}
                onChange={(e) => setRecipeForm((prev) => ({ ...prev, ovqat_nomi: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
                placeholder="Masalan: Osh"
                required
                disabled={creating || updating}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Tayyorlanish vaqti</span>
              <input
                type="text"
                value={recipeForm.tayyorlanish_vaqti}
                onChange={(e) => setRecipeForm((prev) => ({ ...prev, tayyorlanish_vaqti: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
                placeholder="Masalan: 30 daqiqa"
                disabled={creating || updating}
              />
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Masalliqlar</span>
            <textarea
              value={recipeForm.masalliqlar}
              onChange={(e) => setRecipeForm((prev) => ({ ...prev, masalliqlar: e.target.value }))}
              rows={3}
              className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
              placeholder="Go'sht, sabzavot, ziravorlar..."
              disabled={creating || updating}
            />
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--brand-primary)]">
                Narxi (so'm) <span className="text-rose-500">*</span>
              </span>
              <input
                type="number"
                value={recipeForm.narxi}
                onChange={(e) => setRecipeForm((prev) => ({ ...prev, narxi: e.target.value }))}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
                min="0"
                step="1000"
                placeholder="25000"
                required
                disabled={creating || updating}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Rasm fayli (offline)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm text-[color:var(--brand-text)] file:mr-3 file:rounded-lg file:border-0 file:bg-[color:var(--brand-accent)]/15 file:px-3 file:py-2 file:text-[color:var(--brand-primary)] hover:file:bg-[color:var(--brand-accent)]/25 focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
                disabled={creating || updating}
              />
              <span className="text-xs text-black/55">Maksimal hajm: 5MB</span>
            </label>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Yoki rasm URL manzili</span>
            <input
                type="url"
                value={recipeForm.image_path}
                onChange={(e) => {
                  const nextUrl = e.target.value;
                  setRecipeImageFile(null);
                  setRecipeForm((prev) => ({ ...prev, image_path: nextUrl }));
                  setPreviewUrl(nextUrl);
                }}
                className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
                placeholder="https://example.com/osh.jpg"
                disabled={creating || updating}
            />
          </label>

          {imagePreviewSrc && (
            <div className="space-y-2">
              <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Rasm ko'rinishi</span>
              <div className="h-40 w-full overflow-hidden rounded-xl border border-black/10 bg-black/5">
                <img
                  src={imagePreviewSrc}
                  alt="Tanlangan rasm"
                  className="h-full w-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              </div>
            </div>
          )}

          <label className="block space-y-2">
            <span className="text-sm font-semibold text-[color:var(--brand-primary)]">Taom tavsifi</span>
            <textarea
              value={recipeForm.tavsif}
              onChange={(e) => setRecipeForm((prev) => ({ ...prev, tavsif: e.target.value }))}
              rows={3}
              className="w-full resize-none rounded-xl border border-black/15 bg-white px-4 py-3 text-[color:var(--brand-text)] focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-accent)]/30 focus:border-[color:var(--brand-accent)] disabled:opacity-60"
              placeholder="Taom haqida qisqacha ma'lumot..."
              disabled={creating || updating}
            />
          </label>

          <div className="flex gap-3 pt-3 border-t border-black/10">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleRecipeModalClose}
              disabled={creating || updating}
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              className="flex-1"
              loading={creating || updating}
              disabled={creating || updating || !recipeForm.ovqat_nomi.trim() || !recipeForm.narxi}
            >
              {editingRecipe ? 'Saqlash' : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;

