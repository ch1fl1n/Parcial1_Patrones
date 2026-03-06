-- Initial migration for Soacha Resilience Climate Urban (RCU) database
-- Run this script to set up the PostgreSQL schema for the project
-- Assumes PostGIS is installed for geospatial features

-- Enable PostGIS extension if available (optional, for spatial queries)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Communities table (e.g., El Danubio, La María)
CREATE TABLE IF NOT EXISTS communities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Zones table for geospatial areas
CREATE TABLE IF NOT EXISTS zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    risk_level VARCHAR(50) DEFAULT 'medium', -- low, medium, high
    geom GEOGRAPHY(POLYGON, 4326), -- PostGIS geography for spatial data (optional)
    metadata JSONB DEFAULT '{}', -- For additional attributes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Persons table for community members
CREATE TABLE IF NOT EXISTS persons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INTEGER,
    gender VARCHAR(50),
    zone_id INTEGER REFERENCES zones(id) ON DELETE SET NULL,
    contact_info JSONB DEFAULT '{}', -- Phone, email, etc.
    metadata JSONB DEFAULT '{}', -- AVCA/CRMC data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table for incidents/emergencies
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES zones(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL, -- flood, heatwave, etc.
    severity VARCHAR(50) DEFAULT 'moderate', -- minor, moderate, severe
    date TIMESTAMP NOT NULL,
    description TEXT,
    affected_people_count INTEGER DEFAULT 0,
    created_by VARCHAR(255), -- User or system
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for event-person relationships (who was linked/affected)
CREATE TABLE IF NOT EXISTS event_person (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    person_id INTEGER REFERENCES persons(id) ON DELETE CASCADE,
    role VARCHAR(100), -- affected, linked, volunteer, etc.
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, person_id, role)
);

-- Alerts table for preventive notifications
CREATE TABLE IF NOT EXISTS alerts (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES zones(id) ON DELETE CASCADE,
    trigger VARCHAR(255) NOT NULL, -- e.g., 'precipitation > 50mm', 'temperature > 35C'
    status VARCHAR(50) DEFAULT 'active', -- active, resolved, dismissed
    payload JSONB DEFAULT '{}', -- Additional data like thresholds, messages
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Observations table for sensor/data ingestion (AVCA, CRMC, IDEAM, etc.)
CREATE TABLE IF NOT EXISTS observations (
    id SERIAL PRIMARY KEY,
    zone_id INTEGER REFERENCES zones(id) ON DELETE CASCADE,
    source VARCHAR(255) NOT NULL, -- IDEAM, OpenWeather, AVCA, CRMC
    value_json JSONB NOT NULL, -- Flexible data storage
    recorded_at TIMESTAMP NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_zones_community ON zones(community_id);
CREATE INDEX IF NOT EXISTS idx_events_zone ON events(zone_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_alerts_zone ON alerts(zone_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_observations_zone ON observations(zone_id);
CREATE INDEX IF NOT EXISTS idx_observations_recorded_at ON observations(recorded_at);
CREATE INDEX IF NOT EXISTS idx_event_person_event ON event_person(event_id);
CREATE INDEX IF NOT EXISTS idx_event_person_person ON event_person(person_id);

-- Spatial index if PostGIS is enabled
-- CREATE INDEX IF NOT EXISTS idx_zones_geom ON zones USING GIST (geom);

-- Sample data insertion (optional, for testing)
-- INSERT INTO communities (name, description) VALUES ('El Danubio', 'High-risk flood area'), ('La María', 'Urban heat island zone');

-- Note: To enable PostGIS, run: CREATE EXTENSION postgis; in your database
-- For spatial queries, use ST_ functions like ST_Contains, ST_Buffer, etc.