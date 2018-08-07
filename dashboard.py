import os
from flask import Flask, render_template, redirect, request, url_for
from flask_pymongo import PyMongo
import json


app = Flask(__name__)

app.config["MONGO_DBNAME"] = "data_dashboard"
app.config["MONGO_URI"] = os.environ.get("MONGO_URI")
mongo = PyMongo(app)

@app.route("/")
def show_index():
    return render_template("index.html")

@app.route("/data")
def show_data():
    reviews = mongo.db.winereviews.find({},{"_id": False})
    return json.dumps(list(reviews))

if __name__ == "__main__":
    app.run(host=os.environ.get("IP"),
    port=int(os.environ.get("PORT")),
    debug=True)