if (!process.env["VOICETEXT_API_KEY"]) {
  throw new Error("VOICETEXT_API_KEY is required.");
}
if (!process.env["WIRELESS_IP"] && !process.env["WIRELESS_MODULE_NAME"]) {
  throw new Error("WIRELESS_IP or WIRELESS_MODULE_NAME is required.");
}
let WIRELESS_IP;
if (process.env["WIRELESS_IP"]) {
  WIRELESS_IP = process.env["WIRELESS_IP"];
} else {
  const os = require("os");
  const ips = os.networkInterfaces();
  const WIRELESS_MODULE_NAME = process.env["WIRELESS_MODULE_NAME"]; // ex. en0
  const WIRELESS_modules = ips[WIRELESS_MODULE_NAME];
  WIRELESS_modules.forEach(module => {
    if (module.family === "IPv4") {
      WIRELESS_IP = module.address;
    }
  });
}

const FILE_SERVER_PORT = "8888";
const VOICETEXT_API_KEY = process.env["VOICETEXT_API_KEY"];
//const VOICETEXT_SPEAKER = process.env["VOICETEXT_SPEAKER"];

const VoiceText = require("voicetext");
const voice = new VoiceText(VOICETEXT_API_KEY);
const OUT_PATH = __dirname + "/public/voice/_temp.wav";
const OUTPUT_URL =
  "http://" + WIRELESS_IP + ":" + FILE_SERVER_PORT + "/googlehome/_temp.wav";
  const fs = require("fs");

let SPEAKER;


class VoiceTextWriter {

  returnSpeaker(speaker){
    switch(speaker){
      case "bear":
        return voice.SPEAKER.BEAR;
      case "haruka":
        return voice.SPEAKER.HARUKA;
      case "santa":
        return voice.SPEAKER.SANTA;
      case "show":
        return voice.SPEAKER.SHOW;
      case "takeru":
        return voice.SPEAKER.TAKERU;
      default:
        return voice.SPEAKER.HIKARI;
    }
  }

  /**
   * 
   * @param {*} text 音声にするテキスト
   * @param {*} speaker 話者タイプ
   */
  convertToText(text,speakerType) {
    return new Promise((resolve, reject)=>{
      speaker = this.returnSpeaker(speakerType);
      voice
        .speaker(speaker)
        .emotion(voice.EMOTION.HAPPINESS)
        .emotion_level(voice.EMOTION_LEVEL.HIGH)
        .volume(150)
        .speak(text, function(e, buf) {
          if (e) {
            console.error(e);
            reject(e);
          } else {
            fs.writeFileSync(OUT_PATH, buf, "binary");
            resolve(OUTPUT_URL);
          }
        });
    });
  }
}
module.exports = VoiceTextWriter;
