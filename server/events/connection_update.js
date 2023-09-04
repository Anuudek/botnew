"◎☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱( Ⓒ𝐁𝐥𝐨𝐨𝐦𝐁𝐨𝐭 (𝐦𝐮𝐥𝐭𝐢-𝐝𝐞𝐯𝐢𝐜𝐞) 𝐛𝐲 𝐌𝐚𝐠𝐧𝐞𝐮𝐦™ )☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱◎";
//  ╔⧉༻ Ⓒ𝐁𝐥𝐨𝐨𝐦𝐁𝐨𝐭 (𝐦𝐮𝐥𝐭𝐢-𝐝𝐞𝐯𝐢𝐜𝐞) 𝐛𝐲 𝐌𝐚𝐠𝐧𝐞𝐮𝐦™
//  ║>>  is a whatsapp user-bot with automation, moderation, music, games and more of 200+ commands!
//  ║
//  ║
//  ║⦁> 🌟 A versatile whatsApp multi-purpose bot designed for group management and user convenience.
//  ║⦁> 🚀 Simplifies group management tasks and enhances the overall user experience.
//  ║⦁> ⚠️ Please note: Engaging in spamming activities may lead to account suspension. Use responsibly!
//  ║⦁> 🎉 BloomBot is intended for fun and convenience, but we're not responsible for account bans.
//  ║⦁> 🔀 forking the repository is allowed, but customized versions or modified plugins are unsupported.
//  ║⦁> ⚠️ Exercise caution and take responsibility for any modifications made to the bot.
//  ║⦁> 📞 Need assistance or have issues? Contact our developers.
//  ║⦁> 🔄 We'll continue providing updates and support for the original version of the bot.
//  ║⦁> 👉 Enjoy the features and functionality of BloomBot responsibly! Make the most out of your
//  ║    whatsApp group management experience! 🎉
//  ║
//  ║     🚨𝐔𝐬𝐚𝐠𝐞 𝐍𝐨𝐭𝐢𝐜𝐞🚨
//  ║⦁>    ⒸBloomBot is in no way affiliated with, authorized, maintained,
//  ║⦁>    sponsored or endorsed by whatsApp or any of its affiliates or
//  ║⦁>    subsidiaries. This is an independent and unofficial software.
//  ║⦁>    Use at your own risk.
//  ║
//  ╚◎ ⚙️Developers: +918436686758, +918250889325
"◎☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱( Ⓒ𝐁𝐥𝐨𝐨𝐦𝐁𝐨𝐭 (𝐦𝐮𝐥𝐭𝐢-𝐝𝐞𝐯𝐢𝐜𝐞) 𝐛𝐲 𝐌𝐚𝐠𝐧𝐞𝐮𝐦™ )☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱☱◎";
require("@/config/index.js");
const { Boom } = require("@hapi/boom");
const { exec } = require("child_process");
const dbdata = require("@/config/dbdata.js");
const purgepg = require("@/client/purgepg.js");
const { DisconnectReason } = require("@whiskeysockets/baileys");

module.exports = async (BloomBot, magneum, logger) => {
  const dbrem = async () => {
    if (dbdata.DATABASE_URL.includes("postgres")) {
      try {
        await purgepg();
      } catch (error) {
        logger.error("❌ Ocorreu um erro ao limpar o banco de dados: ", error);
      }
      process.exit(0);
    } else {
      exec("rm -rf ./server/database/sql/auth.db");
      process.exit(0);
    }
  };

  BloomBot.ev.on("connection.update", async (update) => {
    const {
      qr,
      connection,
      isNewLogin,
      lastDisconnect,
//      receivedPendingNotifications,
    } = update;

    switch (connection) {
      case "connecting":
        logger.info("📢 Conectando ao WhatsApp.");
        break;
      case "open":
        logger.info("📢 Login bem-sucedido! Conexão com WhatsApp estabelecida.");
        break;
      case "close":
        let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
        logger.info(reason);
        switch (reason) {
          case DisconnectReason.badSession:
            logger.error("❌ Arquivo de sessão inválido detectado.");
            await dbrem();
            await magneum();
            break;
          case DisconnectReason.connectionClosed:
            logger.error(
              "❌ A conexão foi fechada inesperadamente. Reconectando ao WhatsApp."
            );
            await magneum();
            break;
          case DisconnectReason.connectionLost:
            logger.error(
              "❌ Conexão perdida do servidor. Reconectando ao WhatsApp."
            );
            await magneum();
            break;
          case DisconnectReason.connectionReplaced:
            logger.error(
              "❌ Conexão substituída. Foi aberta outra nova sessão. Feche a sessão atual antes de estabelecer uma nova conexão."
            );
            break;
          case DisconnectReason.loggedOut:
            logger.error(
              "❌ Dispositivo desconectado. Digitalize novamente e execute o programa para estabelecer uma nova sessão."
            );
            await dbrem();
            await magneum();
            break;
          case DisconnectReason.restartRequired:
            logger.debug("🐞 É necessário reiniciar. Reiniciando o programa.");
            await magneum();
            break;
          case DisconnectReason.timedOut:
            logger.error("❌ A conexão expirou. Reconectando ao WhatsApp.");
            await magneum();
            break;
          default:
            logger.error("❌ Motivo de desconexão desconhecido: " + reason, connection);
            await dbrem();
            await magneum();
            break;
        }
        break;
      case true:
        logger.debug("📢 O usuário está on-line. A conexão do WhatsApp está ativa.");
        break;
      case false:
        logger.error("📢 O usuário está off-line. A conexão do WhatsApp está inativa.");
        break;
      default:
/*        if (receivedPendingNotifications === true) {
          logger.debug("📢 Notificações pendentes recebidas. Em processamento.");
        } else if (receivedPendingNotifications === false) {
          logger.error("📢 Nenhuma notificação pendente recebida.");
        } else */if (isNewLogin === true) {
          logger.debug(
            "📢 Novo login detectado. O usuário efetuou login com sucesso."
          );
        } else if (isNewLogin === false) {
          logger.error("📢 O usuário não está realizando um novo login.");
        } else if (qr) {
          logger.info(
            "Código QR recebido. Por favor, leia o seguinte código QR para fazer login:"
          );
          console.log(qr);
        } else {
          logger.info("📢 Evento de conexão recebido:", update);
        }
        break;
    }
  });

  return BloomBot;
};
