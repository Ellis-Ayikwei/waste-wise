import sqlite3
from datetime import datetime
import json

class DatabaseManager:
    def __init__(self, db_path='waste_management.db'):
        self.db_path = db_path
        self.init_database()
    
    def init_database(self):
        """Initialize the database with required tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create bins table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bins (
                id TEXT PRIMARY KEY,
                location_address TEXT,
                location_lat REAL,
                location_lng REAL,
                type TEXT,
                capacity INTEGER,
                status TEXT,
                created_at TEXT,
                last_updated TEXT,
                current_fill_level REAL DEFAULT 0,
                battery_level REAL DEFAULT 100,
                temperature REAL DEFAULT 20,
                weight REAL DEFAULT 0
            )
        ''')
        
        # Create sensor_readings table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS sensor_readings (
                id TEXT PRIMARY KEY,
                bin_id TEXT,
                timestamp TEXT,
                fill_level REAL,
                temperature REAL,
                battery_level REAL,
                weight REAL,
                tilt BOOLEAN,
                smoke_detected BOOLEAN,
                moisture REAL,
                FOREIGN KEY (bin_id) REFERENCES bins (id)
            )
        ''')
        
        # Create alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id TEXT PRIMARY KEY,
                bin_id TEXT,
                type TEXT,
                level TEXT,
                message TEXT,
                timestamp TEXT,
                resolved BOOLEAN DEFAULT FALSE,
                FOREIGN KEY (bin_id) REFERENCES bins (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        print("✅ Database initialized successfully")
    
    def register_bin(self, bin_data):
        """Register a new bin in the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        location = bin_data.get('location', {})
        
        cursor.execute('''
            INSERT OR REPLACE INTO bins (
                id, location_address, location_lat, location_lng, type, capacity,
                status, created_at, last_updated, current_fill_level, battery_level,
                temperature, weight
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            bin_data['id'],
            location.get('address', ''),
            location.get('lat', 0.0),
            location.get('lng', 0.0),
            bin_data['type'],
            bin_data['capacity'],
            bin_data['status'],
            bin_data['created_at'],
            bin_data['last_updated'],
            bin_data['current_fill_level'],
            bin_data['battery_level'],
            bin_data['temperature'],
            bin_data['weight']
        ))
        
        conn.commit()
        conn.close()
        return bin_data
    
    def get_all_bins(self):
        """Get all bins from the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM bins')
        rows = cursor.fetchall()
        
        bins = []
        for row in rows:
            bin_data = {
                'id': row[0],
                'location': {
                    'address': row[1],
                    'lat': row[2],
                    'lng': row[3]
                },
                'type': row[4],
                'capacity': row[5],
                'status': row[6],
                'created_at': row[7],
                'last_updated': row[8],
                'current_fill_level': row[9],
                'battery_level': row[10],
                'temperature': row[11],
                'weight': row[12]
            }
            bins.append(bin_data)
        
        conn.close()
        return bins
    
    def get_bin(self, bin_id):
        """Get a specific bin by ID"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT * FROM bins WHERE id = ?', (bin_id,))
        row = cursor.fetchone()
        
        if row:
            bin_data = {
                'id': row[0],
                'location': {
                    'address': row[1],
                    'lat': row[2],
                    'lng': row[3]
                },
                'type': row[4],
                'capacity': row[5],
                'status': row[6],
                'created_at': row[7],
                'last_updated': row[8],
                'current_fill_level': row[9],
                'battery_level': row[10],
                'temperature': row[11],
                'weight': row[12]
            }
            conn.close()
            return bin_data
        
        conn.close()
        return None
    
    def update_bin(self, bin_id, updates):
        """Update bin information"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Build dynamic update query
        set_clauses = []
        values = []
        
        for key, value in updates.items():
            if key == 'location':
                if 'address' in value:
                    set_clauses.append('location_address = ?')
                    values.append(value['address'])
                if 'lat' in value:
                    set_clauses.append('location_lat = ?')
                    values.append(value['lat'])
                if 'lng' in value:
                    set_clauses.append('location_lng = ?')
                    values.append(value['lng'])
            else:
                set_clauses.append(f'{key} = ?')
                values.append(value)
        
        if set_clauses:
            set_clauses.append('last_updated = ?')
            values.append(datetime.now().isoformat())
            values.append(bin_id)
            
            query = f"UPDATE bins SET {', '.join(set_clauses)} WHERE id = ?"
            cursor.execute(query, values)
            conn.commit()
        
        conn.close()
    
    def add_sensor_reading(self, reading_data):
        """Add a sensor reading to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO sensor_readings (
                id, bin_id, timestamp, fill_level, temperature, battery_level,
                weight, tilt, smoke_detected, moisture
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            reading_data['id'],
            reading_data['bin_id'],
            reading_data['timestamp'],
            reading_data['fill_level'],
            reading_data['temperature'],
            reading_data['battery_level'],
            reading_data['weight'],
            reading_data['tilt'],
            reading_data['smoke_detected'],
            reading_data['moisture']
        ))
        
        # Update bin current status
        cursor.execute('''
            UPDATE bins SET 
                current_fill_level = ?, 
                battery_level = ?, 
                temperature = ?, 
                weight = ?, 
                last_updated = ?
            WHERE id = ?
        ''', (
            reading_data['fill_level'],
            reading_data['battery_level'],
            reading_data['temperature'],
            reading_data['weight'],
            reading_data['timestamp'],
            reading_data['bin_id']
        ))
        
        conn.commit()
        conn.close()
    
    def get_sensor_readings(self, bin_id, limit=50):
        """Get sensor readings for a specific bin"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM sensor_readings 
            WHERE bin_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ?
        ''', (bin_id, limit))
        
        rows = cursor.fetchall()
        readings = []
        
        for row in rows:
            reading = {
                'id': row[0],
                'bin_id': row[1],
                'timestamp': row[2],
                'fill_level': row[3],
                'temperature': row[4],
                'battery_level': row[5],
                'weight': row[6],
                'tilt': bool(row[7]),
                'smoke_detected': bool(row[8]),
                'moisture': row[9]
            }
            readings.append(reading)
        
        conn.close()
        return readings
    
    def add_alert(self, alert_data):
        """Add an alert to the database"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO alerts (
                id, bin_id, type, level, message, timestamp, resolved
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            alert_data['id'],
            alert_data['bin_id'],
            alert_data['type'],
            alert_data['level'],
            alert_data['message'],
            alert_data['timestamp'],
            False
        ))
        
        conn.commit()
        conn.close()
    
    def get_active_alerts(self):
        """Get all active (unresolved) alerts"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM alerts 
            WHERE resolved = FALSE 
            ORDER BY timestamp DESC
        ''')
        
        rows = cursor.fetchall()
        alerts = []
        
        for row in rows:
            alert = {
                'id': row[0],
                'bin_id': row[1],
                'type': row[2],
                'level': row[3],
                'message': row[4],
                'timestamp': row[5],
                'resolved': bool(row[6])
            }
            alerts.append(alert)
        
        conn.close()
        return alerts
    
    def resolve_alert(self, alert_id):
        """Mark an alert as resolved"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('UPDATE alerts SET resolved = TRUE WHERE id = ?', (alert_id,))
        conn.commit()
        conn.close()
    
    def get_stats(self):
        """Get database statistics"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Total bins
        cursor.execute('SELECT COUNT(*) FROM bins')
        total_bins = cursor.fetchone()[0]
        
        # Active bins
        cursor.execute('SELECT COUNT(*) FROM bins WHERE status = "active"')
        active_bins = cursor.fetchone()[0]
        
        # Average fill level
        cursor.execute('SELECT AVG(current_fill_level) FROM bins WHERE status = "active"')
        avg_fill = cursor.fetchone()[0] or 0
        
        # Bin types count
        cursor.execute('SELECT type, COUNT(*) FROM bins GROUP BY type')
        bin_types = dict(cursor.fetchall())
        
        # Total sensor readings
        cursor.execute('SELECT COUNT(*) FROM sensor_readings')
        total_readings = cursor.fetchone()[0]
        
        # Active alerts
        cursor.execute('SELECT COUNT(*) FROM alerts WHERE resolved = FALSE')
        active_alerts = cursor.fetchone()[0]
        
        conn.close()
        
        return {
            'total_bins': total_bins,
            'active_bins': active_bins,
            'average_fill_level': round(avg_fill, 2),
            'bin_types': bin_types,
            'total_sensor_readings': total_readings,
            'active_alerts': active_alerts
        }
    
    def cleanup_old_readings(self, days=30):
        """Remove sensor readings older than specified days"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cutoff_date = datetime.now().replace(day=datetime.now().day - days).isoformat()
        
        cursor.execute('DELETE FROM sensor_readings WHERE timestamp < ?', (cutoff_date,))
        deleted_count = cursor.rowcount
        
        conn.commit()
        conn.close()
        
        return deleted_count
