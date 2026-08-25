import io
import random
from datetime import datetime, timezone
from fastapi import APIRouter, Response
from PIL import Image, ImageDraw

router = APIRouter(prefix="/api", tags=["Robot & ESP32"])

# Robot telemetry state - default is DISCONNECTED / OFFLINE until real robot pings or connects
robot_state = {
    "robot_id": "AGRI-BOT-V2",
    "connected": False,
    "status": "Offline",  # "Offline", "Cutting", "Scanning", "Idle"
    "battery_pct": 0,
    "gps": None,
    "speed_kmh": 0.0,
    "scanned_acres": 0.0,
    "total_scans": 0,
    "active_alerts": 0,
    "last_updated": None
}

@router.get("/robot/status")
async def get_robot_status():
    """
    Returns live robot telemetry status.
    Returns Offline state if hardware is not connected.
    """
    if robot_state["connected"]:
        # Simulate slight motion when connected
        if robot_state["gps"]:
            robot_state["gps"]["lat"] += random.uniform(-0.00005, 0.00005)
            robot_state["gps"]["lng"] += random.uniform(-0.00005, 0.00005)
        robot_state["last_updated"] = datetime.now(timezone.utc).isoformat()
    return robot_state

@router.post("/robot/connect")
async def toggle_robot_connection(payload: dict):
    """
    Simulates hardware connection / ping from physical robot controller.
    """
    connect = payload.get("connect", True)
    if connect:
        robot_state["connected"] = True
        robot_state["status"] = "Scanning"
        robot_state["battery_pct"] = 92
        robot_state["gps"] = {"lat": 16.5062, "lng": 80.6480}
        robot_state["speed_kmh"] = 2.8
        robot_state["last_updated"] = datetime.now(timezone.utc).isoformat()
    else:
        robot_state["connected"] = False
        robot_state["status"] = "Offline"
        robot_state["battery_pct"] = 0
        robot_state["gps"] = None
        robot_state["speed_kmh"] = 0.0

    return {"status": "success", "current_state": robot_state}

@router.post("/robot/control")
async def control_robot(command: dict):
    """
    Accepts commands: start_scan, start_cutting, pause, return_dock
    """
    cmd = command.get("command", "")
    if not robot_state["connected"]:
        return {"status": "error", "message": "Cannot control robot. Robot hardware is disconnected.", "current_state": robot_state}

    if cmd == "start_scan":
        robot_state["status"] = "Scanning"
        robot_state["speed_kmh"] = 2.8
    elif cmd == "start_cutting":
        robot_state["status"] = "Cutting"
        robot_state["speed_kmh"] = 1.5
    elif cmd == "pause":
        robot_state["status"] = "Idle"
        robot_state["speed_kmh"] = 0.0
    elif cmd == "return_dock":
        robot_state["status"] = "Idle"
        robot_state["speed_kmh"] = 4.0
        robot_state["gps"] = {"lat": 16.5062, "lng": 80.6480}

    return {"status": "success", "command_executed": cmd, "current_state": robot_state}

@router.get("/esp32/frame")
async def get_esp32_frame():
    """
    Generates synthetic plant frame for instant scanning test.
    """
    width, height = 640, 480
    img = Image.new("RGB", (width, height), color=(34, 139, 34))
    draw = ImageDraw.Draw(img)

    draw.polygon([(80, 400), (320, 60), (560, 400)], fill=(46, 160, 67))
    draw.line([(320, 60), (320, 440)], fill=(20, 80, 30), width=6)
    draw.line([(320, 150), (180, 260)], fill=(20, 80, 30), width=3)
    draw.line([(320, 250), (450, 340)], fill=(20, 80, 30), width=3)

    draw.ellipse([260, 180, 380, 280], fill=(160, 82, 45), outline=(139, 69, 19))
    draw.ellipse([280, 200, 340, 250], fill=(218, 165, 32))

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    draw.rectangle([10, 10, 360, 45], fill=(0, 0, 0, 180))
    draw.text((20, 20), f"ESP32-CAM Live: {now_str}", fill=(255, 255, 255))

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=80)
    return Response(content=buf.getvalue(), media_type="image/jpeg")
