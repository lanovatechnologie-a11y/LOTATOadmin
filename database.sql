-- Table terminaux
CREATE TABLE terminals (
    id SERIAL PRIMARY KEY,
    device_id VARCHAR(100) UNIQUE,
    name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'disconnected',
    sales DECIMAL DEFAULT 0,
    last_seen TIMESTAMP
);

-- Table tickets
CREATE TABLE tickets (
    id SERIAL PRIMARY KEY,
    ticket_number VARCHAR(50),
    device_id VARCHAR(100),
    bets JSONB,
    total DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table codes d'accès
CREATE TABLE access_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    type VARCHAR(20),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table gagnants
CREATE TABLE winners (
    id SERIAL PRIMARY KEY,
    draw VARCHAR(50),
    numbers VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Données initiales
INSERT INTO access_codes (code, type) VALUES 
('ADMIN123', 'admin'),
('CONTROL456', 'admin'),
('123456', 'agent'),
('lottery2024', 'agent');