export class Utils {
  sock;
  msg;
  id;

  constructor(sock, msg) {
    this.sock = sock;
    this.msg = msg;
    this.id = msg.messages[0].key.remoteJid;
  }

  async reply(content, options = {}) {
    if (typeof content == "string") content = { text: content };
    await this.sock.sendMessage(this.msg.messages[0].key.remoteJid, content, {
      quoted: this.msg.messages[0],
      ...options,
    });
  }

  simulate(type) {
    if (type == "typing")
      this.sock.sendPresenceUpdate(
        "composing",
        this.msg.messages[0].key.remoteJid
      );
    if (type == "recording")
      this.sock.sendPresenceUpdate(
        "recording",
        this.msg.messages[0].key.remoteJid
      );
  }

  async fetchGroup() {
    /**
    const getGroupIds = async (sock) => {
      try {
        console.log(chalk.blue("Fetching all group IDs..."));

        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups); // Mengambil semua ID grup

        console.log(chalk.green("Groups found:"));
        groupIds.forEach((id, index) => {
          console.log(`${index + 1}. ${id} (${groups[id]?.subject})`);
        });

        return groupIds;
      } catch (error) {
        console.error(chalk.red("Failed to fetch group IDs:"), error);
      }
    };

     */

    let result = [];
    try {
      const groups = await this.sock.groupFetchAllParticipating();
      const groupIds = Object.keys(groups);
      for (let groupId of groupIds) {
        try {
          // const groupPictureUrl = await this.sock.groupPictureUrl(groupId);
          const ppUrl = await this.sock.profilePictureUrl(groupId, "image");
          const groupSubject = groups[groupId]?.subject;
          result.push({
            groupId: groupId,
            groupSubject: groupSubject,
            groupPictureUrl: ppUrl,
          });
        } catch (err) {
          return err;
        }
      }
      return result;
    } catch (error) {
      return error;
    }
  }

  async getMessages() {
    const message = this.msg?.messages[0]?.message;
    if (!message) {
      return "";
    }
    const messageType = Object.keys(message)[0];
    return messageType === "conversation"
      ? message.conversation
      : messageType === "extendedTextMessage"
      ? message.extendedTextMessage.text
      : messageType === "imageMessage"
      ? message.imageMessage.caption
      : messageType === "videoMessage"
      ? message.videoMessage.caption
      : "";
  }

  async args(exceptFirst = false) {
    let t = await this.getMessages();
    t = t.split(" ");
    if (exceptFirst) {
      return t.slice(1).join(" ");
    } else {
      return t;
    }
  }

  determineFileType(buffer) {
    if (buffer.length < 4) {
      return { mime: "application/octet-stream", ext: "bin" };
    }
    const header = buffer.toString("hex", 0, 4);
    switch (header) {
      case "89504e47":
        return { mime: "image/png", ext: "png" };
      case "ffd8ffe0":
      case "ffd8ffe1":
      case "ffd8ffe2":
        return { mime: "image/jpeg", ext: "jpg" };
      case "47494638":
        return { mime: "image/gif", ext: "gif" };
      case "25504446":
        return { mime: "application/pdf", ext: "pdf" };
      case "504b0304":
        return { mime: "application/zip", ext: "zip" };
      default:
        return { mime: "application/octet-stream", ext: "bin" };
    }
  }
  getName(jid) {
    if (jid === "0@s.whatsapp.net") {
      return "WhatsApp";
    }
    for (const chatKey in store.messages) {
      if (store.messages.hasOwnProperty(chatKey)) {
        const usersArray = store.messages[chatKey].array;
        const userMsgs = usersArray.filter(
          (m) => m.sender === jid && m?.pushName
        );
        if (userMsgs.length !== 0) {
          return userMsgs[userMsgs.length - 1].pushName;
        }
      }
    }
    return PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber(
      "international"
    );
  }
  decodeJid(jid) {
    if (/:\d+@/gi.test(jid)) {
      const decode = jidDecode(jid) || {};
      return (
        decode.user && decode.server ? `${decode.user}@${decode.server}` : jid
      ).trim();
    }
    return jid.trim();
  }

  async getFile(PATH) {
    let res = null,
      filename;
    let buffer = Buffer.isBuffer(PATH)
      ? PATH
      : /^data:.*?\/.*?base64,/i.test(PATH)
      ? Buffer.from(PATH.split(",")[1], "base64")
      : /^https?:\/\//.test(PATH)
      ? Buffer.from((res = await fetchBuffer(PATH)), "binary")
      : fs.existsSync(PATH)
      ? ((filename = PATH), fs.readFileSync(PATH))
      : typeof PATH === "string"
      ? PATH
      : Buffer.alloc(0);

    if (!Buffer.isBuffer(buffer))
      throw new TypeError("Result is not a buffer.");

    const type = determineFileType(buffer);

    return {
      res,
      ...type,
      buffer,
    };
  }

  async downloadMediaMessage(media) {
    const type = Object.keys(media)[0];
    const msg = media[type];

    if (!msg || !(msg.url || msg.directPath)) {
      return null;
    }

    const stream = await downloadContentFromMessage(
      msg,
      type.replace(/Message/i, "")
    );
    const buffers = [];

    for await (const chunk of stream) {
      buffers.push(chunk);
    }

    const resultBuffer = Buffer.concat(buffers);
    stream.destroy();

    return resultBuffer;
  }

  bold(message) {
    return `*${message}*`;
  }

  italic(message) {
    return `_${message}_`;
  }

  strikethrough(message) {
    return `~${message}~`;
  }

  monospace(message) {
    return `\`\`\`${message}\`\`\``;
  }

  bulletedList(messages) {
    return messages.map((item) => `* ${item}`).join("\n");
  }

  numberedList(messages) {
    return messages.map((item, index) => `${index + 1}. ${item}`).join("\n");
  }

  quote(message) {
    return `> ${message}`;
  }

  code(message) {
    return `\`${message}\``;
  }

  async isGroup() {
    return this.msg.messages[0].key.remoteJid?.endsWith("@g.us") || false;
  }

  async isFromMe() {
    return this.msg.messages[0].key.fromMe || false;
  }

  async messageType() {
    return Object.keys(this.msg.messages[0].message || {})[0] || null;
  }

  async isQuotedMediaMsg() {
    const contextInfo =
      this.msg.messages[0]?.message?.extendedTextMessage?.contextInfo || {};
    const quotedMessage = contextInfo?.quotedMessage || {};
    return !!(
      quotedMessage.imageMessage?.url || quotedMessage.videoMessage?.url
    );
  }

  async isOwner() {
    const participant =
      this.msg.messages[0].key.participant ||
      this.msg.messages[0].key.remoteJid;
    const number = participant.split("@")[0];
    return number === this.ownerNumber;
  }
}
