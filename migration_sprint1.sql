-- Script de Migración Sprint 1: Reingeniería de la Base de Datos

-- 1. Tabla de dueños
CREATE TABLE IF NOT EXISTS owners (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT,
    email      TEXT
);

-- 2. Tabla de mascotas vinculada a dueño (HU-01 Criterio 2)
CREATE TABLE IF NOT EXISTS pets (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    species    TEXT,
    breed      TEXT,
    owner_id   INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES owners(id)
);

-- 3. Tabla de citas vinculada a mascota
CREATE TABLE IF NOT EXISTS appointments (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id           INTEGER NOT NULL,
    service          TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    status           TEXT DEFAULT 'Scheduled',
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);

-- Migración de datos existentes: Rex y Luna

INSERT INTO owners (name) VALUES ('Juan Pérez');
INSERT INTO owners (name) VALUES ('Maria García');

INSERT INTO pets (name, owner_id) VALUES ('Rex', 1);
INSERT INTO pets (name, owner_id) VALUES ('Luna', 2);

INSERT INTO appointments (pet_id, service, appointment_date)
VALUES (1, 'Corte de Pelo', '2026-02-25 10:00');

INSERT INTO appointments (pet_id, service, appointment_date)
VALUES (2, 'Baño y Limpieza', '2026-02-25 11:30');