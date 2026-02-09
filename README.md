# Problem Statement: Real-Time Log Watcher

## Overview
Implement a log watching solution similar to the UNIX `tail -f` command. The solution consists of a server-side monitor and a real-time web client.



## Requirements

### 1. Server-Side Program
- **Environment:** Must run on the same machine as the log file.
- **Functionality:** - Monitor a specific log file in **append-only** mode.
    - Stream updates to the client as they occur.
- **Implementation:** Any programming language is permitted.

### 2. Web-Based Client
- **URL:** Accessible via `http://localhost/log`.
- **Real-Time Feed:** - The page must update automatically as new lines are added.
    - **No page refreshes** allowed to see new data.
- **Initial Load:** The user must see the **last 10 lines** of the file immediately upon landing on the page.

---

## Technical Constraints
- **Persistent Connection:** The page should be loaded once and remain updated via a continuous stream (e.g., WebSockets or SSE).
- **Efficiency:** Avoid reading the entire file for every update; only the delta (newly appended data) should be sent to the client.