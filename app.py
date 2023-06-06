#hi derek there is no admin login this time
#i have used code for my javascript and have commented out the link to sites i used where i used them.
#i used it for post request with javascript, get request with js
# test comment
from flask import Flask, request, session, render_template, redirect, url_for, g, jsonify
from forms import registrationForm, loginForm
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from database import get_db, close_db
import os
from functools import wraps
import json


app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
# https://stackoverflow.com/questions/59014586/how-to-set-an-httponly-cookie-in-flask
app.config["SESSION_COOKIE_HTTPONLY"] = False
Session(app)
app.teardown_appcontext(close_db)


@app.before_request
def logged_in():
    g.user = session.get("username", None)

def login_required(view):
    @wraps(view)
    def wrapped_view(*args, **kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(*args, **kwargs)
    return wrapped_view

#Get user ID
def id():
    if g.user is None:
        return -1
    
    db = get_db()
    row = db.execute("""SELECT * FROM accounts WHERE account_name = ?""", (g.user,)).fetchone()
    id = row["account_id"]
    return id

#Login, Logout, Register
@app.route("/register", methods = ["GET", "POST"])
def register():
    register_message = ""
    login_error = ""
    login_form = loginForm()
    register_form = registrationForm()
    if register_form.validate_on_submit():
        username = register_form.username.data
        username = username.lower()
        password = register_form.password.data
        confirmPassword = register_form.confirmPassword.data
        db = get_db()
        checkUser = db.execute("""SELECT * FROM accounts WHERE account_name = ?;""",
                                (username,)).fetchone()
        if checkUser is not None:
            register_form.username.errors.append("Username already taken.")
        else:
            db.execute("""INSERT INTO accounts (account_name, account_password) VALUES (?, ?);""",
                    (username, generate_password_hash(password)))
            db.commit()
            return render_template("login.html", register_form = register_form, login_form = login_form, login_error = login_error, register_message = "Success!")
        return render_template("login.html", register_form = register_form, login_form = login_form, register_message = register_message, login_error = login_error)

@app.route("/login", methods =["GET", "POST"])
def login():
    register_message = ""
    login_error = ""
    login_form = loginForm()
    register_form = registrationForm()
    next_page = request.args.get("next")
    if login_form.validate_on_submit():
        username = login_form.username.data
        username = username.lower()
        password = login_form.password.data
        db = get_db()
        checkUser = db.execute("""SELECT * FROM accounts WHERE account_name = ?;""",
                               (username,)).fetchone()

        #Regular login
        if checkUser is None or not check_password_hash(checkUser["account_password"], password):
            return render_template("login.html", login_form = login_form, register_form = register_form, login_error = "Username or password is incorrect.")
        else:
            session.clear()
            session["username"] = username
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", login_form = login_form, register_form = register_form, register_message = register_message, login_error = login_error, next_page=next_page)

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))



@app.route("/", methods = ["GET"])
def index():
    return render_template("index.html")   

@app.route("/my_account", methods = ["GET"])
@login_required
def my_account():
    return render_template("account.html")

@app.route("/saveData", methods = ["POST"])
@login_required
def saveData():
    data = request.get_json()
    print(data)
    session["data"] = data

    account = id()
    db = get_db()
    data = json.dumps(data)
    
    existing = db.execute("""SELECT save_data 
                            FROM saves 
                            WHERE account_id = ?;""", (account,)).fetchone()
    if existing is None:
        db.execute("""INSERT INTO saves (account_id, save_data)
                        VALUES (?, ?);""", (account, data))
        db.commit()
    else:
        db.execute("""UPDATE saves
                        SET save_data = ?
                        WHERE account_id = ?;""", (data, account))
        db.commit()
    return "Received Data!"

@app.route("/getData", methods = ["GET"])
@login_required
def getData():
    db = get_db()

    account = id()
    data = db.execute("""SELECT *
                        FROM saves
                        WHERE account_id = ?;""", (account,)).fetchone()
    save = data["save_data"]

    if data is None:
        return "None"
    print(data)
    data = json.loads(save)
    return jsonify(data)
    # return jsonify(session["data"])

@app.route("/game", methods = ["GET"])
def game():
    return render_template("game.html")

@app.route("/deleteAccount")
@login_required
def deleteAccount():
    db = get_db()
    account = id()
    db.commit("""DELETE FROM accounts WHERE account_id = ?;""", (account,))
    db.commit()

    return render_template("index.html")

@app.route("/deleteSave")
@login_required
def deleteSave():
    db = get_db()
    account = id()
    db.commit("""DELETE FROM saves WHERE account_id = ?;""", (account,))
    db.commit()

    return redirect(url_for("my_account"))
