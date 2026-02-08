import asyncio
import sys
import websockets
from log_streamer import LogStreamer

async def main():
    PATH = "../logs/sample.log"
    HOST = "localhost"
    PORT = 8000

    try:
        log_streamer = LogStreamer(file_path=PATH, line_count=10)
        watch_log_task = asyncio.create_task(log_streamer.watch_log())

        server = websockets.serve(log_streamer.ws_handler, host=HOST, port=PORT)
        print(f"Websocket server started at ws://{HOST}/{PORT}")

        async with server:
            await asyncio.gather(watch_log_task)
    except Exception as e:
        print(f"Unexpected error occured: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Shutdown requested via keyboard. Exiting!")
    