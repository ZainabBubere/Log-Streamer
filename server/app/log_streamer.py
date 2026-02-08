import asyncio
import os
import websockets
from models import EventData

class LogStreamer:
    def __init__(self, file_path: str, line_count: int = 10, batch_size: int = 1):
        if not os.path.exists(file_path):
            raise Exception("There is no file present at this path")
        if not os.path.isfile(file_path):
            raise Exception("Given path is not of a file")
        if not os.access(file_path, os.R_OK):
            raise Exception("No permission to read this file")
        self.file_path = file_path
        self.line_count = line_count
        self.batch_size = batch_size
        self.clients = set()
        self.file = None
    
    def get_last_n_lines(self) -> list[str]:
        with open(self.file_path, "rb") as f:
            buffer = b""
            block_size = 1024
            lines = []
            f.seek(0, os.SEEK_END)
            file_size = f.tell()
            pointer = file_size
            while pointer > 0 and len(lines) <= self.line_count:
                read_size = min(block_size, file_size)
                pointer -= read_size
                f.seek(pointer)
                buffer = f.read(read_size) + buffer
                lines = buffer.splitlines()
            return [line.decode("utf-8", errors="ignore") for line in lines[-self.line_count:]]
        
    async def ws_handler(self, websocket):
        self.clients.add(websocket)
        try:
            try:
                lines = self.get_last_n_lines()
                msg = EventData(type="initial", data=lines)
                await websocket.send(msg.to_json())
            except Exception as e:
                msg = EventData(type="error", errorMsg=str(e))
                await websocket.send(msg.to_json())
            await websocket.wait_closed()
        finally:
            self.clients.discard(websocket)

    async def broadcast(self, msg: str):
        disconnected = set()
        for client in self.clients:
            try:
                await client.send(msg)
            except websockets.exceptions.ConnectionClosedError:
                disconnected.add(client)
        self.clients -= disconnected

    async def watch_log(self):
        try:
            self.file = open(self.file_path, "r")
            self.file.seek(0, os.SEEK_END)
            while True:
                await asyncio.sleep(1)
                if self.file:
                    new_lines = []
                    for line in self.file.readlines():
                        new_lines.append(line.strip())
                        if len(new_lines) >= self.batch_size:
                            msg = EventData(type="update", data=new_lines)
                            await self.broadcast(msg.to_json())   
                            new_lines = [] 
        except Exception as e:
            raise Exception(str(e))
        finally:
            if self.file:
                self.file.close()
