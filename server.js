const express = require('express');
const mysql = require('mysql2/promise'); // Menggunakan promise-based
const cors = require('cors');
const app = express();
const port = 3000;

// Koneksi ke database
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sumatera_barat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};


// Membuat connection pool
const pool = mysql.createPool(dbConfig);

// Middleware
app.use(cors());
app.use(express.json());

// Endpoint API GeoJSON
app.get('/api/geojson-data', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT province, district, sub_district, geojson FROM geo_data');
    
    const formatted = results.map(row => ({
      province: row.province,
      district: row.district,
      sub_district: row.sub_district,
      geojson: JSON.parse(row.geojson)
    }));

    res.json(formatted);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data geojson' });
  }
});

// Endpoint untuk data PDRB ADHB
app.get('/api/pdrb_adhb', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2019`, `2020`, `2021`, `2022`, `2023` FROM pdrb_adhb');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data PDRB ADHB' });
  }
});

// Endpoint untuk data PDRB ADHK
app.get('/api/pdrb_adhk', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2019`, `2020`, `2021`, `2022`, `2023` FROM pdrb_adhk');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data PDRB ADHK' });
  }
});

app.get('/api/jumlah_kemiskinan', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2020`, `2021`, `2022`, `2023`, `2024` FROM jumlah_kemiskinan');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jumlah kemiskinan' });
  }
});

app.get('/api/ketimpangan_regional', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2020`, `2021`, `2022`, `2023`, `2024` FROM ketimpangan_regional');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jumlah kemiskinan' });
  }
});

app.get('/api/persentase_kemiskinan', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2020`, `2021`, `2022`, `2023`, `2024` FROM persentase_kemiskinan');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jumlah kemiskinan' });
  }
});

app.get('/api/pertumbuhan_ekonomi', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2019`, `2020`, `2021`, `2022`, `2023` FROM pertumbuhan_ekonomi');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jumlah kemiskinan' });
  }
});

app.get('/api/kebakaran', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT KabKota, `2020`, `2021`, `2022`, `2023`, `2024` FROM kebakaran');
    res.json(results);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil data jumlah kemiskinan' });
  }
});

// Endpoint untuk mendapatkan daftar kabupaten/kota
app.get('/api/kabupaten', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT district FROM geo_data ORDER BY district');
    const kabupatenList = results.map(row => row.district);
    res.json(kabupatenList);
  } catch (err) {
    console.error('Query error:', err);
    res.status(500).json({ error: 'Gagal mengambil daftar kabupaten' });
  }
});


// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await pool.end();
  process.exit();
});