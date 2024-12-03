-- Creazione del database
CREATE DATABASE ticket_management;

-- Selezione del database 
USE ticket_management;

CREATE TABLE clienti (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico del cliente
    nome VARCHAR(100) NOT NULL,                 -- Nome del cliente
    email VARCHAR(100) NOT NULL UNIQUE,         -- Email del cliente (deve essere unica)
    partita_iva CHAR(11) NULL UNIQUE,              -- Partita IVA (11 cifre)
    cf CHAR(16) NOT NULL UNIQUE,  
    indirizzo VARCHAR(255) NOT NULL,            -- Indirizzo del cliente
    telefono VARCHAR(15) NOT NULL UNIQUE              -- Numero di telefono del cliente
);


-- Tabella admin (tecnici)
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico del tecnico
    nome VARCHAR(100) NOT NULL ,                 -- Nome del tecnico
    email VARCHAR(100) NOT NULL UNIQUE          -- Email del tecnico (deve essere unica)
);

INSERT INTO admin (nome, email) 
VALUES ('Admin Admin', 'admin.admin@admin.com');


-- Tabella utenti (per login generico)
CREATE TABLE utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico dell'utente
    username VARCHAR(100) NOT NULL UNIQUE,      -- Nome utente per l'accesso (deve essere unico)
    password VARCHAR(255) NOT NULL,             -- Password dell'utente
    amministratore boolean not null default false,
    last_access TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Ultimo accesso
    id_cliente INT NULL,                        -- Collegamento facoltativo al cliente
    id_admin INT NULL,                          -- Collegamento facoltativo al tecnico
    FOREIGN KEY (id_cliente) REFERENCES clienti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_admin) REFERENCES admin(id) ON DELETE CASCADE
);

INSERT INTO utenti (username, password, amministratore, id_admin) 
VALUES ('Admin', 'Admin', true , 1);


-- Tabella stati dei ticket
CREATE TABLE stato_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo dello stato
    stato VARCHAR(20) NOT NULL UNIQUE           -- Nome dello stato (es. Aperto, In Lavorazione, Chiuso)
);

-- Inserimento degli stati predefiniti
INSERT INTO stato_ticket (stato)
VALUES ('Aperto'), ('In Lavorazione'), ('Chiuso');

-- Tabella ticket
CREATE TABLE ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico del ticket
    id_cliente INT NOT NULL,                    -- Cliente che ha creato il ticket
    id_stato INT DEFAULT 1,                     -- Stato del ticket (di default Aperto)
    descrizione TEXT NOT NULL,                  -- Descrizione del problema
    data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data di creazione del ticket
    FOREIGN KEY (id_cliente) REFERENCES clienti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_stato) REFERENCES stato_ticket(id) ON DELETE RESTRICT
);

-- Tabella risoluzioni dei ticket
CREATE TABLE risoluzione_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico della risoluzione
    id_ticket INT NOT NULL UNIQUE,              -- Collegamento al ticket risolto
    id_tecnico INT NULL,                        -- Tecnico assegnato al ticket
    note TEXT,                                  -- Note di risoluzione
    data_risoluzione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data della risoluzione
    FOREIGN KEY (id_ticket) REFERENCES ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tecnico) REFERENCES admin(id) ON DELETE SET NULL
);

-- Tabella aggiornamenti dei ticket
CREATE TABLE aggiornamenti_ticket (
    id INT AUTO_INCREMENT PRIMARY KEY,          -- Identificativo unico dell'aggiornamento
    id_ticket INT NOT NULL,                     -- Ticket a cui si riferisce l'aggiornamento
    id_tecnico INT NULL,                        -- Tecnico che ha effettuato l'aggiornamento
    descrizione TEXT NOT NULL,                  -- Descrizione dell'aggiornamento
    data_aggiornamento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Data dell'aggiornamento
    FOREIGN KEY (id_ticket) REFERENCES ticket(id) ON DELETE CASCADE,
    FOREIGN KEY (id_tecnico) REFERENCES admin(id) ON DELETE SET NULL
);