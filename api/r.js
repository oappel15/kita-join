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
  const body = [
    "שלום, הגעתי בהפניה (קוד " + code + ").",
    "",
    "מה אפשר לבקש מ-Kita:",
    "• אתר שיעור אינטראקטיבי בנושא אחד, עם משימות, משחקים, סרטונים ובחנים",
    "• אתר שנתי למקצוע, שנבנה לפי תוכנית הלימודים של משרד החינוך",
    "• בכל אתר יש אזור מורים עם מערכי שיעור וכרטיסיות משימה להדפסה",
    "• מצגת לשיעור, שאפשר להקרין בכיתה",
    "",
    "מה חייבים לכתוב: כיתה ומקצוע. אפשר להוסיף נושא, ספר לימוד, מבנה שיעור, רמות או כל דבר אחר, אבל זה לא חובה.",
    "חומרים: אפשר לצרף קישורים או קבצים שחשוב שייכנסו, או להשאיר לנו לאסוף חומרים בעצמנו.",
    "",
    "דוגמאות: \"אתר שנתי למדעים לכיתה ד׳\", או \"שיעור על מחזור המים לכיתה ה׳, עם משחק וחידון בסוף\".",
    "",
    "הבקשה שלי:",
    ""
  ].map(function (t) { return t ? RL(t) : t; }).join("\r\n");
  const href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  res.statusCode = 302;
  res.setHeader("Location", href);
  res.end();
};
