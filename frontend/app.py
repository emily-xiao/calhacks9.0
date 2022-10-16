from flask import Flask, request, url_for, session, redirect, render_template
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import time 
from time import gmtime, strftime
import playlist.py, track.py, spotify_client.py

import os

app = Flask(__name__)

CLIENT_ID = '3e8ea4047a99490ab60768bc5269bc53'
CLIENT_SECRET = '176396f3ac83433caef42abf302af117'
TOKEN_CODE = "token_info"


app.secret_key = 'O238746uoiueihns'
app.config['SESSION_COOKIE_NAME'] = 'Our Cookie'


@app.route('/')
def index():
    return render_template('index.html')

def create_spotify_oauth():
    return SpotifyOAuth(
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        redirect_uri=url_for("redirectPage",_external=True),
        scope="user-read-recently-played playlist-modify-public playlist-modify-private"
    )


@app.route('/login')
def login():
    sp_oauth = create_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return redirect(auth_url)

@app.route('/redirect')
def redirectPage():
    sp_oauth = create_spotify_oauth()
    session.clear() 
    code = request.args.get('code')
    token_info = sp_oauth.get_access_token(code)
    session[TOKEN_CODE] = token_info    
    return redirect(url_for("ranking", _external=True))

def get_token(): 
    token_info = session.get(TOKEN_CODE, None)
    if not token_info: 
        raise "exception"
    now = int(time.time())
    is_expired = token_info['expires_at'] - now < 60 
    if (is_expired): 
        sp_oauth = create_spotify_oauth()
        token_info = sp_oauth.refresh_access_token(token_info['refresh_token'])
    return token_info 

@app.route('/ranking')
def ranking():
    return render_template('ranking-page.html')

@app.route('/playlistname')
def playlist_name():
    return render_template('playlist-name.html')

@app.route('/createplaylist')
def create_playlist():
    spotify_client = SpotifyClient(get_token(), ***)
    num_tracks_to_visualise = 50
    last_played_tracks = spotify_client.get_last_played_tracks(num_tracks_to_visualise)
    last_played_valences = spotify_client.get_valence(last_played_tracks)
    user_input = ***
    seed_tracks = spotify_client.nearest_neighbours(user_input, last_played_tracks, last_played_valences)
    recommended_tracks = spotify_client.get_track_recommendations(seed_tracks)
    playlist_name = ***
    spotify_client.populate_playlist(playlist, recommended_tracks)
    return render_template('create-playlist.html') ***

if __name__ == '__main__':
    app.run(port=4455)