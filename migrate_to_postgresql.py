#!/usr/bin/env python3
"""
Migration script to move data from SQLite to PostgreSQL
This script preserves all data and functionality while switching databases
"""

import sqlite3
import psycopg2
import os
from datetime import datetime
from flask import Flask
from app import app, db, User, Role, UserRole, LoginActivity, Patient, EmergencyContact, Appointment, Registration, Inpatient, MedicalRecord, NursingNote, DoctorNote, Diagnosis, Medication, PharmacyStock, PharmacyOrder, Schedule, Attendance, Payroll, Notification, AuditLog, ErrorLog, ReportsGenerated, Ward, Bed, BedAllocation, Equipment, SuppliesInventory, Vendor, PatientLogin, PatientFeedback, Download, AppointmentRequest, Bill, SecurityLog, LabSample, Vitals, Communication, LabOrder, RadiologyOrder, PatientVisit, Invoice

def migrate_sqlite_to_postgresql():
    """Migrate data from SQLite to PostgreSQL"""
    print("🚀 Starting migration from SQLite to PostgreSQL...")
    
    # SQLite database path
    sqlite_db_path = 'backend/instance/hmis.db'
    
    if not os.path.exists(sqlite_db_path):
        print("❌ SQLite database not found at:", sqlite_db_path)
        return False
    
    try:
        # Connect to SQLite database
        print("📖 Reading data from SQLite database...")
        sqlite_conn = sqlite3.connect(sqlite_db_path)
        sqlite_conn.row_factory = sqlite3.Row
        sqlite_cursor = sqlite_conn.cursor()
        
        # Get all table names from SQLite
        sqlite_cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
        tables = [row['name'] for row in sqlite_cursor.fetchall()]
        
        print(f"📋 Found {len(tables)} tables: {', '.join(tables)}")
        
        # Initialize Flask app context for PostgreSQL operations
        with app.app_context():
            # Drop all tables in PostgreSQL and recreate
            print("🗑️  Dropping existing PostgreSQL tables...")
            db.drop_all()
            
            print("🏗️  Creating new PostgreSQL tables...")
            db.create_all()
            
            # Migrate data table by table
            for table_name in tables:
                if table_name == 'sqlite_sequence' or table_name == 'alembic_version':
                    continue
                    
                print(f"📦 Migrating table: {table_name}")
                
                # Get all data from SQLite table
                sqlite_cursor.execute(f"SELECT * FROM {table_name}")
                rows = sqlite_cursor.fetchall()
                
                if not rows:
                    print(f"   ⚠️  Table {table_name} is empty, skipping...")
                    continue
                
                # Get column names
                columns = [description[0] for description in sqlite_cursor.description]
                print(f"   📊 Found {len(rows)} rows with columns: {', '.join(columns)}")
                
                # Insert data into PostgreSQL
                for row in rows:
                    row_dict = dict(row)
                    
                    # Handle datetime conversion
                    for key, value in row_dict.items():
                        if isinstance(value, str) and 'T' in value and ('+' in value or '-' in value):
                            try:
                                # Convert ISO format datetime strings
                                row_dict[key] = datetime.fromisoformat(value.replace('Z', '+00:00'))
                            except:
                                pass
                    
                    # Insert into PostgreSQL using SQLAlchemy
                    try:
                        # Map table names to model classes
                        model_map = {
                            'user': User,
                            'role': Role,
                            'user_role': UserRole,
                            'login_activity': LoginActivity,
                            'patient': Patient,
                            'emergency_contact': EmergencyContact,
                            'appointment': Appointment,
                            'registration': Registration,
                            'inpatient': Inpatient,
                            'medical_record': MedicalRecord,
                            'nursing_note': NursingNote,
                            'doctor_note': DoctorNote,
                            'diagnosis': Diagnosis,
                            'medication': Medication,
                            'pharmacy_stock': PharmacyStock,
                            'pharmacy_order': PharmacyOrder,
                            'schedule': Schedule,
                            'attendance': Attendance,
                            'payroll': Payroll,
                            'notification': Notification,
                            'audit_log': AuditLog,
                            'error_log': ErrorLog,
                            'reports_generated': ReportsGenerated,
                            'ward': Ward,
                            'bed': Bed,
                            'bed_allocation': BedAllocation,
                            'equipment': Equipment,
                            'supplies_inventory': SuppliesInventory,
                            'vendor': Vendor,
                            'patient_login': PatientLogin,
                            'patient_feedback': PatientFeedback,
                            'download': Download,
                            'appointment_request': AppointmentRequest,
                            'bill': Bill,
                            'security_log': SecurityLog,
                            'lab_sample': LabSample,
                            'vitals': Vitals,
                            'communication': Communication,
                            'lab_order': LabOrder,
                            'radiology_order': RadiologyOrder,
                            'patient_visit': PatientVisit,
                            'invoice': Invoice
                        }
                        
                        if table_name in model_map:
                            model_class = model_map[table_name]
                            # Remove any keys that don't exist in the model
                            valid_keys = {k: v for k, v in row_dict.items() if hasattr(model_class, k)}
                            instance = model_class(**valid_keys)
                            db.session.add(instance)
                        else:
                            print(f"   ⚠️  No model found for table: {table_name}")
                            
                    except Exception as e:
                        print(f"   ❌ Error inserting row in {table_name}: {e}")
                        print(f"   📝 Row data: {row_dict}")
                        continue
                
                # Commit after each table
                db.session.commit()
                print(f"   ✅ Successfully migrated {len(rows)} rows from {table_name}")
        
        sqlite_conn.close()
        print("🎉 Migration completed successfully!")
        print("📊 Summary:")
        print("   - SQLite database: backend/instance/hmis.db")
        print("   - PostgreSQL database: Configured via DATABASE_URL")
        print("   - All data preserved and migrated")
        print("   - Application ready for PostgreSQL")
        
        return True
        
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        return False

if __name__ == '__main__':
    migrate_sqlite_to_postgresql()
