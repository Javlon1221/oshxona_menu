// server.js (yangilangan)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const API_PREFIX = '/api';

// JWT Secret tekshiruvi
if (!process.env.JWT_SECRET) {
  console.error('❌ XATO: JWT_SECRET .env faylida mavjud emas!');
  process.exit(1);
}

// Uploads papkasini yaratish
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Faqat rasm fayllari (jpg, png, gif, webp) yuklash mumkin!'));
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// ===============================================
// Utility Functions
// ===============================================

const extractToken = (headerValue) => {
  if (!headerValue) return null;
  if (headerValue.startsWith('Bearer ')) {
    return headerValue.substring(7);
  }
  return headerValue;
};

const safeJoin = (baseDir, relativePath) => {
  // Agar relativePath boshida / bo'lsa olib tashlaymiz, keyin join qilamiz
  const clean = (relativePath || '').replace(/^\/+/, '');
  return path.join(baseDir, clean);
};

// ===============================================
// Middleware: Authentication
// ===============================================

const verifyToken = async (req, res, next) => {
  try {
    const raw = req.headers['authorization'];
    const token = extractToken(raw);
    
    if (!token) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('Token verification error:', err.message);
        return res.status(401).json({ message: 'Token noto\'g\'ri yoki eskirgan' });
      }
      req.user = decoded;

      // Agar tokenda role === 'admin' bo'lsa, admin ma'lumotlarini DBdan yuklab olamiz
      if (decoded.role === 'admin') {
        try {
          const q = await pool.query('SELECT id, username, yaratilgan_vaqt FROM adminlar WHERE id=$1', [decoded.id]);
          if (q.rows.length > 0) {
            req.admin = q.rows[0];
          }
        } catch (dbErr) {
          console.error('verifyToken admin DB lookup error:', dbErr);
          // Bu holatda ham token foydalanuvchi sifatida davom etsin (lekin ruxsatlar alohida tekshiriladi)
        }
      }

      next();
    });
  } catch (err) {
    console.error('verifyToken error:', err);
    return res.status(500).json({ message: 'Token tekshirish xatosi' });
  }
};

const verifyAdmin = (req, res, next) => {
  try {
    const raw = req.headers['authorization'];
    const token = extractToken(raw);
    
    if (!token) {
      return res.status(401).json({ message: 'Token topilmadi' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.error('Admin token verification error:', err.message);
        return res.status(401).json({ message: 'Token noto\'g\'ri yoki eskirgan' });
      }

      // Role tekshiruvi — token ichida role='admin' bo'lishi kerak
      if (decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Admin huquqi kerak' });
      }
      
      try {
        const q = await pool.query(
          'SELECT id, username, yaratilgan_vaqt FROM adminlar WHERE id=$1',
          [decoded.id]
        );
        
        if (q.rows.length === 0) {
          return res.status(403).json({ message: 'Admin topilmadi yoki huquq yo\'q' });
        }
        
        req.user = decoded;
        req.admin = q.rows[0];
        next();
      } catch (dbErr) {
        console.error('Admin verification DB error:', dbErr);
        return res.status(500).json({ message: 'Adminni tekshirishda xatolik' });
      }
    });
  } catch (err) {
    console.error('verifyAdmin error:', err);
    return res.status(500).json({ message: 'Adminni tekshirishda xatolik' });
  }
};

// ===============================================
// Router Setup
// ===============================================

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// ===============================================
// FOYDALANUVCHI (Users) Endpoints
// ===============================================

