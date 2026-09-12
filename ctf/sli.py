"""
GAMKERS CTF — SQL Injection Challenge (3 Levels)
=================================================
Level 1 (Easy)   /level/1  — Classic string concat login, errors shown, schema exposed
Level 2 (Medium) /level/2  — Username sanitized, errors hidden, but password field is raw
Level 3 (Hard)   /level/3  — Login is parameterized, flag hidden in vault table,
                              blind boolean SQLi via product search endpoint
"""

from flask import Flask, request, render_template_string, session, redirect, jsonify
import sqlite3, hashlib, re, time

app = Flask(__name__)
app.secret_key = "n0t-4-pr0d-s3cr3t-k3y!"

DB = "/tmp/gamkers_sqli.db"

# ─── flags (non-predictable) ──────────────────────────────────────────────────
FLAG1 = "GAMKERS{w4rmup_qu0t3_c0mm3nt_byp4ss}"
FLAG2 = "GAMKERS{p4ssw0rd_f13ld_w4s_th3_h0l3_4ll_4l0ng}"
FLAG3 = "GAMKERS{bl1nd_b00l_3xf1l_n0_err0r_n0_pr0bl3m}"

# ─── database ─────────────────────────────────────────────────────────────────
def init_db():
    conn = sqlite3.connect(DB)
    c = conn.cursor()
    c.executescript(f"""
        DROP TABLE IF EXISTS users;
        DROP TABLE IF EXISTS notes;
        DROP TABLE IF EXISTS products;
        DROP TABLE IF EXISTS vault;

        CREATE TABLE users (
            id       INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL,
            role     TEXT DEFAULT 'user'
        );
        CREATE TABLE notes (
            id    INTEGER PRIMARY KEY,
            owner TEXT,
            body  TEXT
        );
        CREATE TABLE products (
            id    INTEGER PRIMARY KEY,
            name  TEXT,
            price REAL,
            stock INTEGER
        );
        CREATE TABLE vault (
            id    INTEGER PRIMARY KEY,
            label TEXT,
            secret TEXT
        );

        INSERT INTO users VALUES (1,'alice',  '{hashlib.md5(b"alice123").hexdigest()}',   'user');
        INSERT INTO users VALUES (2,'bob',    '{hashlib.md5(b"b0bpass!").hexdigest()}',   'user');
        INSERT INTO users VALUES (3,'admin',  '{hashlib.md5(b"Tr0ub4dor&3").hexdigest()}','admin');
        INSERT INTO users VALUES (4,'devops', '{hashlib.md5(b"d3v0ps#2024").hexdigest()}','staff');

        INSERT INTO notes VALUES (1,'alice','Meeting at 3pm.');
        INSERT INTO notes VALUES (2,'bob',  'Fix the CI pipeline.');
        INSERT INTO notes VALUES (3,'admin','{FLAG1}');

        INSERT INTO products VALUES (1,'Ethernet Cable',  9.99,  120);
        INSERT INTO products VALUES (2,'USB Hub',        24.99,   45);
        INSERT INTO products VALUES (3,'RPi 4 Case',     14.99,   78);
        INSERT INTO products VALUES (4,'MicroSD 64GB',   12.49,  200);
        INSERT INTO products VALUES (5,'HDMI Adapter',    7.99,   90);

        INSERT INTO vault VALUES (1,'level2_reward','{FLAG2}');
        INSERT INTO vault VALUES (2,'level3_flag',  '{FLAG3}');
        INSERT INTO vault VALUES (3,'decoy_1',      'not_the_flag_try_harder');
        INSERT INTO vault VALUES (4,'decoy_2',      'almost_but_not_quite');
    """)
    conn.commit()
    conn.close()

# ─── shared CSS ───────────────────────────────────────────────────────────────
CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Courier New',monospace;background:#0d1117;color:#c9d1d9;
     min-height:100vh;display:flex;flex-direction:column;align-items:center;padding:32px 16px}
