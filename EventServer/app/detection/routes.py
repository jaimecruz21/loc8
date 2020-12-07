from aiohttp import web

from .api import DetectionView

routes = [
    web.view('/scanner/detected/', DetectionView),
]