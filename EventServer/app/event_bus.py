import json
import asyncio
from collections import defaultdict


class EventBus:
    def __init__(self):
        self.rooms = defaultdict(set)
        self.subscribers = defaultdict(set)

    def _get_id(self, ws):
        """extract id from ws connection"""
        # TODO: make something more specific
        return ws

    def subscribe(self, ws, room):
        id = self._get_id(ws)
        self._subscribe(id, room)

    def unsubscribe(self, ws, room):
        id = self._get_id(ws)
        self._unsubscribe(id, room)

    def _subscribe(self, id, room):
        """subscribe on specific room"""
        self.rooms[room].add(id)
        self.subscribers[id].add(room)

    def _unsubscribe(self, id, room):
        """unsubscribe client from specific room"""
        self.rooms[room].discard(id)
        self.subscribers[id].discard(room)

    def leave(self, ws):
        """unsubscribe from all rooms"""
        id = ws.id
        for room in self.subscribers[id]:
            self._unsubscribe(id, room)

    async def new_detection(self, data):
        room = data.get('hubId')
        await self._room_message(room, 'detection', data)

    async def _room_message(self, room, command, payload):
        targets = self.rooms[room]
        if not targets:
            return
        msg = self._response_params(command, payload, room=room)
        await asyncio.wait([ws.send_str(msg) for ws in targets])

    def _response_params(self, command, payload, room=None):
        return json.dumps(dict(
            command=command,
            room=room,
            payload=payload
        ))
