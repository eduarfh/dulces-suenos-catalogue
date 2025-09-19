// test/test-auth.js
const url = "https://yzjvywcplllhsqqcfsyb.supabase.co/auth/v1/token";
const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anZ5d2NwbGxsaHNxcWNmc3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5Mjc1NjUsImV4cCI6MjA3MTUwMzU2NX0.SmLV_qnp5xK80kIM_Bb02UP2RyE6VAZOEjgJaNYmf8k";
const email = "fonsecaeduar136@gmail.com";
const password = "myeventas123";

const params = new URLSearchParams();
params.append("grant_type", "password");
params.append("email", email);
params.append("password", password);

(async () => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "apikey": anonKey,
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json"
      },
      body: params.toString()
    });
    const text = await res.text();
    console.log("status:", res.status);
    console.log("body:", text);
  } catch (e) {
    console.error("fetch error:", e);
  }
})();
