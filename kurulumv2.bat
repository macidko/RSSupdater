@echo off

REM Node.js yüklü mü diye kontrol ediyoruz
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js yüklü değil. Node.js indiriliyor ve kuruluyor...
    echo.

    REM Node.js'i indirip kurma komutları
    REM Daha güncel indirme bağlantısını buraya ekleyebilirsiniz
    REM Örneğin: https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi
    REM İndirilen dosya adını ve yolunu değiştirmeyi unutmayın
    bitsadmin /transfer nodeInstaller /download /priority normal https://nodejs.org/dist/v14.17.0/node-v14.17.0-x64.msi "%~dp0\node-v14.17.0-x64.msi"
    start /wait msiexec /i "%~dp0\node-v14.17.0-x64.msi" /qn
    del "%~dp0\node-v14.17.0-x64.msi"

    echo Node.js başarıyla kuruldu.
    echo.
)

cd /d "%~dp0"    REM .bat dosyasının bulunduğu dizine geçiş yap

if exist source\package.json (
    echo package.json dosyası bulundu. Paketler yükleniyor...
    cd source
    npm install
    echo Paketler başarıyla yüklendi.
) else (
    echo source klasöründe package.json dosyası bulunamadı.
    echo Lütfen doğru dizinde çalıştırdığınızdan emin olun.
)

pause
