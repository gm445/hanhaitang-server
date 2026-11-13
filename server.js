const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // 允许前端跨域访问
app.use(bodyParser.json());

// 连接/创建 SQLite 数据库
const db = new sqlite3.Database('./hanhaitang.db');

// 初始化建表
db.run(`
  CREATE TABLE IF NOT EXISTS leaderboard (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerName TEXT,
    prestige INTEGER,
    noDamageHp INTEGER,
    clearTime REAL,
    date TEXT
  )
`);

// 接口 1：保存分数
app.post('/api/save', (req, res) => {
  const { playerName, prestige, noDamageHp, clearTime, date } = req.body;
  const sql = `INSERT INTO leaderboard (playerName, prestige, noDamageHp, clearTime, date) VALUES (?, ?, ?, ?, ?)`;
  db.run(sql, [playerName, prestige, noDamageHp, clearTime, date], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: this.lastID });
  });
});

// 接口 2：获取排行榜
app.get('/api/list', (req, res) => {
  db.all(`SELECT * FROM leaderboard`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 启动服务器
app.listen(3000, () => {
  console.log('🚀 后端服务器已启动：http://localhost:3000');
});