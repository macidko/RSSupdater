@echo off
cd /d "%~dp0"    // .bat dosyasının bulunduğu dizine geçiş yap

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
