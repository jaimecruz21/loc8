from aiohttp import web

from .api import NewDetectionView, DeviceDetectionView

routes = [
    web.view('/scanner/detected/', NewDetectionView),
    web.view('/detections/', DeviceDetectionView)
]