from flask import Flask, request, render_template, redirect, url_for, session, jsonify

from pyrebase import pyrebase

import random
import string
from datetime import datetime
app = Flask(__name__)
app.secret_key = b'_5#a8N"Q2T3r\n\xec]/'

config = {
  "apiKey": "AIzaSyCkobKvAAv2NBSgLT3kQCMY68PSHJMnCbI",
  "authDomain": "headcount-2a70b.firebaseapp.com",
  "databaseURL": "https://headcount-2a70b.firebaseio.com/",
  "projectId": "headcount-2a70b",
  "storageBucket": "headcount.appspot.com",
  "serviceAccount": "headcount-key.json",
  "messagingSenderId": "430271769046"
}

firebase = pyrebase.initialize_app(config)
db = firebase.database()

auth = firebase.auth()
#authenticate a user
user = auth.sign_in_with_email_and_password("nikash.kh@berkeley.edu", "abc12345")

#Mask for Hashing
_memomask = {}

def hash_function(n):
  mask = _memomask.get(n)
  if mask is None:
    random.seed(n)
    mask = _memomask[n] = random.getrandbits(32)
  def myhash(x):
    return hash(x) ^ mask
  return myhash

h1 = hash_function(1)


@app.route('/check-in/<name>', methods=["GET"])
def check_in(name):
    #userID = ''.join([random.choice(string.ascii_letters
    #                                + string.digits) for n in range(16)])
    ip_address = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)

    base = str("%s|%s" % (ip_address,
                              request.headers.get("User-Agent")))
    print(base)
    encoded_id = h1(base)
    #encoded_id = h1(ip_address)
    session['userID'] = encoded_id

    return redirect(url_for('update_check_in', name=name))


@app.route('/update-check-in/<name>/', methods=["GET"])
def update_check_in(name):
    userID = session['userID']

    if db.child("stores").child(name).child(userID).get(user['idToken']).val() == None:
        check_in_time = str(datetime.now())
        db.child("stores").child(name).update({userID: "active"}, user['idToken'])

        db.child("transactions").push(
            {"deviceID": userID, "store": name, "time": str(datetime.now()), "interaction_type": "check-in"},
            user['idToken'])

        people = db.child("stores").child(name).child("people").get(user['idToken']).val() + 1
        db.child("stores").child(name).update({"people": people})

        return redirect(url_for('shopping', name=name))
    else:
        # HERE WE WANT TO SEND AN ALERT TO USER SAYING THEY ARE ALREADY CHECKED IN
        print("ALERT! You have already checked in. You are being directed to the checkout page")
        # ADD LOGGING INFO HERE with userID and timestamp
        return redirect(url_for('shopping', name=name))


@app.route('/check-out/<name>/', methods=["GET", "POST"])
def shopping(name):
    userID = session['userID']
    if userID is None:
        print("THROW ERROR")

    if request.method == 'POST':

        if "checkout" in request.form:
            if db.child("stores").child(name).child(userID).get(user['idToken']).val() != None:
                people = db.child("stores").child(name).child("people").get(user['idToken']).val() - 1
                db.child("stores").child(name).child(userID).remove(user['idToken'])
                db.child("stores").child(name).update({"people": people})

                db.child("transactions").push(
                    {"deviceID": userID, "store": name, "time": str(datetime.now()), "interaction_type": "check-out"},
                    user['idToken'])
            # ADD LOGGING INFO HERE with userID and timestamp
            return redirect(url_for('done_shopping', name=name))
    return render_template("check_out.html")


@app.route('/done/<name>', methods=["GET"])
def done_shopping(name):
    return render_template("done.html")

@app.route('/get-markers-info', methods=["GET"])
def get_markers():
    stores = dict(db.child("stores").get(user['idToken']).val())
    num_stores = stores.pop('number')
    markers = []
    for name, info in stores.items():
        marker = {'latitude': info['latitude'], 'longitude': info['longitude'], 'title': info['name'], 'subtitle': info['people'], 'key': name}
        markers.append(marker)


    response = jsonify(markers)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response