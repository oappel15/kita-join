// Server-side 302 straight to a prefilled email to Kita: one tap, no page shown.
const TO = "kita.lessons@gmail.com";
const RE = /^[A-Z]{3}-[A-Z0-9]{4}$/;
const RL = (t) => "\u202b" + t + "\u202c"; // keep Hebrew lines right-aligned in plain-text mail
module.exports = (req, res) => {
  let raw = "";
  try { raw = new URL(req.url, "https://x").searchParams.get("c") || ""; } catch (e) {}
  const code = raw.trim().toUpperCase();
  res.setHeader("Cache-Control", "no-store");
  if (!RE.test(code)) {
    res.statusCode = 302;
    res.setHeader("Location", "/index.html?c=" + encodeURIComponent(code));
    return res.end();
  }
  const subject = "בקשה לאתר שיעור | קוד הפניה " + code;
  const body = [RL("שלום, הגעתי בהפניה (קוד " + code + ")."), RL("כיתה:"), RL("מקצוע:"), RL("מה הייתי רוצה שיהיה באתר:"), ""].join("\r\n");
  const href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  res.statusCode = 302;
  res.setHeader("Location", href);
  res.end();
};
