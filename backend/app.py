from flask import Flask, jsonify, request, send_from_directory, render_template, redirect, url_for, session
from flask_cors import CORS
import json
import os
from functools import wraps

# Configurações do arquivo de dados e servidor
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, 'data.json')

app = Flask(__name__, static_folder='../static', template_folder='../templates')
app.secret_key = 'sua_chave_secreta_aqui'  # Troque por algo seguro!
CORS(app)

# Simulação de usuários
users = {
    'admin': '1234',
    'usuario': 'senha'
}

# Decorador para proteger rotas
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

# Rotas de login/logout
@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        if username in users and users[username] == password:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            error = 'Usuário ou senha inválidos.'
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

# Leitura e escrita dos dados
def read_data():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, 'r') as file:
            return json.load(file)
    except json.JSONDecodeError:
        return []

def write_data(data):
    try:
        with open(DATA_FILE, 'w') as file:
            json.dump(data, file, indent=4)
    except Exception as e:
        print(f"Erro ao escrever no arquivo: {e}")

# Páginas protegidas
@app.route('/')
@login_required
def home():
    return render_template('index.html')

@app.route('/dashboard')
@login_required
def dashboard():
    data = read_data()
    produtos = [item['nome'] for item in data if 'nome' in item and 'quantidade' in item]
    quantidades = [item['quantidade'] for item in data if 'nome' in item and 'quantidade' in item]
    return render_template('dashboard.html', produtos=produtos, quantidades=quantidades)

# APIs públicas (você pode proteger com @login_required se quiser)
@app.route('/api/items', methods=['GET'])
def get_items():
    data = read_data()
    valid_data = [item for item in data if item.get('codigo') and item['codigo'] != "undefined"]
    return jsonify(valid_data), 200

@app.route('/api/items', methods=['POST'])
def add_item():
    data = read_data()
    new_item = request.json
    if not new_item.get('codigo') or new_item.get('codigo') == "undefined":
        return jsonify({"error": "Código é obrigatório"}), 400
    data.append(new_item)
    write_data(data)
    return jsonify(new_item), 201

@app.route('/api/items/<codigo>', methods=['PUT'])
def update_item(codigo):
    data = read_data()
    updated_item = request.json
    for i, item in enumerate(data):
        if item.get('codigo') == codigo:
            data[i].update(updated_item)
            write_data(data)
            return jsonify({"message": "Item atualizado"}), 200
    return jsonify({"error": "Item não encontrado"}), 404

@app.route('/api/items/<codigo>', methods=['DELETE'])
def delete_item(codigo):
    data = read_data()
    new_data = [item for item in data if item.get('codigo') != codigo]
    if len(data) == len(new_data):
        return jsonify({"error": "Item não encontrado"}), 404
    write_data(new_data)
    return jsonify({"message": "Item removido"}), 200

@app.route('/style.css')
def serve_css():
    return send_from_directory('../static', 'style.css')

@app.route('/script.js')
def serve_js():
    return send_from_directory('../static', 'script.js')

if __name__ == '__main__':
    app.run(debug=True)