const steam = require('steam-user');
const readline = require('readline');
const games = require('./steam-games.json');

const user = new steam();
const readInterface = readline.createInterface({input: process.stdin, output: process.stdout});

class SteamBoost {
    constructor() {
        this.dataAccount = [];
        this.init();
    };

    init() {
        this.initDataAccount();
    };

    initDataAccount() {
        readInterface.question('Steam Kullanıcı adınızı giriniz: ', login => {
            this.dataAccount.push(login);

            readInterface.question('Steam şifrenizi giriniz: ', password => {
                this.dataAccount.push(password);
                this.SteamInitConnect();
            });
        });
    };

    SteamInitConnect() {
        console.log('Giriş yapılıyor...');

        if (this.dataAccount[0] == '' || this.dataAccount[1] == '') {
            console.log('Kullancı adı veya şifre girilmemiş.');
            process.exit();
        };

        user.logOn({accountName: this.dataAccount[0], password: this.dataAccount[1]});
        user.on('steamGuard', (domain, callback) => {
            domain == null ? console.log('Mobil kimlik doğrulayıcısı tespit edildi.') : console.log(`Mail doğrulaması tespit edildi. (${domain}).`);

            readInterface.question('Doğrulama kodunu giriniz: ', code => {
                callback(code);
                readInterface.close();
            });
        });

        user.on('loggedOn', _ => {
            console.log('Giriş yapıldı.');

            user.setPersona(steam.EPersonaState.Online);
            user.gamesPlayed(games['app-id']);

            console.log('Oyun(-lar) çalışıyor.');
        });

        user.on('error', e => {
            console.log(`Hata oluştu: ${e.message}`);
            console.log(`Lütfen tekrar deneyiniz!`);
            
            process.exit();
        });
    };
};

module.exports = SteamBoost;