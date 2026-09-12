"""GAMKERS AI CTF — Flask Backend with Groq LLM + Supabase"""
from flask import Flask, request, session, redirect, jsonify, render_template
from werkzeug.security import generate_password_hash, check_password_hash
from supabase import create_client
import os, time

from ai_engine import chat, reset_conversation, FLAGS, LAB_META

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "gamkers-ctf-s3cr3t-k3y!")
ADMIN_PW = os.environ.get("ADMIN_PASSWORD", "gamkers2024!")

# ─── Supabase ─────────────────────────────────────────────────────────────────
SUPABASE_URL = os.environ.get("SUPABASE_URL", "https://nufgpguitvkxctpagwwf.supabase.co")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51ZmdwZ3VpdHZreGN0cGFnd3dmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NTA0MTIsImV4cCI6MjA1MjUyNjQxMn0.-MLSuSnfllGJrrQMEfHrQjxZoeujy6jZiHG9L9jY6Ik")
sb = create_client(SUPABASE_URL, SUPABASE_KEY)

FIRST_BLOOD = {}

def current_player():
    pid = session.get("player_id")
    if not pid:
        return None
    res = sb.table("ctf_players").select("*").eq("id", pid).execute()
    return res.data[0] if res.data else None

# ─── ROUTES ───────────────────────────────────────────────────────────────────
@app.route("/")
def home():
    player = current_player()
    solved = set()
    if player:
        res = sb.table("ctf_solves").select("lab_id").eq("player_id", player["id"]).execute()
        solved = {r["lab_id"] for r in res.data}
    return render_template("home.html", player=player, labs=LAB_META, solved=solved)

@app.route("/register", methods=["GET", "POST"])
def register():
    error = ""
    if request.method == "POST":
        team = request.form.get("team", "").strip()
        handle = request.form.get("handle", "").strip()
        password = request.form.get("password", "").strip()
        if not team or not handle or not password:
            error = "All fields required."
        elif len(handle) > 20 or len(team) > 30:
            error = "Handle max 20 chars, team max 30."
        elif len(password) < 4:
            error = "Password must be at least 4 characters."
        else:
            existing = sb.table("ctf_players").select("id").eq("handle", handle).execute()
            if existing.data:
                error = "Handle already taken. Use Login instead."
            else:
                pw_hash = generate_password_hash(password)
                res = sb.table("ctf_players").insert({
                    "team": team, "handle": handle, "score": 0, "pw_hash": pw_hash
                }).execute()
                if res.data:
                    session["player_id"] = res.data[0]["id"]
                    return redirect("/")
                error = "Registration failed. Try again."
    return render_template("register.html", error=error, mode="register")

@app.route("/login", methods=["GET", "POST"])
def login():
    error = ""
    if request.method == "POST":
        handle = request.form.get("handle", "").strip()
        password = request.form.get("password", "").strip()
        if not handle or not password:
            error = "Handle and password required."
        else:
            existing = sb.table("ctf_players").select("*").eq("handle", handle).execute()
            if existing.data:
                player = existing.data[0]
                stored_hash = player.get("pw_hash", "")
                if stored_hash and check_password_hash(stored_hash, password):
                    session["player_id"] = player["id"]
                    return redirect("/")
                elif not stored_hash:
                    # Legacy player without password — let them in and set password
                    pw_hash = generate_password_hash(password)
                    sb.table("ctf_players").update({"pw_hash": pw_hash}).eq("id", player["id"]).execute()
                    session["player_id"] = player["id"]
                    return redirect("/")
                else:
                    error = "Wrong password."
            else:
                error = "Handle not found. Register first."
    return render_template("register.html", error=error, mode="login")

@app.route("/lab/<int:lab_id>")
def lab(lab_id):
    player = current_player()
    if not player:
        return redirect("/register")
    if lab_id not in LAB_META:
        return redirect("/")
    meta = LAB_META[lab_id]
    res = sb.table("ctf_solves").select("*").eq("player_id", player["id"]).eq("lab_id", lab_id).execute()
    solved = res.data[0] if res.data else None
    return render_template("lab.html", player=player, lab_id=lab_id, meta=meta, solved=solved)

@app.route("/lab/<int:lab_id>/chat", methods=["POST"])
def lab_chat(lab_id):
    player = current_player()
    if not player:
        return jsonify({"error": "Not logged in"}), 401
    msg = request.json.get("message", "").strip()
    if not msg:
        return jsonify({"error": "Empty message"}), 400
    if len(msg) > 2000:
        return jsonify({"error": "Message too long (max 2000)"}), 400

    # Use player ID as session key for conversation history
    session_id = str(player["id"])
    result = chat(lab_id, msg, session_id)

    # Log to Supabase
    try:
        sb.table("ctf_chat_logs").insert({
            "player_id": player["id"],
            "lab_id": lab_id,
            "message": msg[:500],
            "response": result["response"][:2000],
        }).execute()
    except Exception:
        pass  # Don't fail the chat if logging fails

    return jsonify({
        "response": result["response"],
        "tools": result.get("tools", []),
        "trigger_flag": result.get("trigger_flag", False),
    })