// Ro'yxatdan o'tish
router.post('/users/register', async (req, res) => {
  try {
    const { ism, telefon, password, manzil } = req.body;
    
    // Validatsiya
    if (!ism?.trim() || !telefon?.trim() || !password?.trim()) {
      return res.status(400).json({ 
        message: 'Ism, telefon va parol majburiy maydonlar' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Parol kamida 6 ta belgidan iborat bo\'lishi kerak' 
      });
    }

    // Telefon tekshiruvi
    const exists = await pool.query(
      'SELECT id FROM foydalanuvchilar WHERE telefon=$1',
      [telefon.trim()]
    );
    
    if (exists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan' 
      });
    }

    // Parolni hashlash
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Foydalanuvchini yaratish
    const result = await pool.query(
      `INSERT INTO foydalanuvchilar (ism, telefon, password, manzil) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, ism, telefon, manzil, yaratilgan_vaqt`,
      [ism.trim(), telefon.trim(), hashedPassword, manzil?.trim() || null]
    );
    
    const user = result.rows[0];
    
    // Token yaratish
    const token = jwt.sign(
      { id: user.id, ism: user.ism, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ 
      message: 'Ro\'yxatdan o\'tish muvaffaqiyatli',
      token,
      user: {
        id: user.id,
        ism: user.ism,
        telefon: user.telefon,
        manzil: user.manzil
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Ro\'yxatdan o\'tishda xatolik yuz berdi' });
  }
});

// Tizimga kirish (users)
router.post('/users/login', async (req, res) => {
  try {
    const { telefon, password } = req.body;
    
    if (!telefon?.trim() || !password?.trim()) {
      return res.status(400).json({ 
        message: 'Telefon va parol majburiy' 
      });
    }

    const userQuery = await pool.query(
      'SELECT * FROM foydalanuvchilar WHERE telefon=$1',
      [telefon.trim()]
    );
    
    if (userQuery.rows.length === 0) {
      return res.status(404).json({ 
        message: 'Telefon raqam yoki parol noto\'g\'ri' 
      });
    }

    const user = userQuery.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Telefon raqam yoki parol noto\'g\'ri' 
      });
    }

    const token = jwt.sign(
      { id: user.id, ism: user.ism, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({ 
      message: 'Kirish muvaffaqiyatli',
      token,
      user: {
        id: user.id,
        ism: user.ism,
        telefon: user.telefon,
        manzil: user.manzil
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Tizimga kirishda xatolik yuz berdi' });
  }
});

// Barcha foydalanuvchilarni olish (Admin)
router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, ism, telefon, manzil, yaratilgan_vaqt 
       FROM foydalanuvchilar 
       ORDER BY yaratilgan_vaqt DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Foydalanuvchilarni olishda xatolik' });
  }
});

// Bitta foydalanuvchini olish
router.get('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, ism, telefon, manzil, yaratilgan_vaqt FROM foydalanuvchilar WHERE id=$1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Foydalanuvchini olishda xatolik' });
  }
});

// Foydalanuvchini yangilash
router.put('/users/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ism, telefon, manzil } = req.body;
    
    // Faqat o'z profilini yangilashi mumkin yoki admin
    if (req.user.id !== parseInt(id) && !req.admin) {
      return res.status(403).json({ message: 'Ruxsat yo\'q' });
    }
    
    const result = await pool.query(
      `UPDATE foydalanuvchilar 
       SET ism=$1, telefon=$2, manzil=$3 
       WHERE id=$4 
       RETURNING id, ism, telefon, manzil`,
      [ism?.trim(), telefon?.trim(), manzil?.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Foydalanuvchi topilmadi' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ message: 'Yangilashda xatolik' });
  }
});

// Foydalanuvchi buyurtmalarini olish
router.get('/users/:id/orders', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Faqat o'z buyurtmalarini ko'rishi mumkin yoki admin
    if (req.user.id !== parseInt(id) && !req.admin) {
      return res.status(403).json({ message: 'Ruxsat yo\'q' });
    }
    
    const result = await pool.query(
      `SELECT b.id, o.ovqat_nomi, o.image_path, b.miqdor, b.tolov_turi, 
              b.umumiy_summa, b.sana
       FROM buyurtmalar b
       JOIN ovqatlar o ON b.ovqat_id = o.id
       WHERE b.foydalanuvchi_id = $1
       ORDER BY b.sana DESC`,
      [id]
    );
    
    res.json(result.rows);
  } catch (err) {
    console.error('Get user orders error:', err);
    res.status(500).json({ message: 'Buyurtmalarni olishda xatolik' });
  }
});

