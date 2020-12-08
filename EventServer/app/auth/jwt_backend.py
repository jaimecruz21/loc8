import jwt
import logging


logger = logging.getLogger('jwt_backend')

DEFAULT_ALGS = ('HS256', )


class JWTClientBackend:

    def __init__(self, secret=None, algorithms=DEFAULT_ALGS, audience=None,
                 issuer=None):
        self.secret = secret
        self.algorithms = algorithms
        self.audience = audience
        self.issuer = issuer

    def validate(self, token):
        #TODO: can be improved in future with specific requirements.
        return self.decode_token(token)

    def decode_token(self, token):
        try:
            return jwt.decode(
                token,
                self.secret,
                algorithms=self.algorithms,
                audience=self.audience,
                issuer=self.issuer
            )
        except jwt.InvalidTokenError as exc:
            logger.exception(exc, exc_info=exc)