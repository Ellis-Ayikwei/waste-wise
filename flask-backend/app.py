from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import json
import uuid
from database import DatabaseManager

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize database
db = DatabaseManager()


@app.route("/", methods=["GET"])
def home():
    return jsonify(
        {
            "message": "Wasgo Flask Backend API",
            "version": "1.0.0",
            "endpoints": {
                "bins": "/api/v1/bins",
                "sensor_data": "/api/v1/sensor-data",
                "alerts": "/api/v1/alerts",
            },
        }
    )


@app.route("/api/v1/waste/bins/register", methods=["POST"])
def register_bin_legacy():
    """Register a new bin (legacy endpoint for virtual bin simulator)"""
    try:
        data = request.get_json()

        # Map from virtual bin simulator format to our format
        bin_id = data.get("bin_id", str(uuid.uuid4()))

        # Create bin record
        bin_record = {
            "id": bin_id,
            "location": data.get("location", {}),
            "type": data.get("type", "general"),
            "capacity": data.get("capacity", 1000),
            "status": data.get("status", "active"),
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "current_fill_level": 0,
            "battery_level": 100,
            "temperature": 20,
            "weight": 0,
        }

        db.register_bin(bin_record)

        print(
            f"✅ Bin registered (legacy): {bin_id} at {bin_record['location'].get('address', 'Unknown location')}"
        )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Bin registered successfully",
                    "data": bin_record,
                }
            ),
            201,
        )

    except Exception as e:
        print(f"❌ Error registering bin (legacy): {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/waste/bins/<bin_id>/data", methods=["POST"])
def receive_bin_data_legacy(bin_id):
    """Receive sensor data from virtual bins (legacy endpoint)"""
    try:
        data = request.get_json()

        # Create sensor reading record from virtual bin format
        reading_id = str(uuid.uuid4())
        sensor_reading = {
            "id": reading_id,
            "bin_id": bin_id,
            "timestamp": data.get("timestamp", datetime.now().isoformat()),
            "fill_level": data.get("fill_level", 0),
            "temperature": data.get("temperature", 20),
            "battery_level": data.get("battery_level", 100),
            "weight": data.get("sensor_data", {}).get("weight", 0),
            "tilt": data.get("sensor_data", {}).get("tilt", 0)
            > 10,  # Convert tilt degrees to boolean
            "smoke_detected": data.get("sensor_data", {}).get("smoke", False),
            "moisture": data.get("sensor_data", {}).get("moisture", 0),
        }

        # Store sensor reading in database
        db.add_sensor_reading(sensor_reading)

        # Log the data received
        print(f"📊 Sensor data received from bin {bin_id}:")
        print(f"   Fill Level: {sensor_reading['fill_level']}%")
        print(f"   Temperature: {sensor_reading['temperature']}°C")
        print(f"   Battery: {sensor_reading['battery_level']}%")
        print(f"   Weight: {sensor_reading['weight']}kg")

        # Check for alerts
        alerts = check_alerts(sensor_reading)
        if alerts:
            print(f"🚨 Alerts generated: {len(alerts)} alerts")
            for alert in alerts:
                print(f"   - {alert['level'].upper()}: {alert['message']}")
                db.add_alert(alert)

        return jsonify(
            {
                "success": True,
                "message": "Sensor data received",
                "reading_id": reading_id,
                "alerts": alerts,
            }
        )

    except Exception as e:
        print(f"❌ Error receiving sensor data (legacy): {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/bins", methods=["GET"])
def get_bins():
    """Get all registered bins"""
    bins = db.get_all_bins()
    return jsonify({"success": True, "data": bins, "count": len(bins)})


@app.route("/api/v1/bins", methods=["POST"])
def register_bin():
    """Register a new bin"""
    try:
        data = request.get_json()

        # Generate a unique bin ID if not provided
        bin_id = data.get("id", str(uuid.uuid4()))

        # Create bin record
        bin_record = {
            "id": bin_id,
            "location": data.get("location", {}),
            "type": data.get("type", "general"),
            "capacity": data.get("capacity", 1000),
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "last_updated": datetime.now().isoformat(),
            "current_fill_level": 0,
            "battery_level": 100,
            "temperature": 20,
            "weight": 0,
        }

        db.register_bin(bin_record)

        print(
            f"✅ Bin registered: {bin_id} at {bin_record['location'].get('address', 'Unknown location')}"
        )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Bin registered successfully",
                    "data": bin_record,
                }
            ),
            201,
        )

    except Exception as e:
        print(f"❌ Error registering bin: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/bins/<bin_id>", methods=["GET"])
def get_bin(bin_id):
    """Get specific bin details"""
    bin_data = db.get_bin(bin_id)
    if not bin_data:
        return jsonify({"success": False, "error": "Bin not found"}), 404

    return jsonify({"success": True, "data": bin_data})


