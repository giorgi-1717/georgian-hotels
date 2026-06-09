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
    const rows = await query('SELECT * FROM Users WHERE Email = ? AND PasswordHash = ?', [email, password]);
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
    const passHash = password;
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
    const countRows = await query('SELECT MAX(CAST(SUBSTRING(BookingID, 3) AS UNSIGNED)) as maxId FROM Booking');
    const maxId = countRows[0].maxId || 0;
    const bookingID = 'BK' + String(maxId + 1).padStart(8, '0');
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
app.get('/api/setup', async (req, res) => {
  try {
    await query(`CREATE TABLE IF NOT EXISTS Hotel (
      HotelID VARCHAR(6) PRIMARY KEY,
      Name VARCHAR(255) NOT NULL,
      Location VARCHAR(255) NOT NULL,
      StarRating DECIMAL(2,1) NOT NULL,
      Email VARCHAR(255) NOT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS Rooms (
      RoomID VARCHAR(6) PRIMARY KEY,
      HotelID VARCHAR(6) NOT NULL,
      RoomType VARCHAR(50) NOT NULL,
      Price DECIMAL(10,2) NOT NULL,
      Availability TINYINT(1) NOT NULL DEFAULT 1,
      Features TEXT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS Users (
      UserID VARCHAR(11) PRIMARY KEY,
      Username VARCHAR(100) NOT NULL,
      Email VARCHAR(255) NOT NULL,
      PasswordHash VARCHAR(255) NOT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS Booking (
      BookingID VARCHAR(10) PRIMARY KEY,
      UserID VARCHAR(11) NOT NULL,
      RoomID VARCHAR(6) NOT NULL,
      CheckInDate DATE NOT NULL,
      CheckOutDate DATE NOT NULL,
      TotalPrice DECIMAL(10,2) NOT NULL
    )`);

    await query(`CREATE TABLE IF NOT EXISTS Reviews (
      ReviewID VARCHAR(5) PRIMARY KEY,
      Comment TEXT NULL,
      BookingID VARCHAR(10) NOT NULL,
      Rating DECIMAL(2,1) NOT NULL
    )`);

    await query(`INSERT IGNORE INTO Hotel (HotelID, Name, Location, StarRating, Email) VALUES
      ('HTL001','Grand Sheraton Metexi Palace','Tbilisi, Georgia',5.0,'contact@grandpalace.com'),
      ('HTL002','Sheraton Batumi','Batumi, Georgia',4.0,'info@seasideretreat.com'),
      ('HTL003','Gudauri Lodge','Gudauri, Georgia',4.5,'hello@mountainlodge.ge'),
      ('HTL004','City Center Hotel','Tbilisi, Georgia',4.0,'stay@citycenter.com'),
      ('HTL005','Tbilisi Marriott','Tbilisi, Georgia',5.0,'reserve@tbilisimarriott.ge'),
      ('HTL006','Biltmore','Tbilisi, Georgia',5.0,'reserve@biltmorehotel.ge'),
      ('HTL007','Radisson Blu','Tbilisi, Georgia',5.0,'info@radissonblu.ge'),
      ('HTL008','Rooms Hotel Kazbegi','Stepantsminda, Georgia',5.0,'kazbegi@roomshotels.com'),
      ('HTL009','Stamba Hotel','Tbilisi, Georgia',5.0,'info@stambahotel.com'),
      ('HTL010','Rooms Hotel Tbilisi','Tbilisi, Georgia',4.5,'tbilisi@roomshotels.com'),
      ('HTL011','Lopota Lake Resort & Spa','Napareuli, Georgia',5.0,'info@lopota.ge'),
      ('HTL012','The Telegraph Hotel','Tbilisi, Georgia',5.0,'stay@telegraphhotel.ge'),
      ('HTL013','Paragraph Resort & Spa','Shekvetili, Georgia',5.0,'info@paragraphresort.ge'),
      ('HTL014','Steel Tower Borjomi','Borjomi, Georgia',4.0,'stay@steeltower.ge'),
      ('HTL015','Crowne Plaza Borjomi','Borjomi, Georgia',5.0,'info@cplazaborjomi.ge'),
      ('HTL016','Hotel Kolkhi','Kutaisi, Georgia',4.0,'info@hotelkolkhi.ge'),
      ('HTL017','Rooms Hotel Batumi','Batumi, Georgia',5.0,'batumi@roomshotels.com'),
      ('HTL018','Bioli Wellness Resort','Tbilisi, Georgia',5.0,'info@bioli.ge'),
      ('HTL019','Chateau Mere','Telavi, Georgia',4.5,'info@chateaumere.ge'),
      ('HTL020','Sante Palace','Sighnaghi, Georgia',4.0,'stay@santepalace.ge'),
      ('HTL021','Hotel Lahili','Mestia, Georgia',4.5,'info@lahili.ge'),
      ('HTL022','Gistola Hotel','Mestia, Georgia',4.0,'stay@gistolahotel.ge'),
      ('HTL023','Hilltop Mestia','Mestia, Georgia',4.0,'info@hilltopmestia.ge'),
      ('HTL024','Hotel Savaneti','Telavi, Georgia',4.5,'info@hotelsavaneti.ge'),
      ('HTL025','Chateau Khashmi','Kakheti, Georgia',4.5,'stay@chateaukhashmi.ge'),
      ('HTL026','Hotel British House','Tbilisi, Georgia',4.0,'info@britishhouse.ge'),
      ('HTL027','Hotel Horizon Kazbegi','Stepantsminda, Georgia',4.5,'info@horizonkazbegi.ge'),
      ('HTL028','Paradiso Resort Mestia','Mestia, Georgia',4.5,'info@paradisoMestia.ge'),
      ('HTL029','Mit Hotel Tbilisi','Tbilisi, Georgia',4.5,'info@mithotel.ge'),
      ('HTL030','S&L Boutique Hotel','Tbilisi, Georgia',5.0,'info@slboutique.ge'),
      ('HTL031','Brosse Garden Hotel','Tbilisi, Georgia',4.5,'stay@brossegarden.ge'),
      ('HTL032','Kakhshiani Mestia Cottages','Mestia, Georgia',4.0,'info@kakhshiani.ge'),
      ('HTL033','Le Meridien Batumi','Batumi, Georgia',5.0,'info@lemeridienbatumi.ge'),
      ('HTL034','Tbilisi Marriott Courtyard','Tbilisi, Georgia',4.0,'info@courtyardtbilisi.ge'),
      ('HTL035','Stamba Hotel Batumi','Batumi, Georgia',5.0,'info@stambabatumi.ge')`);

    await query(`INSERT IGNORE INTO Rooms (RoomID, HotelID, RoomType, Price, Availability, Features) VALUES
      ('RM0001','HTL001','Suite',850.00,1,'King bed, Jacuzzi, City view, Mini bar'),
      ('RM0002','HTL001','Deluxe Double',420.00,1,'Queen bed, Balcony, River view'),
      ('RM0003','HTL002','Ocean Suite',620.00,0,'King bed, Private pool, Ocean view'),
      ('RM0004','HTL002','Standard',180.00,1,'Twin beds, Garden view'),
      ('RM0005','HTL003','Chalet Room',310.00,1,'King bed, Mountain view, Fireplace'),
      ('RM0006','HTL004','Economy Single',120.00,1,'Single bed, City view, Shared lounge'),
      ('RM0007','HTL005','Presidential',1200.00,1,'King bed, Private pool, Butler service'),
      ('RM0008','HTL005','Deluxe King',480.00,0,'King bed, City view, Spa access'),
      ('RM0009','HTL006','Junior Suite',550.00,1,'King bed, Lounge area, City view'),
      ('RM0010','HTL007','Deluxe Room',390.00,1,'Queen bed, City view, Breakfast included'),
      ('RM0011','HTL008','Mountain Suite',780.00,1,'King bed, Panoramic mountain view, Fireplace'),
      ('RM0012','HTL008','Standard Room',320.00,1,'Twin beds, Mountain view'),
      ('RM0013','HTL009','Loft Suite',920.00,1,'King bed, Industrial design, Rooftop access'),
      ('RM0014','HTL010','Deluxe Room',410.00,1,'Queen bed, City view, Mini bar'),
      ('RM0015','HTL011','Lake Suite',850.00,1,'King bed, Lake view, Private terrace'),
      ('RM0016','HTL012','Heritage Room',500.00,1,'Queen bed, Historic decor, City view')`);

    await query(`INSERT IGNORE INTO Users (UserID, Username, Email, PasswordHash) VALUES
      ('USR00000001','giorgi_k','giorgi.k@email.com','hash_gior_001'),
      ('USR00000002','nino_t','nino.t@email.com','hash_nino_002'),
      ('USR00000017','giorgi_tal','talaxadzegiorgi17@gmail.com','hash_giot_017')`);

    res.json({ success: true, message: "Database setup complete!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await query('SELECT UserID FROM Users WHERE Email = ?', [email]);
    if (!existing.length) {
      return res.json({ error: 'ელ-ფოსტა ვერ მოიძებნა' });
    }
    await query('UPDATE Users SET PasswordHash = ? WHERE Email = ?', [password, email]);
    res.json({ success: true });
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