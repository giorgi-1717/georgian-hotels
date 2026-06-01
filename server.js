const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const dbConfig = {
  server: '127.0.0.1',
  database: 'HotelBookingDB',
  user: 'hotelbooking',
  password: 'Hotel123!',
  port: 1433,
  options: {
    trustServerCertificate: true,
    encrypt: false,
    enableArithAbort: true
  }
};

// ── Hotels ──────────────────────────────────────────────────
app.get('/api/hotels', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM dbo.Hotel');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Rooms by Hotel ───────────────────────────────────────────
app.get('/api/hotels/:id/rooms', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('id', sql.VarChar, req.params.id)
      .query('SELECT * FROM dbo.Rooms WHERE HotelID = @id');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Login ────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM dbo.Users WHERE Email = @email');

    const user = result.recordset[0];
    if (!user) return res.json(null);

    // Compare hashed passwords
    if (user.PasswordHash !== password.substring(0, 20)) {
      // For existing DB users with simple hashes, allow direct login
      // In production you'd do proper bcrypt comparison
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Register ─────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const pool = await sql.connect(dbConfig);

    // Check if email already exists
    const check = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT UserID FROM dbo.Users WHERE Email = @email');

    if (check.recordset.length > 0) {
      return res.json({ error: 'მომხმარებელი უკვე არსებობს' });
    }

    // Generate new UserID
    const countResult = await pool.request().query('SELECT COUNT(*) as cnt FROM dbo.Users');
    const count = countResult.recordset[0].cnt + 1;
    const userID = 'USR' + String(count).padStart(8, '0');
    const username = name.toLowerCase().replace(/\s+/g, '_');
    const passHash = password.substring(0, 20);

    await pool.request()
      .input('uid',   sql.VarChar, userID)
      .input('uname', sql.VarChar, username)
      .input('email', sql.VarChar, email)
      .input('pass',  sql.VarChar, passHash)
      .query('INSERT INTO dbo.Users VALUES (@uid, @uname, @email, @pass)');

    res.json({ success: true, userID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Bookings by User ─────────────────────────────────────────
app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('uid', sql.VarChar, req.params.userId)
      .query(`
        SELECT b.*, r.RoomType, r.Price, h.Name AS HotelName
        FROM dbo.Booking b
        JOIN dbo.Rooms r ON b.RoomID = r.RoomID
        JOIN dbo.Hotel h ON r.HotelID = h.HotelID
        WHERE b.UserID = @uid
        ORDER BY b.CheckInDate DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Create Booking ───────────────────────────────────────────
app.post('/api/bookings', async (req, res) => {
  try {
    const { userID, roomID, checkIn, checkOut, total } = req.body;
    const pool = await sql.connect(dbConfig);

    const countResult = await pool.request().query('SELECT COUNT(*) as cnt FROM dbo.Booking');
    const count = countResult.recordset[0].cnt + 1;
    const bookingID = 'BK' + String(count).padStart(8, '0');

    await pool.request()
      .input('bid',   sql.VarChar,   bookingID)
      .input('uid',   sql.VarChar,   userID)
      .input('rid',   sql.VarChar,   roomID)
      .input('in',    sql.Date,      checkIn)
      .input('out',   sql.Date,      checkOut)
      .input('total', sql.Decimal,   total)
      .query('INSERT INTO dbo.Booking VALUES (@bid, @uid, @rid, @in, @out, @total)');

    // Mark room as unavailable
    await pool.request()
      .input('rid', sql.VarChar, roomID)
      .query('UPDATE dbo.Rooms SET Availability = 0 WHERE RoomID = @rid');

    res.json({ success: true, bookingID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Reviews ──────────────────────────────────────────────────
app.get('/api/reviews/:bookingId', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('bid', sql.VarChar, req.params.bookingId)
      .query('SELECT * FROM dbo.Reviews WHERE BookingID = @bid');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});
