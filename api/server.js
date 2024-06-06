const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const path = require("path");
const port = 5000;

const authRoute = require("./routes/authRoutes");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");

dotenv.config();

const connect = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DigiRise veritabanına bağlanıldı.");
        return true; 
    } catch (error) {
        console.error("MongoDB bağlantı hatası:", error);
        return false;
    }
};

let retryCount = 0; 
const maxRetries = 10; 

async function connectWithRetry() {
    while (retryCount < maxRetries) {
        console.log(`MongoDB'ye bağlanmaya çalışılıyor... (Deneme ${retryCount + 1})`);
        const connected = await connect();
        if (connected) {
            console.log("MongoDB'ye başarıyla bağlanıldı.");
            return; 
        }

        const retryDelay = Math.pow(2, retryCount) * 1000;
        console.log(`Bağlantı hatası. ${retryDelay / 1000} saniye sonra tekrar denenecek.`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        retryCount++;
    }

    console.error("MongoDB'ye bağlanılamadı. Uygulama sonlandırılıyor.");
    process.exit(1);
}

// Bağlantı denemesini başlat
connectWithRetry();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Statik dosyaları sunmak için middleware
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);

app.listen(port, () => {
    connect();
    console.log(`Sunucu ${port} portunda çalışıyor`);
});
