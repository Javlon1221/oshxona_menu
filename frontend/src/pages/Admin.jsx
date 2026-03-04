import { useState, useEffect, useMemo, useCallback } from 'react';
import { useGetRecipes, useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from '../api/hooks/useRecipe';
import { useGetOrders, useUpdateOrderStatus } from '../api/hooks/useOrders';
import { useGetUsers } from '../api/hooks/useFoydalanuvchi';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const STATUS_CONFIG = {
  yangi: { label: 'Kutilmoqda', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
  jarayonda: { label: 'Tayyorlanmoqda', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '👨‍🍳' },
  tayyor: { label: 'Tayyor', color: 'bg-green-100 text-green-800 border-green-200', icon: '✅' },
  yetkazildi: { label: 'Yetkazildi', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🚚' },
  bekor_qilindi: { label: 'Bekor qilingan', color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
};

const Admin = () => {
  const [activeTab, setActiveTab] = useState('recipes');
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [recipeForm, setRecipeForm] = useState({
    ovqat_nomi: '',
    tayyorlanish_vaqti: '',
    masalliqlar: '',
    narxi: '',
    image_path: '',
    tavsif: ''
  });

  const { data: recipes, isLoading: recipesLoading, error: recipesError } = useGetRecipes();
  const { data: orders, isLoading: ordersLoading, error: ordersError } = useGetOrders();
  const { data: users, isLoading: usersLoading, error: usersError } = useGetUsers();

  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const updateOrderStatusMutation = useUpdateOrderStatus();

 // Modal yopilganda shaklni tiklash
  useEffect(() => {
    if (!isRecipeModalOpen) {
      setEditingRecipe(null);
      setRecipeForm({
        ovqat_nomi: '',
        tayyorlanish_vaqti: '',
        masalliqlar: '',
        narxi: '',
        image_path: '',
        tavsif: ''
      });
    }
  }, [isRecipeModalOpen]);

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    try {
      // Tasdiqlash
      if (!recipeForm.ovqat_nomi.trim()) {
        alert('Iltimos, taom nomini kiriting');
        return;
      }
      
      const narx = Number(recipeForm.narxi);
      if (!narx || narx <= 0 || !isFinite(narx)) {
        alert('Iltimos, to\'g\'ri narx kiriting');
        return;
      }

      const recipeData = {
        ovqat_nomi: recipeForm.ovqat_nomi.trim(),
        tayyorlanish_vaqti: recipeForm.tayyorlanish_vaqti || '',
        masalliqlar: recipeForm.masalliqlar || '',
        narxi: narx,
        image_path: recipeForm.image_path || '',
        tavsif: recipeForm.tavsif || ''
      };

      if (editingRecipe?.id) {
        await updateRecipeMutation.mutateAsync({ id: editingRecipe.id, ...recipeData });
      } else {
        await createRecipeMutation.mutateAsync(recipeData);
      }

      setIsRecipeModalOpen(false);
    } catch (error) {
      console.error('Recipe operation failed:', error);
      const errorMessage = error.response?.data?.message || error.userMessage || 'Taomni saqlashda xato yuz berdi.';
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
    setIsRecipeModalOpen(true);
  }, []);

  const handleDeleteRecipe = async (id, name) => {
    if (!window.confirm(`"${name}" taomini o'chirishni tasdiqlaysizmi?\nBu amalni ortga qaytarib bo'lmaydi.`)) return;
    
    try {
      await deleteRecipeMutation.mutateAsync(id);
    } catch (error) {
      console.error('Delete failed:', error);
      const errorMessage = error.response?.data?.message || error.userMessage || 'O\'chirishda xatolik yuz berdi.';
      alert(errorMessage);
    }
  };

  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({ id: orderId, holat: newStatus });
    } catch (error) {
      console.error('Status update failed:', error);
      const errorMessage = error.response?.data?.message || error.userMessage || 'Holatni yangilashda xato yuz berdi.';
      alert(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString;
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '0 so\'m';
    return new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m';
  };

  // Memoized filtered data
  const filteredRecipes = useMemo(() => 
    recipes?.filter(r => 
      r.ovqat_nomi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.masalliqlar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.tavsif?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [], [recipes, searchTerm]);

  const filteredOrders = useMemo(() => 
    orders?.filter(o => 
      o.ovqat_nomi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.foydalanuvchi_ism?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.foydalanuvchi_telefon?.includes(searchTerm)
    ) || [], [orders, searchTerm]);

  const filteredUsers = useMemo(() => 
    users?.filter(u => 
      u.ism?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.telefon?.includes(searchTerm) ||
      u.manzil?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [], [users, searchTerm]);

  // Loading states
  const creating = createRecipeMutation.isLoading || createRecipeMutation.isPending;
  const updating = updateRecipeMutation.isLoading || updateRecipeMutation.isPending;
  const deleting = deleteRecipeMutation.isLoading || deleteRecipeMutation.isPending;
  const updatingOrder = updateOrderStatusMutation.isLoading || updateOrderStatusMutation.isPending;

  // Statistics
  const stats = useMemo(() => ({
    recipes: recipes?.length || 0,
    orders: orders?.length || 0,
    users: users?.length || 0,
    revenue: orders?.reduce((sum, o) => sum + (Number(o.umumiy_summa) || 0), 0) || 0,
    pendingOrders: orders?.filter(o => o.holat === 'yangi').length || 0,
    activeOrders: orders?.filter(o => o.holat === 'jarayonda').length || 0
  }), [recipes, orders, users]);

  // Error handling for data fetching
  if (recipesError || ordersError || usersError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Xatolik yuz berdi</h2>
          <p className="text-gray-600 mb-4">Ma'lumotlarni yuklashda muammo yuz berdi</p>
          <Button onClick={() => window.location.reload()}>
            Qayta yuklash
          </Button>
        </div>
      </div>
    );
  }

  // Initial loading state
  if ((recipesLoading && ordersLoading && usersLoading) && 
      (!recipes && !orders && !users)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <LoadingSpinner size="lg" text="Ma'lumotlar yuklanmoqda..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
            🎛️ Admin Panel
          </h1>
          <p className="text-slate-600 text-lg">Oshxona boshqaruvi va statistika</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Jami Taomlar</div>
                <div className="text-3xl font-bold text-slate-900">{stats.recipes}</div>
              </div>
              <div className="text-2xl">🍽️</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Jami Buyurtmalar</div>
                <div className="text-3xl font-bold text-slate-900">{stats.orders}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {stats.pendingOrders} kutilmoqda • {stats.activeOrders} tayyorlanmoqda
                </div>
              </div>
              <div className="text-2xl">📋</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Foydalanuvchilar</div>
                <div className="text-3xl font-bold text-slate-900">{stats.users}</div>
              </div>
              <div className="text-2xl">👥</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-600 mb-1">Umumiy Daromad</div>
                <div className="text-2xl font-bold text-slate-900">{formatCurrency(stats.revenue)}</div>
              </div>
              <div className="text-2xl">💰</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-6 overflow-hidden">
          <nav className="flex flex-col sm:flex-row">
            {[
              { id: 'recipes', name: '🍽️ Taomlar', count: stats.recipes },
              { id: 'orders', name: '📋 Buyurtmalar', count: stats.orders },
              { id: 'users', name: '👥 Foydalanuvchilar', count: stats.users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`flex-1 py-4 px-6 font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-inner'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  {tab.name}
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`${activeTab === 'recipes' ? 'Taom nomi, masalliqlar...' : activeTab === 'orders' ? 'Mijoz ismi, telefon, taom...' : 'Ism, telefon, manzil...'}`}
              className="w-full px-5 py-4 rounded-2xl border border-slate-300 bg-white focus:outline-none focus:ring-3 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-slate-400"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              🔍
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Recipes Tab */}
          {activeTab === 'recipes' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Taomlar Boshqaruvi</h2>
                  <p className="text-slate-600 mt-1">Barcha mavjud taomlar ro'yxati</p>
                </div>
                <Button 
                  onClick={() => setIsRecipeModalOpen(true)}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <span className="flex items-center gap-2">
                    <span>+</span>
                    Yangi taom qo'shish
                  </span>
                </Button>
              </div>

              {recipesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" text="Taomlar yuklanmoqda..." />
                </div>
              ) : filteredRecipes.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {searchTerm ? 'Hech narsa topilmadi' : 'Hali taomlar mavjud emas'}
                  </h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Qidiruv so\'ziga mos taomlar topilmadi. Boshqa so\'zlar bilan qayta urinib ko\'ring.'
                      : 'Birorta taom qo\'shish uchun "Yangi taom qo\'shish" tugmasini bosing.'
                    }
                  </p>
                  {!searchTerm && (
                    <Button onClick={() => setIsRecipeModalOpen(true)}>
                      Birinchi taomni qo'shish
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredRecipes.map((recipe) => (
                    <div 
                      key={recipe.id} 
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-slate-200 hover:border-orange-200 group"
                    >
                      <div className="relative h-48 bg-slate-200 overflow-hidden">
                        <img
                          src={recipe.image_path || '/api/placeholder/400/240'}
                          alt={recipe.ovqat_nomi}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/api/placeholder/400/240';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm">
                          {formatCurrency(recipe.narxi)}
                        </div>
                        {recipe.tayyorlanish_vaqti && (
                          <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                            ⏱️ {recipe.tayyorlanish_vaqti}
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-1">
                          {recipe.ovqat_nomi}
                        </h3>
                        
                        <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {recipe.tavsif || 'Tavsif mavjud emas'}
                        </p>

                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditRecipe(recipe)}
                            className="flex-1 border-slate-300 hover:border-orange-500 hover:bg-orange-50 text-slate-700 hover:text-orange-700"
                          >
                            <span className="flex items-center gap-2">
                              ✏️ Tahrirlash
                            </span>
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.ovqat_nomi)}
                            loading={deleting}
                            className="flex-1"
                          >
                            <span className="flex items-center gap-2">
                              🗑️ O'chirish
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Buyurtmalar Boshqaruvi</h2>
                <p className="text-slate-600">Barcha mijoz buyurtmalari va ularning holatlari</p>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" text="Buyurtmalar yuklanmoqda..." />
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {searchTerm ? 'Hech narsa topilmadi' : 'Hali buyurtmalar mavjud emas'}
                  </h3>
                  <p className="text-slate-600">
                    {searchTerm ? 'Qidiruv so\'ziga mos buyurtmalar topilmadi.' : 'Hozircha yangi buyurtmalar yo\'q.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Buyurtma
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Mijoz
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Taom & Miqdor
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Summa
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Sana
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Holat
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredOrders.map((order) => {
                          const status = STATUS_CONFIG[order.holat || 'yangi'];
                          return (
                            <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-slate-900">#{order.id}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-slate-900">{order.foydalanuvchi_ism || 'Noma\'lum'}</div>
                                <div className="text-sm text-slate-500">{order.foydalanuvchi_telefon || ''}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm text-slate-900">{order.ovqat_nomi || '-'}</div>
                                <div className="text-sm text-slate-500">{order.miqdor} ta</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-semibold text-slate-900">
                                  {formatCurrency(order.umumiy_summa)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-slate-900">{formatDate(order.sana)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <select
                                  value={order.holat || 'yangi'}
                                  onChange={(e) => handleOrderStatusUpdate(order.id, e.target.value)}
                                  disabled={updatingOrder}
                                  className={`text-sm rounded-full px-3 py-2 font-medium border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${status.color} border-transparent hover:border-current`}
                                >
                                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                                    <option key={key} value={key} className="bg-white">
                                      {val.icon} {val.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Foydalanuvchilar Boshqaruvi</h2>
                <p className="text-slate-600">Ro'yxatdan o'tgan barcha foydalanuvchilar</p>
              </div>

              {usersLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner size="lg" text="Foydalanuvchilar yuklanmoqda..." />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                  <div className="text-6xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {searchTerm ? 'Hech narsa topilmadi' : 'Hali foydalanuvchilar mavjud emas'}
                  </h3>
                  <p className="text-slate-600">
                    {searchTerm ? 'Qidiruv so\'ziga mos foydalanuvchilar topilmadi.' : 'Hozircha ro\'yxatdan o\'tgan foydalanuvchilar yo\'q.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Foydalanuvchi
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Aloqa
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Manzil
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                            Ro'yxatdan o'tgan
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                  {user.ism?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-slate-900">{user.ism}</div>
                                  <div className="text-xs text-slate-500">ID: #{user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-900 font-mono">{user.telefon}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-900 max-w-xs truncate">
                                {user.manzil || 'Manzil kiritilmagan'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-slate-900">{formatDate(user.yaratilgan_vaqt)}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recipe Modal */}
      <Modal
        isOpen={isRecipeModalOpen}
        onClose={() => !creating && !updating && setIsRecipeModalOpen(false)}
        title={editingRecipe ? '✏️ Taomni tahrirlash' : "➕ Yangi taom qo'shish"}
        size="lg"
        closeOnBackdropClick={!creating && !updating}
      >
        <form onSubmit={handleRecipeSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Taom nomi <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={recipeForm.ovqat_nomi} 
                onChange={(e) => setRecipeForm(prev => ({ ...prev, ovqat_nomi: e.target.value }))} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed" 
                required 
                disabled={creating || updating}
                placeholder="Masalan: Osh"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Tayyorlanish vaqti
              </label>
              <input 
                type="text" 
                value={recipeForm.tayyorlanish_vaqti} 
                onChange={(e) => setRecipeForm(prev => ({ ...prev, tayyorlanish_vaqti: e.target.value }))} 
                placeholder="Masalan: 30 daqiqa" 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed" 
                disabled={creating || updating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Masalliqlar
            </label>
            <textarea 
              value={recipeForm.masalliqlar} 
              onChange={(e) => setRecipeForm(prev => ({ ...prev, masalliqlar: e.target.value }))} 
              rows={3} 
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed resize-none" 
              placeholder="Go'sht, sabzavot, ziravorlar..."
              disabled={creating || updating}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Narxi (so'm) <span className="text-red-500">*</span>
              </label>
              <input 
                type="number" 
                value={recipeForm.narxi} 
                onChange={(e) => setRecipeForm(prev => ({ ...prev, narxi: e.target.value }))} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed" 
                required 
                min="0"
                step="1000"
                placeholder="25000"
                disabled={creating || updating}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                Rasm URL manzili
              </label>
              <input 
                type="url" 
                value={recipeForm.image_path} 
                onChange={(e) => setRecipeForm(prev => ({ ...prev, image_path: e.target.value }))} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed" 
                placeholder="https://example.com/osh.jpg"
                disabled={creating || updating}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Taom tavsifi
            </label>
            <textarea 
              value={recipeForm.tavsif} 
              onChange={(e) => setRecipeForm(prev => ({ ...prev, tavsif: e.target.value }))} 
              rows={3} 
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all disabled:bg-slate-100 disabled:cursor-not-allowed resize-none" 
              placeholder="Taom haqida qisqacha ma'lumot..."
              disabled={creating || updating}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsRecipeModalOpen(false)} 
              className="flex-1 border-slate-300 hover:border-slate-400"
              disabled={creating || updating}
            >
              Bekor qilish
            </Button>
            <Button 
              type="submit"
              loading={creating || updating} 
              disabled={creating || updating || !recipeForm.ovqat_nomi.trim() || !recipeForm.narxi}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              <span className="flex items-center gap-2">
                {editingRecipe ? '💾 Saqlash' : "➕ Qo'shish"}
              </span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;