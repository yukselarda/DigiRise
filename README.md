# DigiRise

DigiRise, kullanıcıların veri girişini yönetmesine ve çeşitli dijital hizmetleri takip etmesine olanak tanıyan bir web uygulamasıdır. Bu proje, bir API ve bir istemci uygulamasından oluşur.

## Proje Yapısı

 **api**: Sunucu tarafı kodları içerir.
  - **config**: Konfigürasyon dosyaları.
  - **controllers**: İstekleri işleyen ve yanıtları dönen denetleyiciler.
  - **middlewares**: Ara katman yazılımları.
  - **models**: Veritabanı modelleri.
  - **routes**: API uç noktaları.
  - **uploads**: Yüklenen dosyaların depolandığı klasör.
  - **.env**: Çevresel değişkenler.
  - **package.json**: API bağımlılıkları ve komutları.
  - **server.js**: Uygulamanın başlangıç dosyası.
  
- **client**: İstemci tarafı kodları içerir.
  - **public**: Genel erişilebilir statik dosyalar.
  - **src**: React uygulama kodları.
    - **components**
      - **headers**
        - `Header.jsx`
      - **post**
        - `CommentModal.jsx`
        - `Post.jsx`
        - `post.css`
        - `Navbar.jsx`
        - `PostItem.jsx`
        - `ProfileHeader.jsx`
        - `ProfilePosts.jsx`
        - `Story.jsx`
    - **Context**
      - `Context.js`
    - **pages**
      - **Home**
        - `HomePage.jsx`
        - `home.css`
      - **Login**
        - `LoginPage.jsx`
        - `login.css`
      - **Post**
        - `CreatePostPage.jsx`
        - `post.css`
      - **Profile**
        - `UserProfilePage.jsx`
        - `profile.css`
      - **Signup**
        - `SignupPage.jsx`
        - `signup.css`
    - **App.css**: Uygulamanın stil dosyası.
    - **App.jsx**: Ana uygulama bileşeni.
    - **index.js**: Uygulamanın giriş dosyası.
    - **setupTests.js**: Test kurulum dosyası.
    - **logo.svg**: Uygulama logosu.


## Başlangıç

### Gereksinimler

- Node.js
- npm veya yarn

### Kurulum

Projenin kök dizininde aşağıdaki komutları çalıştırarak hem sunucu hem de istemci bağımlılıklarını yükleyin:

#### API bağımlılıklarını yükleyin
cd api
npm install

#### İstemci bağımlılıklarını yükleyin
cd ../client
npm install

### Çalıştırma

- **Sunucu**: API sunucusunu başlatmak için:

cd api
node --watch server
 
 - Bu komut, sunucuyu başlatır ve belirtilen port üzerinde dinlemeye başlar.

- **İstemci**: React uygulamasını başlatmak için:

cd client
npm start
 
 - Bu komut, istemci uygulamasını başlatır ve tarayıcıda otomatik olarak açılır.

## Kullanılan Teknolojiler

 **İstemci**
  - **React**: Kullanıcı arayüzü oluşturmak için.
  - **Redux**: İstDurum yönetimi için.
  - **React Router**: Sayfa yönlendirmeleri için..
  - **Axios**: API istekleri için.
  - **Ant Design**: UI bileşenleri için.
  - **React Toastify**: Bildirimler için.

 **Sunucu**
  - **Express**: Sunucu çatısı.
  - **Mongoose**: MongoDB etkileşimleri için.
  - **Multer**: Dosya yüklemeleri için.
  - **Cors**: Çapraz kaynak paylaşımı için.
  - **Body-Parser**:İstek gövdesi ayrıştırma için.
  - **Dotenv**: Çevresel değişken yönetimi için.
  - **Bcryptjs**: Şifreleme için.

  ## Proje Komutları

 **API**
  - **node --watch server**: Sunucuyu başlatır.
  - **npm run dev**: Nodemon ile sunucuyu başlatır.

 **İstemci**
  - **npm start**: Sunucuyu başlatır.
  - **npm run dev**: Nodemon ile sunucuyu başlatır.
  - **npm test**: Testleri çalıştırır.
  - **npm run dev**: React Scripts konfigürasyonunu dışarı çıkarır.

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için LICENSE dosyasına bakabilirsiniz.

Bu güncellenmiş `README.md` dosyası, DigiRise projenizin yapısını ve kullanılacak komutları daha ayrıntılı bir şekilde açıklamaktadır. Başka eklemek istediğiniz bir şey varsa, lütfen bana bildirin.