@app.route("/lab/<int:lab_id>/reset", methods=["POST"])
def lab_reset(lab_id):
    player = current_player()
    if not player:
        return jsonify({"error": "Not logged in"}), 401
    reset_conversation(lab_id, str(player["id"]))
    return jsonify({"ok": True})

@app.route("/lab/<int:lab_id>/submit", methods=["POST"])
def submit_flag(lab_id):
    player = current_player()
    if not player:
        return jsonify({"error": "Not logged in"}), 401
    flag = request.json.get("flag", "").strip()
    correct_flag = FLAGS.get(lab_id)
    if not correct_flag:
        return jsonify({"error": "Invalid lab"}), 400

    # Rate limit (check last submission)
    recent = sb.table("ctf_submissions").select("ts").eq("player_id", player["id"]).order("ts", desc=True).limit(1).execute()
    if recent.data:
        from datetime import datetime, timezone
        last_ts = datetime.fromisoformat(recent.data[0]["ts"].replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        if (now - last_ts).total_seconds() < 5:
            return jsonify({"error": "Rate limited. Wait 5 seconds."}), 429

    # Already solved?
    already = sb.table("ctf_solves").select("*").eq("player_id", player["id"]).eq("lab_id", lab_id).execute()
    if already.data:
        return jsonify({"correct": True, "msg": "Already solved!", "points": 0})

    correct = (flag == correct_flag)

    # Log attempt
    try:
        sb.table("ctf_submissions").insert({
            "player_id": player["id"],
            "lab_id": lab_id,
            "flag_attempt": flag[:100],
            "correct": correct,
        }).execute()
    except Exception:
        pass

    pts = 0
    fb = False
    if correct:
        pts = LAB_META[lab_id]["points"]
        # First blood check
        fb_check = sb.table("ctf_solves").select("id").eq("lab_id", lab_id).limit(1).execute()
        if not fb_check.data:
            pts += 50
            fb = True

        sb.table("ctf_solves").insert({
            "player_id": player["id"],
            "lab_id": lab_id,
            "first_blood": fb,
            "points": pts,
        }).execute()

        # Update player score
        new_score = (player.get("score") or 0) + pts
        sb.table("ctf_players").update({"score": new_score}).eq("id", player["id"]).execute()

        msg_text = f"🎉 Correct! +{pts} points" + (" 🩸 FIRST BLOOD!" if fb else "")
        return jsonify({"correct": True, "msg": msg_text, "points": pts, "first_blood": fb})

    return jsonify({"correct": False, "msg": "❌ Wrong flag. Try again."})

@app.route("/leaderboard")
def leaderboard():
    player = current_player()
    players_res = sb.table("ctf_players").select("*").order("score", desc=True).limit(100).execute()
    solves_res = sb.table("ctf_solves").select("*").order("solved_at").execute()

    # Add solves_count to each player
    solves_by_player = {}
    for s in solves_res.data:
        pid = s["player_id"]
        solves_by_player.setdefault(pid, []).append(s)

    players = []
    for p in players_res.data:
        p["solves_count"] = len(solves_by_player.get(p["id"], []))
        players.append(p)

    return render_template("leaderboard.html", players=players, solves=solves_res.data,
                           labs=LAB_META, player=player)

@app.route("/api/leaderboard")
def api_leaderboard():
    res = sb.table("ctf_players").select("id,team,handle,score").order("score", desc=True).limit(50).execute()
    return jsonify(res.data)

@app.route("/admin", methods=["GET", "POST"])
def admin():
    if request.method == "POST":
        if request.form.get("password") == ADMIN_PW:
            session["is_admin"] = True
        else:
            return render_template("admin_login.html", error="Wrong password")
    if not session.get("is_admin"):
        return render_template("admin_login.html", error="")

    players = sb.table("ctf_players").select("*").order("score", desc=True).execute().data
    logs = sb.table("ctf_chat_logs").select("*, ctf_players(handle)").order("ts", desc=True).limit(200).execute().data
    subs = sb.table("ctf_submissions").select("*, ctf_players(handle)").order("ts", desc=True).limit(200).execute().data
    return render_template("admin.html", players=players, logs=logs, subs=subs, labs=LAB_META)

@app.route("/reset-session")
def reset_session():
    session.clear()
    return redirect("/")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
