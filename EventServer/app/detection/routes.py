from aiohttp import web

from .api import DetectionView

routes = [
    web.view('/scanner/v1/detected/', DetectionView)
]