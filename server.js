const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const dbConfig = {
  host: 'zephyr.proxy.rlwy.net',
  port: 16063,
  user: 'root',
  password: 'VZFlYqQDZBaXRBqZEMbKQlCPAgTPzgVz',
  database: 'railway'
};

async function query(sql, params) {
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute(sql, params);
  await conn.end();
  return rows;
}

app.get('/api/hotels', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Hotel');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/hotels/:id/rooms', async (req, res) => {
  try {
    const rows = await query('SELECT * FROM Rooms WHERE HotelID = ?', [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const rows = await query('SELECT * FROM Users WHERE Email = ?', [email]);
    if (!rows.length) return res.json(null);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const existing = await query('SELECT UserID FROM Users WHERE Email = ?', [email]);
    if (existing.length > 0) {
      return res.json({ error: 'მომხმარებელი უკვე არსებობს' });
    }
    const countRows = await query('SELECT COUNT(*) as cnt FROM Users');
    const count = countRows[0].cnt + 1;
    const userID = 'USR' + String(count).padStart(8, '0');
    const username = name.toLowerCase().replace(/\s+/g, '_');
    const passHash = password.substring(0, 20);
    await query(
      'INSERT INTO Users (UserID, Username, Email, PasswordHash) VALUES (?, ?, ?, ?)',
      [userID, username, email, passHash]
    );
    res.json({ success: true, userID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/bookings/:userId', async (req, res) => {
  try {
    const rows = await query(`
      SELECT b.*, r.RoomType, r.Price, h.Name AS HotelName
      FROM Booking b
      JOIN Rooms r ON b.RoomID = r.RoomID
      JOIN Hotel h ON r.HotelID = h.HotelID
      WHERE b.UserID = ?
      ORDER BY b.CheckInDate DESC
    `, [req.params.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const { userID, roomID, checkIn, checkOut, total } = req.body;
    const countRows = await query('SELECT COUNT(*) as cnt FROM Booking');
    const count = countRows[0].cnt + 1;
    const bookingID = 'BK' + String(count).padStart(8, '0');
    await query(
      'INSERT INTO Booking (BookingID, UserID, RoomID, CheckInDate, CheckOutDate, TotalPrice) VALUES (?, ?, ?, ?, ?, ?)',
      [bookingID, userID, roomID, checkIn, checkOut, total]
    );
    await query('UPDATE Rooms SET Availability = 0 WHERE RoomID = ?', [roomID]);
    res.json({ success: true, bookingID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  app.get('/api/tables', async (req, res) => {
  try {
    const rows = await query('SHOW TABLES');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
  console.log(`Server running on port ${PORT}`);
});