.wrap{width:100%;max-width:520px}
.card{background:#161b22;border:1px solid #30363d;border-radius:8px;padding:28px;margin-bottom:14px}
h1{font-size:18px;color:#58a6ff;margin-bottom:3px}
h2{font-size:14px;color:#58a6ff;margin-bottom:10px}
.sub{font-size:11px;color:#8b949e;margin-bottom:20px;line-height:1.5}
label{font-size:11px;color:#8b949e;display:block;margin-bottom:3px;margin-top:12px}
input[type=text],input[type=password],input[type=search]{
  width:100%;padding:9px 11px;background:#0d1117;border:1px solid #30363d;
  border-radius:5px;color:#c9d1d9;font-family:'Courier New',monospace;font-size:13px;outline:none}
input:focus{border-color:#58a6ff}
button,input[type=submit]{
  margin-top:16px;padding:9px 18px;background:#238636;border:none;border-radius:5px;
  color:#fff;font-size:13px;cursor:pointer;font-family:'Courier New',monospace}
button:hover,input[type=submit]:hover{background:#2ea043}
.btn-sm{margin-top:0;padding:6px 12px;font-size:12px;background:#1f6feb}
.err{background:#2d1117;border:1px solid #f85149;border-radius:5px;padding:9px 11px;
     font-size:12px;color:#f85149;margin-top:12px}
.ok {background:#0d2818;border:1px solid #238636;border-radius:5px;padding:9px 11px;
     font-size:12px;color:#3fb950;margin-top:12px}
.flag{background:#1c1509;border:1px solid #d29922;border-radius:5px;padding:13px;
      font-size:14px;color:#d29922;margin-top:12px;word-break:break-all;font-weight:bold;letter-spacing:.5px}
.badge{display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;
       background:#1c2128;border:1px solid #30363d;color:#8b949e;margin-left:6px;vertical-align:middle}
.easy{border-color:#238636!important;color:#3fb950!important}
.med {border-color:#d29922!important;color:#d29922!important}
.hard{border-color:#f85149!important;color:#f85149!important}
.hint-box{background:#0d1117;border:1px solid #21262d;border-radius:5px;padding:14px;margin-top:12px}
.hint-box p{font-size:11px;color:#8b949e;margin-bottom:8px}
.hint{font-size:11px;color:#8b949e;cursor:pointer;padding:5px 9px;border:1px solid #21262d;
      border-radius:4px;display:block;margin:4px 0;transition:.1s}
.hint:hover{border-color:#58a6ff;color:#c9d1d9}
.hint-text{display:none;font-size:11px;color:#3fb950;margin:3px 0 6px;
           padding:7px 9px;background:#0d2818;border-radius:4px;line-height:1.6}
.hint-text code{background:#1c2128;padding:1px 5px;border-radius:3px;color:#79c0ff}
nav{font-size:11px;display:flex;gap:14px;flex-wrap:wrap;margin-top:10px}
nav a{color:#58a6ff;text-decoration:none}
table{width:100%;border-collapse:collapse;font-size:12px;margin-top:10px}
td,th{padding:7px 9px;border:1px solid #21262d;text-align:left;vertical-align:top}
th{color:#58a6ff;font-weight:normal;font-size:11px}
.code-block{background:#0d1117;border:1px solid #21262d;border-radius:5px;
            padding:10px 12px;font-size:11px;color:#8b949e;overflow-x:auto;margin-top:8px;line-height:1.7}
.lvl-nav{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
.lvl-btn{padding:6px 14px;border-radius:5px;border:1px solid #30363d;color:#8b949e;
         text-decoration:none;font-size:12px;background:#161b22}
.lvl-btn:hover{border-color:#58a6ff;color:#58a6ff}
.lvl-btn.cur{border-color:#58a6ff;color:#58a6ff;background:#1c2128}
"""

def base(title, body, level=None):
    lvl_nav = ""
    if level:
        links = ""
        for i,label,cls in [(1,"L1 Easy","easy"),(2,"L2 Medium","med"),(3,"L3 Hard","hard")]:
            cur = ' cur' if i==level else ''
            links += f'<a href="/level/{i}" class="lvl-btn{cur} {cls if cur else ""}">{label}</a>'
        lvl_nav = f'<div class="lvl-nav">{links}<a href="/" class="lvl-btn">Home</a></div>'
    return f"""<!doctype html><html><head><title>{title}</title>
<meta charset="utf-8"><style>{CSS}</style></head>
<body><div class="wrap">{lvl_nav}{body}
<script>
function tog(id){{var e=document.getElementById(id);e.style.display=e.style.display==='block'?'none':'block';}}
</script>
</div></body></html>"""


# ─── HOME ─────────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    body = """
<div class="card">
  <h1>&#x1F4BB; GAMKERS &mdash; SQL Injection Labs</h1>
  <p class="sub">Three levels. One database. Escalating difficulty.<br>
  Each level teaches a distinct SQLi technique. Enumerate, don't guess.</p>
</div>
<div class="card">
  <div style="display:flex;flex-direction:column;gap:10px">
    <a href="/level/1" style="text-decoration:none">
      <div style="padding:14px;background:#0d2818;border:1px solid #238636;border-radius:6px">
        <span style="color:#3fb950;font-size:13px;font-weight:bold">Level 1 &nbsp;<span class="badge easy">EASY</span></span>
        <p style="font-size:11px;color:#8b949e;margin-top:5px">Classic login bypass. String concatenation. Errors visible.</p>
      </div>
    </a>
    <a href="/level/2" style="text-decoration:none">
      <div style="padding:14px;background:#1c1509;border:1px solid #d29922;border-radius:6px">
        <span style="color:#d29922;font-size:13px;font-weight:bold">Level 2 &nbsp;<span class="badge med">MEDIUM</span></span>
        <p style="font-size:11px;color:#8b949e;margin-top:5px">Username sanitized. Errors suppressed. Find the other hole.</p>
      </div>
    </a>
    <a href="/level/3" style="text-decoration:none">
      <div style="padding:14px;background:#2d1117;border:1px solid #f85149;border-radius:6px">
        <span style="color:#f85149;font-size:13px;font-weight:bold">Level 3 &nbsp;<span class="badge hard">HARD</span></span>
        <p style="font-size:11px;color:#8b949e;margin-top:5px">Login locked down. No errors. Blind boolean SQLi. Exfiltrate the vault.</p>
      </div>
    </a>
  </div>
</div>"""
    return base("GAMKERS SQLi Labs", body)


# ═══════════════════════════════════════════════════════════════════════════════
# LEVEL 1 — Easy
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/level/1", methods=["GET","POST"])
def level1():
    error = msg = flag = ""
    if request.method == "POST":
        u = request.form.get("username","")
        p = request.form.get("password","")
        query = f"SELECT * FROM users WHERE username='{u}' AND password='{p}'"
        try:
            conn = sqlite3.connect(DB)
            row = conn.execute(query).fetchone()
            conn.close()
            if row:
                if row[3] == "admin":
                    flag = FLAG1
                    msg = "Welcome admin."
                else:
                    msg = f"Logged in as {row[1]} ({row[3]}). Need admin role."
            else:
                error = "Invalid credentials."
        except Exception as e:
            error = f"DB Error: {e}"

    body = f"""
<div class="card">
  <h1>CorpNet Login &nbsp;<span class="badge easy">EASY</span></h1>
  <p class="sub">Employee portal. Authenticate to view your notes.</p>
  <form method="POST">
    <label>Username</label>
    <input type="text" name="username" autocomplete="off" placeholder="username">
    <label>Password</label>
    <input type="password" name="password" placeholder="password">
    <button type="submit">Sign in &rarr;</button>
  </form>
  {'<div class="err">'+error+'</div>' if error else ''}
  {'<div class="ok">'+msg+'</div>' if msg and not flag else ''}
  {'<div class="flag">&#x1F3C6; '+flag+'</div>' if flag else ''}
</div>
<div class="card">
  <h2>Hints</h2>
  <div class="hint-box">
    <span class="hint" onclick="tog('l1h1')">Hint 1 &mdash; how is the query built?</span>
    <div class="hint-text" id="l1h1">The server constructs the SQL query by joining strings together with your input directly. No sanitization happens before execution.</div>
    <span class="hint" onclick="tog('l1h2')">Hint 2 &mdash; what character breaks out of a string in SQL?</span>
    <div class="hint-text" id="l1h2">SQL uses a specific character to open and close text values. Try putting that character in your input and watch the error message — what does it tell you about the query structure?</div>
    <span class="hint" onclick="tog('l1h3')">Hint 3 &mdash; skipping the password check</span>
    <div class="hint-text" id="l1h3">Once you break out of the string, the rest of your input is interpreted as SQL. There is SQL syntax that turns everything after it into a comment. What does that do to the AND password check?</div>
    <span class="hint" onclick="tog('l1h4')">Hint 4 &mdash; don't know the username?</span>
    <div class="hint-text" id="l1h4">You know the target role from the schema. SQL has a logical operator that lets you add an alternative condition. If any condition in the chain is true, the whole expression is true.</div>
  </div>
</div>
<div class="card">
  <h2>&#x1F5C4; Schema (leaked debug endpoint)</h2>
  <div class="code-block">
SELECT * FROM users<br>
WHERE username = '<b style="color:#f85149">[INPUT]</b>'<br>
AND password = '<b style="color:#f85149">[INPUT]</b>';<br><br>
TABLE users &rarr; (id, username, password, role)<br>
TABLE notes &rarr; (id, owner, body)
  </div>
</div>"""
    return base("L1 Easy SQLi", body, level=1)


# ═══════════════════════════════════════════════════════════════════════════════
# LEVEL 2 — Medium: username strips quotes, errors hidden, password raw
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/level/2", methods=["GET","POST"])
def level2():
    error = msg = flag = ""
    if request.method == "POST":
        u = request.form.get("username","")
        p = request.form.get("password","")

        # "fixed" — strips single quotes from username only
        u_clean = u.replace("'","")

        # password: STILL raw — developer forgot this field
        query = f"SELECT * FROM users WHERE username='{u_clean}' AND password='{p}'"

        try:
            conn = sqlite3.connect(DB)
            row = conn.execute(query).fetchone()
            conn.close()
        except Exception:
            row = None  # errors silently eaten

        if row:
            if row[3] == "admin":
                flag = FLAG2
                msg = "Access granted."
            else:
                msg = f"Welcome {row[1]}. Insufficient privileges."
        else:
            error = "Access denied."

    body = f"""
<div class="card">
  <h1>CorpNet v2 Login &nbsp;<span class="badge med">MEDIUM</span></h1>
  <p class="sub">Security-hardened portal. Input validation enforced on username.<br>
  <span style="color:#d29922">&#x26A0; SQL errors are no longer shown.</span></p>
  <form method="POST">
    <label>Username</label>
    <input type="text" name="username" autocomplete="off" placeholder="username">
    <label>Password</label>
    <input type="password" name="password" placeholder="password">
    <button type="submit">Sign in &rarr;</button>
  </form>
  {'<div class="err">'+error+'</div>' if error else ''}
  {'<div class="ok">'+msg+'</div>' if msg and not flag else ''}
  {'<div class="flag">&#x1F3C6; '+flag+'</div>' if flag else ''}
</div>
<div class="card">
  <h2>Hints</h2>
  <div class="hint-box">
    <span class="hint" onclick="tog('l2h1')">Hint 1 &mdash; what was patched?</span>
    <div class="hint-text" id="l2h1">The developer fixed one of the input fields. Try injecting the same payload from Level 1 into the username — does it behave differently? Why?</div>
    <span class="hint" onclick="tog('l2h2')">Hint 2 &mdash; was everything fixed?</span>
    <div class="hint-text" id="l2h2">Developers often patch the obvious field and miss others. This form has two inputs. Have you tested both independently? Test each field in isolation with a single quote.</div>
    <span class="hint" onclick="tog('l2h3')">Hint 3 &mdash; think about the query structure</span>
    <div class="hint-text" id="l2h3">The SQL query has two conditions joined with AND. If you can control the second condition, you can make the overall expression evaluate however you want — even if the first part is fixed.</div>
    <span class="hint" onclick="tog('l2h4')">Hint 4 &mdash; what result do you need?</span>
    <div class="hint-text" id="l2h4">You need the query to return the admin row. Think about what logical condition, appended after the password check, would guarantee the row is returned regardless of the actual password value.</div>
  </div>
</div>
<div class="card">
  <h2>&#x1F6E1; The "fix" that wasn't</h2>
  <div class="code-block">
<span style="color:#3fb950"># username: sanitized</span><br>
u_clean = username.replace("'", "")<br><br>
<span style="color:#f85149"># password: still raw &lt;-- missed this</span><br>
query = f"WHERE username='{{u_clean}}' AND password='{{password}}'"
  </div>
</div>"""
    return base("L2 Medium SQLi", body, level=2)


# ═══════════════════════════════════════════════════════════════════════════════
# LEVEL 3 — Hard: login locked, blind boolean SQLi on /api/search
# ═══════════════════════════════════════════════════════════════════════════════
@app.route("/level/3")
def level3():
    body = """
<div class="card">
  <h1>CorpNet Store &nbsp;<span class="badge hard">HARD</span></h1>
  <p class="sub">Login is now fully parameterized &mdash; that vector is dead.<br>
  <span style="color:#f85149">&#x1F50D; The product search API was written by the intern.</span></p>
  <label>Search products</label>
  <div style="display:flex;gap:8px;margin-top:6px">
    <input type="text" id="q" placeholder="e.g. usb" style="flex:1">
    <button class="btn-sm" onclick="doSearch()">Search</button>
  </div>
  <div id="results" style="margin-top:12px"></div>
</div>

<div class="card">
  <h2>Mission</h2>
  <p class="sub" style="margin-bottom:10px">
  There is a <code>vault</code> table in the database.<br>
  The flag lives at <code>label = 'level3_flag'</code> in the <code>secret</code> column.<br>
  The API only returns a count &mdash; no data, no errors.<br>
  Use <b>blind boolean SQLi</b> to extract the flag character by character.</p>
  <div class="code-block">
GET /api/search?q=usb<br>
&rarr; {{"count": 2}}    &larr; count &gt; 0 = TRUE, count = 0 = FALSE<br><br>
<span style="color:#d29922">Tip: if your payload makes the vault row appear in results,</span><br>
<span style="color:#d29922">the API will give you the flag directly.</span>
  </div>
</div>

<div class="card">
  <h2>Hints</h2>
  <div class="hint-box">
    <span class="hint" onclick="tog('l3h1')">Hint 1 &mdash; you only get a number back</span>
    <div class="hint-text" id="l3h1">The API only returns a count. No data, no errors. You can’t read the flag directly — but you can ask the database yes/no questions by watching whether the count changes.</div>
    <span class="hint" onclick="tog('l3h2')">Hint 2 &mdash; where is the injection point?</span>
    <div class="hint-text" id="l3h2">The search query uses a LIKE pattern with your input in the middle. Try sending a single quote and observe the response. Does the count behave differently? That tells you the input lands inside a SQL string.</div>
    <span class="hint" onclick="tog('l3h3')">Hint 3 &mdash; asking a yes/no question</span>
    <div class="hint-text" id="l3h3">Once you break out of the LIKE string, append an AND condition that references the vault table. If your condition is TRUE the count goes up, if FALSE it stays 0. SQLite has SUBSTR(string, position, length) to read one character at a time.</div>
    <span class="hint" onclick="tog('l3h4')">Hint 4 &mdash; the trailing % problem</span>
    <div class="hint-text" id="l3h4">The original query wraps your input: <code>LIKE '%INPUT%'</code>. After you close the first quote there is still a <code>%'</code> dangling at the end. Your injection needs to handle that trailing fragment or the SQL breaks and returns count 0.</div>
    <span class="hint" onclick="tog('l3h5')">Hint 5 &mdash; automate it</span>
    <div class="hint-text" id="l3h5">Once your boolean test works for one character, write a loop. Iterate positions 1 through ~50 and for each position try every character in your expected charset. When count &gt; 0 you found that character. Append it and move to the next position.</div>
  </div>
</div>

<div class="card">
  <h2>&#x1F9EA; Live injection tester</h2>
  <p class="sub">Send raw payloads to /api/search and see the boolean signal:</p>
  <div style="display:flex;gap:8px;margin-top:6px">
    <input type="text" id="raw" placeholder="' AND 1=1 AND name LIKE '" style="flex:1">
    <button class="btn-sm" onclick="doRaw()">Inject</button>
  </div>
  <div id="raw-result" style="margin-top:10px;font-size:12px;color:#8b949e"></div>
  <div id="flag-display"></div>
</div>

<script>
async function doSearch(){
  const q = document.getElementById('q').value;
  const r = await fetch('/api/search?q='+encodeURIComponent(q));
  const d = await r.json();
  const el = document.getElementById('results');
  if(d.rows && d.rows.length){
    el.innerHTML = '<table><tr><th>ID</th><th>Name</th><th>Price</th><th>Stock</th></tr>'
      + d.rows.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>$${x[2]}</td><td>${x[3]}</td></tr>`).join('')+'</table>';
  } else {
    el.innerHTML = `<div class="err">No results (count: ${d.count})</div>`;
  }
  if(d.flag){ document.getElementById('flag-display').innerHTML='<div class="flag">&#x1F3C6; '+d.flag+'</div>'; }
}
async function doRaw(){
  const q = document.getElementById('raw').value;
  const r = await fetch('/api/search?q='+encodeURIComponent(q));
  const d = await r.json();
  const signal = d.count > 0 ? '&#x1F7E2; TRUE (count: '+d.count+')' : '&#x1F534; FALSE (count: 0)';
  document.getElementById('raw-result').innerHTML = 'Boolean signal: '+signal
    +(d.rows ? '<br>Rows: '+JSON.stringify(d.rows) : '');
  if(d.flag){ document.getElementById('flag-display').innerHTML='<div class="flag">&#x1F3C6; '+d.flag+'</div>'; }
  else { document.getElementById('flag-display').innerHTML=''; }
}
</script>"""
    return base("L3 Hard SQLi", body, level=3)


@app.route("/api/search")
def api_search():
    q = request.args.get("q","")
    time.sleep(0.04)

    # !! INTENTIONALLY VULNERABLE !!
    query = f"SELECT * FROM products WHERE name LIKE '%{q}%'"

    try:
        conn = sqlite3.connect(DB)
        rows = conn.execute(query).fetchall()
        conn.close()

        flag_reward = None
        for r in rows:
            for cell in r:
                if FLAG3 in str(cell):
                    flag_reward = FLAG3

        resp = {"count": len(rows)}
        if rows and len(rows) <= 20 and all(len(r) == 4 for r in rows):
            resp["rows"] = [list(r) for r in rows]
        if flag_reward:
            resp["flag"] = flag_reward
        return jsonify(resp)

    except Exception:
        return jsonify({"count": 0})


# ─── run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=False)