// ===============================================
// ADMIN Endpoints
// ===============================================

// Admin login handler extracted to reuse for alias
const adminLoginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ 
        message: 'Username va parol majburiy' 
      });
    }

    const adminQuery = await pool.query(
      'SELECT * FROM adminlar WHERE username=$1',
      [username.trim()]
    );
    
    if (adminQuery.rows.length === 0) {
      return res.status(401).json({ 
        message: 'Username yoki parol noto\'g\'ri' 
      });
    }

    const admin = adminQuery.rows[0];

    // Agar DBdagi password bcrypt bilan hashlangan bo'lsa — compare bilan tekshirish
    // Aks holda (legacy plain text) — plain tekshirish va agar to'g'ri bo'lsa, passwordni hash qilib yangilash
    let isPasswordValid = false;
    const maybeHash = admin.password || '';
    const looksLikeBcrypt = maybeHash.startsWith('$2a$') || maybeHash.startsWith('$2b$') || maybeHash.startsWith('$2y$');

    if (looksLikeBcrypt) {
      isPasswordValid = await bcrypt.compare(password, maybeHash);
    } else {
      // legacy plaintext fallback (faqat migratsiya uchun)
      if (password === maybeHash) {
        isPasswordValid = true;
        // Parolni darhol hashlab yangilash
        try {
          const newHash = await bcrypt.hash(password, 10);
          await pool.query('UPDATE adminlar SET password=$1 WHERE id=$2', [newHash, admin.id]);
          console.log(`Admin (id=${admin.id}) password migrated to bcrypt.`);
        } catch (mErr) {
          console.error('Admin password migration error:', mErr);
        }
      }
    }

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Username yoki parol noto\'g\'ri' 
      });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );
    
    res.json({ 
      message: 'Admin kirishi muvaffaqiyatli',
      token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Tizimga kirishda xatolik' });
  }
};

router.post('/admin/login', adminLoginHandler);

// Eski endpoint nomi uchun alias — foydalanuvchidan kelgan /adminlar/login so'rovini shu handler ga yuboramiz
router.post('/adminlar/login', adminLoginHandler);

// Barcha adminlarni olish
router.get('/admin', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, yaratilgan_vaqt FROM adminlar ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get admins error:', err);
    res.status(500).json({ message: 'Adminlarni olishda xatolik' });
  }
});

// Admin yaratish (Super admin kerak) — hozir verifyAdmin ishlatilyapti; agar siz super-admin check qo'shmoqchi bo'lsangiz token ichiga flag qo'shing
router.post('/admin', verifyAdmin, async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Username va parol majburiy' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Parol kamida 8 ta belgidan iborat bo\'lishi kerak' 
      });
    }
    
    const exists = await pool.query(
      'SELECT id FROM adminlar WHERE username=$1',
      [username.trim()]
    );
    
    if (exists.rows.length > 0) {
      return res.status(400).json({ 
        message: 'Bu username allaqachon mavjud' 
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO adminlar (username, password, yaratilgan_vaqt) VALUES ($1, $2, NOW()) RETURNING id, username',
      [username.trim(), hashedPassword]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create admin error:', err);
    res.status(500).json({ message: 'Admin yaratishda xatolik' });
  }
});

// ===============================================
// OVQATLAR (Recipes) Endpoints
// ===============================================

// Barcha ovqatlarni olish (Public)
router.get('/recipes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM ovqatlar ORDER BY id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get recipes error:', err);
    res.status(500).json({ message: 'Ovqatlarni olishda xatolik' });
  }
});

// Bitta ovqatni olish (Public)
router.get('/recipes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM ovqatlar WHERE id=$1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ovqat topilmadi' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get recipe error:', err);
    res.status(500).json({ message: 'Ovqatni olishda xatolik' });
  }
});

