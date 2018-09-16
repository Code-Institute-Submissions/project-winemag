import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
import json


app = Flask(__name__)

app.config["MONGO_DBNAME"] = "data_dashboard"
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
mongo = PyMongo(app)

@app.route("/")
def show_home():
    return render_template("home.html")

@app.route("/europe")
def show_europe():
    return render_template("index.html")
    
@app.route("/row")
def show_row():
    return render_template("index.html")

@app.route("/dataeurope")
def show_data_europe():
    reviews = mongo.db['data-europe'].find({},{"_id": False})
    return json.dumps(list(reviews))

@app.route("/datarow")
def show_data_row():
    reviews = mongo.db['data-row'].find({},{"_id": False})
    return json.dumps(list(reviews))

if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
    port=int(os.environ.get("PORT")),
    debug=True)