from flasgger import Swagger
from flask import Flask, redirect, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_restful import Api
from flask import request

from src.auth.routes import auth_bp
from src.config import Config
from src.models import db
from src.resources.produto_resource import ListaDeProdutosResource, ProdutoResource
from src.swagger_config import swagger_config, swagger_template


def create_app():
    app: Flask = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    db.init_app(app)
    JWTManager(app)
    api = Api(app)

    Swagger(app, config=swagger_config, template=swagger_template)

    with app.app_context():
        db.create_all()

    app.register_blueprint(auth_bp)

    api.add_resource(ListaDeProdutosResource, '/produtos')
    api.add_resource(ProdutoResource, '/produtos')

    @app.route('/')
    def redirect_to_docs():
        return redirect('/apidocs')

    return app