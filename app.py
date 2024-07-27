from flask import Flask, render_template, jsonify

app = Flask(__name__)

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Route for game levels
@app.route('/game/<int:level>')
def game(level):
    return render_template('game.html', level=level)

# Example API endpoints for fetching game data
@app.route('/api/sudoku')
def sudoku():
    # Here you would normally fetch from a real API
    puzzle = "530070910600195008098040060800060003400803001700020006060000280087419005300080079"
    return jsonify({'puzzle': puzzle})

if __name__ == '__main__':
    app.run(debug=True)