// Ovqat qo'shish (Admin)
router.post('/recipes', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { ovqat_nomi, tayyorlanish_vaqti, masalliqlar, narxi, tavsif } = req.body;
    
    if (!ovqat_nomi?.trim()) {
      return res.status(400).json({ message: 'Ovqat nomi majburiy' });
    }
    
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      `INSERT INTO ovqatlar (ovqat_nomi, tayyorlanish_vaqti, masalliqlar, narxi, image_path, tavsif)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        ovqat_nomi.trim(),
        tayyorlanish_vaqti || null,
        masalliqlar || null,
        parseFloat(narxi) || 0,
        imagePath,
        tavsif?.trim() || null
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create recipe error:', err);
    // Xato bo'lsa rasmni o'chirish
    if (req.file) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete uploaded file:', unlinkErr);
      });
    }
    res.status(500).json({ message: 'Ovqat qo\'shishda xatolik' });
  }
});

// Ovqatni yangilash (Admin)
router.put('/recipes/:id', verifyAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { ovqat_nomi, tayyorlanish_vaqti, masalliqlar, narxi, tavsif } = req.body;
    
    // Eski ovqatni olish
    const oldRecipe = await pool.query('SELECT * FROM ovqatlar WHERE id=$1', [id]);
    if (oldRecipe.rows.length === 0) {
      return res.status(404).json({ message: 'Ovqat topilmadi' });
    }
    
    // Yangi rasm yuklangan bo'lsa, eskisini o'chirish
    let imagePath = oldRecipe.rows[0].image_path;
    if (req.file) {
      if (imagePath) {
        const fullOld = safeJoin(__dirname, imagePath);
        if (fs.existsSync(fullOld)) {
          try { fs.unlinkSync(fullOld); } catch (e) { console.error('Old image delete error:', e); }
        }
      }
      imagePath = `/uploads/${req.file.filename}`;
    }
    
    const result = await pool.query(
      `UPDATE ovqatlar 
       SET ovqat_nomi=$1, tayyorlanish_vaqti=$2, masalliqlar=$3, narxi=$4, image_path=$5, tavsif=$6
       WHERE id=$7 RETURNING *`,
      [
        ovqat_nomi?.trim() || oldRecipe.rows[0].ovqat_nomi,
        tayyorlanish_vaqti || oldRecipe.rows[0].tayyorlanish_vaqti,
        masalliqlar || oldRecipe.rows[0].masalliqlar,
        parseFloat(narxi) || oldRecipe.rows[0].narxi,
        imagePath,
        tavsif?.trim() || oldRecipe.rows[0].tavsif,
        id
      ]
    );
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update recipe error:', err);
    res.status(500).json({ message: 'Ovqatni yangilashda xatolik' });
  }
});

// Ovqatni o'chirish (Admin)
router.delete('/recipes/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM ovqatlar WHERE id=$1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Ovqat topilmadi' });
    }
    
    // Rasmni o'chirish
    const imagePath = result.rows[0].image_path;
    if (imagePath) {
      const fullPath = safeJoin(__dirname, imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlink(fullPath, (err) => {
          if (err) console.error('Image delete error:', err);
        });
      }
    }
    
    res.json({ 
      message: 'Ovqat o\'chirildi',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Delete recipe error:', err);
    res.status(500).json({ message: 'Ovqatni o\'chirishda xatolik' });
  }
});

// ===============================================
// BUYURTMALAR (Orders) Endpoints
// ===============================================

// Barcha buyurtmalarni olish (Admin)
router.get('/orders', verifyAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        b.id, 
        b.foydalanuvchi_id,
        f.ism AS foydalanuvchi_ism,
        f.telefon AS foydalanuvchi_telefon,
        b.ovqat_id,
        o.ovqat_nomi,
        o.image_path,
        b.miqdor,
        b.tolov_turi,
        b.umumiy_summa,
        b.sana
       FROM buyurtmalar b
       LEFT JOIN foydalanuvchilar f ON b.foydalanuvchi_id = f.id
       LEFT JOIN ovqatlar o ON b.ovqat_id = o.id
       ORDER BY b.sana DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: 'Buyurtmalarni olishda xatolik' });
  }
});

// Buyurtma yaratish
router.post('/orders', verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { items, tolov_turi = 'naqd' } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        message: 'Kamida bitta ovqat tanlash kerak' 
      });
    }
    
    const createdOrders = [];
    let totalAmount = 0;
    
    for (const item of items) {
      const { ovqat_id, miqdor = 1 } = item;
      
      if (!ovqat_id || miqdor <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ 
          message: 'Noto\'g\'ri buyurtma ma\'lumotlari' 
        });
      }
      
      // Ovqat mavjudligini tekshirish
      const recipeQuery = await client.query(
        'SELECT id, ovqat_nomi, narxi FROM ovqatlar WHERE id=$1',
        [ovqat_id]
      );
      
      if (recipeQuery.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ 
          message: `Ovqat (ID: ${ovqat_id}) topilmadi` 
        });
      }
      
      const recipe = recipeQuery.rows[0];
      const itemTotal = parseFloat(recipe.narxi) * parseInt(miqdor);
      totalAmount += itemTotal;
      
      // Buyurtma yaratish
      const orderResult = await client.query(
        `INSERT INTO buyurtmalar (foydalanuvchi_id, ovqat_id, miqdor, tolov_turi, umumiy_summa, holat)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userId, ovqat_id, miqdor, tolov_turi, itemTotal, 'yangi']
      );
      
      createdOrders.push({
        ...orderResult.rows[0],
        ovqat_nomi: recipe.ovqat_nomi
      });
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Buyurtma muvaffaqiyatli yaratildi',
      orders: createdOrders,
      totalAmount
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Buyurtma yaratishda xatolik' });
  } finally {
    client.release();
  }
});

