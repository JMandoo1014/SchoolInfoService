require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors()); // CORS 허용

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const SCHOOL_CODE = process.env.SCHOOL_CODE;
const OFFICE_CODE = process.env.OFFICE_CODE;

app.use(express.static(path.join(__dirname, 'public')));


const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '');

// 급식 api 요청
app.get('/api/meal', async (req, res) => {
    const { type } = req.query;
    const today = new Date();
    let url = `${BASE_URL}?Type=json&ATPT_OFCDC_SC_CODE=${OFFICE_CODE}&SD_SCHUL_CODE=${SCHOOL_CODE}&KEY=${API_KEY}`;

    if (type === 'today') {
        url += `&MLSV_YMD=${formatDate(today)}`;
    } else if (type === 'week') {
        let start = new Date();
        start.setDate(today.getDate() - today.getDay());
        url += `&MLSV_FROM_YMD=${formatDate(start)}&MLSV_TO_YMD=${formatDate(today)}`;
    } else if (type === 'month') {
        let start = new Date(today.getFullYear(), today.getMonth(), 1);
        let end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        url += `&MLSV_FROM_YMD=${formatDate(start)}&MLSV_TO_YMD=${formatDate(end)}`;
    }

    try {
        const response = await fetch(url);
        console.log("Response Status:", response.status); // 응답 상태 확인

        if (response.status === 301 || response.status === 302) {
            const redirectUrl = response.headers.get("location");
            console.log("Redirecting to:", redirectUrl);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching meal data:", error);
        res.status(500).json({ error: "Failed to fetch meal data" });
    }
});

// 페이지 라우팅
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/map', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/map/index.html')); // 기존 구조도 페이지
});

app.get('/meal', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/meal/index.html')); // 급식 정보 페이지
});

app.listen(port, () => {
    console.log(`server running`);
});
