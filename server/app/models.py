import json

class EventData:
    def __init__(self, type: str, data: list[str] = None, errorMsg: str = None):
        self.type = type
        self.data = data
        self.errorMsg = errorMsg

    def to_json(self) -> str:
        payload = {"type": self.type}
        if self.data:
            payload["data"] = self.data
        if self.errorMsg:
            payload["errorMsg"] = self.errorMsg
        return json.dumps(payload)