// Buyurtma holatini yangilash (Admin)
router.put('/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { holat } = req.body;
    
    const validStatuses = ['yangi', 'jarayonda', 'tayyor', 'yetkazildi', 'bekor_qilindi'];
    if (!validStatuses.includes(holat)) {
      return res.status(400).json({ 
        message: `Noto'g'ri holat. Quyidagilardan birini tanlang: ${validStatuses.join(', ')}` 
      });
    }
    
    const result = await pool.query(
      'UPDATE buyurtmalar SET holat=$1 WHERE id=$2 RETURNING *',
      [holat, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ message: 'Holat yangilashda xatolik' });
  }
});

// Buyurtmani o'chirish (Admin)
router.delete('/orders/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM buyurtmalar WHERE id=$1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Buyurtma topilmadi' });
    }
    
    res.json({ 
      message: 'Buyurtma o\'chirildi',
      deleted: result.rows[0]
    });
  } catch (err) {
    console.error('Delete order error:', err);
    res.status(500).json({ message: 'Buyurtmani o\'chirishda xatolik' });
  }
});

// ===============================================
// Mount Router
// ===============================================

app.use(API_PREFIX, router);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'Fayl hajmi juda katta (max 5MB)' });
    }
    return res.status(400).json({ message: `Fayl yuklashda xato: ${err.message}` });
  }
  
  res.status(500).json({ 
    message: err.message || 'Serverda xatolik yuz berdi',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: 'Endpoint topilmadi',
    path: req.path,
    method: req.method
  });
});

// ===============================================
// Start Server
// ===============================================

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`✅ Server muvaffaqiyatli ishga tushdi`);
  console.log(`🌐 Port: ${PORT}`);
  console.log(`📡 API URL: http://localhost:${PORT}${API_PREFIX}`);
  console.log(`📁 Uploads: ${uploadsDir}`);
  console.log(`🔒 JWT Secret: ${process.env.JWT_SECRET ? '✓ Configured' : '✗ Missing'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(50));
});
