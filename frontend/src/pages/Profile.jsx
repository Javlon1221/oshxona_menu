import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserOrders, useUpdateUser } from '../api/hooks/useFoydalanuvchi';
import { updateUser } from '../redux/features/authSlice';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    ism: user?.ism || '',
    telefon: user?.telefon || '',
    manzil: user?.manzil || '',
  });

  const { data: orders, isLoading: ordersLoading } = useGetUserOrders(user?.id);
  const updateUserMutation = useUpdateUser();

  // keep edit form in sync with current user data
  useEffect(() => {
    if (user) {
      setEditForm({
        ism: user.ism || '',
        telefon: user.telefon || '',
        manzil: user.manzil || '',
      });
    }
  }, [user]);

  // Handle user update
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserMutation.mutateAsync({
        id: user.id,
        ...editForm,
      });
      dispatch(updateUser(updatedUser));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Foydalanuvchi yangilashda xatolik:', err);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 🧍 Profile info */}
        <div className="bg-white shadow-sm rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl font-bold text-white shadow">
              {user?.ism?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{user?.ism}</h2>
            <p className="text-gray-500">{user?.telefon}</p>
          </div>

          <div className="space-y-3 mb-6 text-sm">
            <div>
              <span className="block font-medium text-gray-600">Ism va familiya:</span>
              <p className="text-gray-900">{user?.ism}</p>
            </div>
            <div>
              <span className="block font-medium text-gray-600">Telefon raqam:</span>
              <p className="text-gray-900">{user?.telefon}</p>
            </div>
            <div>
              <span className="block font-medium text-gray-600">Manzil:</span>
              <p className="text-gray-900">{user?.manzil || 'Ko‘rsatilmagan'}</p>
            </div>
            <div>
              <span className="block font-medium text-gray-600">Ro‘yxatdan o‘tgan sana:</span>
              <p className="text-gray-900">{formatDate(user?.yaratilgan_vaqt)}</p>
            </div>
          </div>

          <Button
            onClick={() => setIsEditModalOpen(true)}
            variant="outline"
            className="w-full"
          >
            Ma’lumotlarni tahrirlash
          </Button>
        </div>

        {/* 🧾 Orders history */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-3">
            Buyurtmalar tarixi
          </h2>

          {ordersLoading ? (
            <div className="flex justify-center py-10">
              <LoadingSpinner size="lg" />
            </div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-10 text-gray-600">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Hozircha buyurtmalar yo‘q</h3>
              <p>Menyudan birinchi buyurtmangizni bering 🍽️</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Buyurtma #{order.id}
                      </h3>
                      <p className="text-xs text-gray-500">{formatDate(order.sana)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-orange-600 font-bold">
                        {order.umumiy_summa?.toLocaleString()} so‘m
                      </p>
                      <p className="text-sm text-gray-500 capitalize">
                        {order.tolov_turi}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Mahsulot:</span>
                      <span className="font-medium text-gray-800">
                        {order.ovqat_nomi}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Miqdor:</span>
                      <span className="font-medium text-gray-800">
                        {order.miqdor} ta
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Ma’lumotlarni tahrirlash"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ism va familiya</label>
            <input
              type="text"
              value={editForm.ism}
              onChange={(e) => setEditForm({ ...editForm, ism: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon raqam</label>
            <input
              type="tel"
              value={editForm.telefon}
              onChange={(e) => setEditForm({ ...editForm, telefon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Manzil</label>
            <textarea
              rows={3}
              value={editForm.manzil}
              onChange={(e) => setEditForm({ ...editForm, manzil: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Bekor qilish
            </Button>
            <Button
              type="submit"
              loading={updateUserMutation.isPending}
              disabled={updateUserMutation.isPending}
              className="flex-1"
            >
              Saqlash
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Profile;