@app.route("/api/v1/bins/<bin_id>", methods=["PUT"])
def update_bin(bin_id):
    """Update bin information"""
    bin_data = db.get_bin(bin_id)
    if not bin_data:
        return jsonify({"success": False, "error": "Bin not found"}), 404

    try:
        data = request.get_json()
        db.update_bin(bin_id, data)
        updated_bin = db.get_bin(bin_id)

        print(f"🔄 Bin updated: {bin_id}")

        return jsonify(
            {
                "success": True,
                "message": "Bin updated successfully",
                "data": updated_bin,
            }
        )

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/sensor-data", methods=["POST"])
def receive_sensor_data():
    """Receive sensor data from virtual bins"""
    try:
        data = request.get_json()
        bin_id = data.get("bin_id")

        if not bin_id:
            return jsonify({"success": False, "error": "bin_id is required"}), 400

        # Create sensor reading record
        reading_id = str(uuid.uuid4())
        sensor_reading = {
            "id": reading_id,
            "bin_id": bin_id,
            "timestamp": datetime.now().isoformat(),
            "fill_level": data.get("fill_level", 0),
            "temperature": data.get("temperature", 20),
            "battery_level": data.get("battery_level", 100),
            "weight": data.get("weight", 0),
            "tilt": data.get("tilt", False),
            "smoke_detected": data.get("smoke_detected", False),
            "moisture": data.get("moisture", 0),
        }

        # Store sensor reading in database
        db.add_sensor_reading(sensor_reading)

        # Log the data received
        print(f"📊 Sensor data received from bin {bin_id}:")
        print(f"   Fill Level: {sensor_reading['fill_level']}%")
        print(f"   Temperature: {sensor_reading['temperature']}°C")
        print(f"   Battery: {sensor_reading['battery_level']}%")
        print(f"   Weight: {sensor_reading['weight']}kg")

        # Check for alerts
        alerts = check_alerts(sensor_reading)
        if alerts:
            print(f"🚨 Alerts generated: {len(alerts)} alerts")
            for alert in alerts:
                print(f"   - {alert['level'].upper()}: {alert['message']}")
                db.add_alert(alert)

        return jsonify(
            {
                "success": True,
                "message": "Sensor data received",
                "reading_id": reading_id,
                "alerts": alerts,
            }
        )

    except Exception as e:
        print(f"❌ Error receiving sensor data: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/bins/<bin_id>/sensor-data", methods=["GET"])
def get_bin_sensor_data(bin_id):
    """Get sensor data for a specific bin"""
    # Get query parameters
    limit = request.args.get("limit", 50, type=int)

    readings = db.get_sensor_readings(bin_id, limit)

    return jsonify({"success": True, "data": readings, "count": len(readings)})


@app.route("/api/v1/alerts", methods=["GET"])
def get_alerts():
    """Get all active alerts"""
    alerts = db.get_active_alerts()

    return jsonify({"success": True, "data": alerts, "count": len(alerts)})


def check_alerts(sensor_reading):
    """Check sensor reading for alert conditions"""
    alerts = []
    bin_id = sensor_reading["bin_id"]

    # High fill level alert
    if sensor_reading["fill_level"] > 90:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "high_fill_critical",
                "level": "critical",
                "message": f"Bin {bin_id} is critically full ({sensor_reading['fill_level']}%)",
                "timestamp": sensor_reading["timestamp"],
            }
        )
    elif sensor_reading["fill_level"] > 80:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "high_fill_warning",
                "level": "warning",
                "message": f"Bin {bin_id} is nearly full ({sensor_reading['fill_level']}%)",
                "timestamp": sensor_reading["timestamp"],
            }
        )

    # Low battery alert
    if sensor_reading["battery_level"] < 10:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "low_battery_critical",
                "level": "critical",
                "message": f"Bin {bin_id} has critically low battery ({sensor_reading['battery_level']}%)",
                "timestamp": sensor_reading["timestamp"],
            }
        )
    elif sensor_reading["battery_level"] < 20:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "low_battery_warning",
                "level": "warning",
                "message": f"Bin {bin_id} has low battery ({sensor_reading['battery_level']}%)",
                "timestamp": sensor_reading["timestamp"],
            }
        )

    # High temperature alert
    if sensor_reading["temperature"] > 35:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "high_temperature",
                "level": "warning",
                "message": f"Bin {bin_id} has high temperature ({sensor_reading['temperature']}°C)",
                "timestamp": sensor_reading["timestamp"],
            }
        )

    # Smoke detection alert
    if sensor_reading["smoke_detected"]:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "smoke_detected",
                "level": "critical",
                "message": f"Smoke detected in bin {bin_id}",
                "timestamp": sensor_reading["timestamp"],
            }
        )

    # Tilt alert
    if sensor_reading["tilt"]:
        alerts.append(
            {
                "id": str(uuid.uuid4()),
                "bin_id": bin_id,
                "type": "bin_tilted",
                "level": "warning",
                "message": f"Bin {bin_id} has been tilted or knocked over",
                "timestamp": sensor_reading["timestamp"],
            }
        )

    return alerts


@app.route("/api/v1/stats", methods=["GET"])
def get_stats():
    """Get overall system statistics"""
    stats = db.get_stats()
    return jsonify({"success": True, "data": stats})


@app.route("/api/v1/alerts/<alert_id>/resolve", methods=["POST"])
def resolve_alert(alert_id):
    """Mark an alert as resolved"""
    try:
        db.resolve_alert(alert_id)
        print(f"✅ Alert resolved: {alert_id}")

        return jsonify({"success": True, "message": "Alert resolved successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


@app.route("/api/v1/maintenance/cleanup", methods=["POST"])
def cleanup_database():
    """Clean up old sensor readings"""
    try:
        days = request.args.get("days", 30, type=int)
        deleted_count = db.cleanup_old_readings(days)

        print(
            f"🧹 Cleaned up {deleted_count} old sensor readings (older than {days} days)"
        )

        return jsonify(
            {
                "success": True,
                "message": f"Cleaned up {deleted_count} old sensor readings",
                "deleted_count": deleted_count,
            }
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


if __name__ == "__main__":
    print("🚀 Starting Wasgo Flask Backend...")
    print("📊 Dashboard will be available at http://localhost:5000")
    print("🔌 API endpoints available at http://localhost:5000/api/v1/")
    app.run(host="0.0.0.0", port=5000, debug=True)
