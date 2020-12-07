# middlewares.py
import re
import jwt
import logging
from aiohttp_apispec import validation_middleware
from aiohttp import web, hdrs

logger = logging.getLogger('jwt_middleware')

DEFAULT_ALGS = ('HS256', )


def JWTMiddleware(
    secret_key,
    auth_scheme='Bearer',
    algorithms=DEFAULT_ALGS,
    audience=None,
    issuer=None,
    request_property='jwt_data',

):
    if not (secret_key and isinstance(secret_key, str)):
        raise RuntimeError(
            'secret key should be provided for correct work',
        )

    @web.middleware
    async def jwt_middleware(request, handler):
        if request.method == hdrs.METH_OPTIONS:
            return await handler(request)


        try:
            scheme, token = request.headers.get(
                'Authorization', ''
            ).strip().split(' ')
        except ValueError:
            raise web.HTTPForbidden(
                reason='Invalid authorization header',
            )

        if not re.match(auth_scheme, scheme):
            raise web.HTTPForbidden(
                reason='Invalid token scheme',
            )

        if not token:
            raise web.HTTPUnauthorized(
                reason='Missing authorization token',
            )

        if token is not None:
            if not isinstance(token, bytes):
                token = token.encode()

            try:
                decoded = jwt.decode(
                    token,
                    secret_key,
                    algorithms=algorithms,
                    audience=audience,
                    issuer=issuer
                )
            except jwt.InvalidTokenError as exc:
                logger.exception(exc, exc_info=exc)
                msg = 'Invalid authorization token, ' + str(exc)
                raise web.HTTPUnauthorized(reason=msg)

            request[request_property] = decoded
        return await handler(request)
    return jwt_middleware


def setup_middlewares(app):
    app.middlewares.append(validation_middleware)
    app.middlewares.append(JWTMiddleware(app['config']['jwt_secret']))