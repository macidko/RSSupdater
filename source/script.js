const ftp = require("basic-ftp");
const fs = require('fs');
const readline = require('readline');
const Parser = require('rss-parser');
const parser = new Parser();
let baslik, type, aciklama, url;


async function uploadFileToFTP(localFile, remotePath, host, username, password) {
  const client = new ftp.Client();

  try {
    await client.access({
      host: host,
      user: username,
      password: password,
      secure: false,
    });

    await client.uploadFrom(localFile, remotePath);
    console.log("Duyuru başarıyla eklendi. Pencereyi kapatabilirsiniz.");
  } catch (err) {
    console.log("Dosya yüklenirken hata oluştu: ", err);
  }

  client.close();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

const main = async () => {
  baslik = await askQuestion('Duyuru Başlığı Giriniz: ');

  type = await askQuestion('Duyuru Türü Giriniz (Düğün, sünnet vb.): ');

  aciklama = await askQuestion('Duyuru Açıklaması Giriniz: ');

  date = await askQuestion('Duyuru Tarihi Giriniz: ');

  url = await askQuestion('Duyuru Görseli Linki Giriniz(Yoksa boş bırakınız): ');

  let urlFormat = url.replace(/&/g, '&amp;')


  rl.close();

  const updateRSS = async () => {
    let xml = fs.readFileSync('./source/rss.xml', 'utf8');
    const startIndex = xml.indexOf("<item>");
    const endIndex = xml.indexOf("</channel>");
    const header = xml.substring(0, startIndex);
    const footer = xml.substring(endIndex);
    const body = xml.substring(startIndex, endIndex);

    
    const item = `
    <item>
    <title>${baslik}</title>
    <type>${type}</type>
    <description>${aciklama}</description>
    <date>${date}</date>
    <enclosure>
    <url>${urlFormat}</url>
    </enclosure>
    </item>
    `;
    
    xml = header + body + item + footer;
    
    // xml = xml.replace(/&/g, '&amp;')
    
    fs.writeFileSync('./source/rss.xml', xml); // Değişiklikleri dosyaya kaydet
    // console.log('RSS dosyası başarıyla güncellendi.');
    await uploadFileToFTP(
      "./source/rss.xml",
      "./public_html/rss.xml",
      "files.000webhost.com",
      "seremkoy",
      "Qwerty123*"
    );
  };

  await updateRSS();
};

main();
