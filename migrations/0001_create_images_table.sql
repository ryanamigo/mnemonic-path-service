-- Migration number: 0001 	 2024-01-06T00:00:00.000Z
CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    -- EXIF data
    make TEXT,
    model TEXT,
    date_time_original TEXT,
    exposure_time TEXT,
    f_number REAL,
    iso_speed_ratings INTEGER,
    focal_length REAL,
    lens_model TEXT,
    -- Location data
    latitude REAL,
    longitude REAL,
    altitude REAL,
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);
