from flasgger import swag_from
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_restful import Resource

from src.models import Usuario


class ProfileResource(Resource):
    @swag_from({
        'tags': ['Usuário'],
        'summary': 'Obter dados do perfil autenticado',
        'security': [{
            'BearerAuth': []
        }],
        'responses': {
            200: {
                'description': 'Perfil do usuário',
                'content': {
                    'application/json': {
                        'example': {
                            "id": 1,
                            "username": "detetivezin"
                        }
                    }
                }
            },
            401: {
                'description': 'Token inválido ou expirado'
            }
        }
    })
    @jwt_required()
    def get(self):
        user = Usuario.query.get(get_jwt_identity())
        if user:
            return {
                "username": user.username
            }