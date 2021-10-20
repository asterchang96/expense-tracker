# expense-tracker

這是一個 Node.js + Express 打造的記帳簿，你可以在[這裡](https://shrouded-basin-53328.herokuapp.com/)看到

  - 預設使用者帳號 : root@example.com
  - 預設使用者密碼:12345678


## 產品功能

使用者可以註冊帳號並登入，使用自己的支出記帳，系統提供以下功能：
  - 首頁可以看到所有支出項目與它們的簡單資料
  - 點選選擇列進行"不同類別"、"時段"搜尋
  - 可以新增收入/支出資料
  - 可以重新編輯收入/支出資料
  - 可以刪除收入/支出資料
  - 使用者可以修改名稱、照片

## 環境建置與需求

- [Visual Studio Code for Win](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/en/)
- [Express](https://www.npmjs.com/package/express)
- [Express-Handlebars](https://www.npmjs.com/package/express-handlebars)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [handlebars-helpers](https://www.npmjs.com/package/handlebars-helpers)
- [handlebars](https://www.npmjs.com/package/handlebars)
- [method-override](https://www.npmjs.com/search?q=method-override)
- [passport](https://www.npmjs.com/package/passport)
- [passport-facebook](https://www.npmjs.com/package/passport-facebook)
- [express-session](https://www.npmjs.com/package/express-session)
- [dotenv](https://www.npmjs.com/package/dotenv)

## 安裝流程

1. 打開你的終端機(terminal)，Clone 此專案至本機電腦

```
git clone https://github.com/asterchang96/expense-tracker.git
```

2. 進入至專案資料夾

```
cd expense-tracker
```

3. 安裝 npm 相關套件

```
npm install
```

4. 載入預設資料

```
npm run seed
```

5. 將 .env.example 修改為 .env

  如果想嘗試第三方登入，需要先在 [Facebook for Developers](https://developers.facebook.com/?no_redirect=1) 中建立應用程式，將應用程式編號和密鑰填入 .env，即可使用 facebook login 功能。

6. 啟動專案

```
npm run dev
```

5. 當終端機(terminal) 出現以下字樣，代表執行成功

```
Express is listening on localhost: 3000.
```

請至 [http://localhost:3000](http://localhost:3000)



## 成果截圖

![登入註冊頁](./users-login.png)
![主頁](./homePage.png)

## 開發者

[AsterChang](https://github.com/asterchang96)
