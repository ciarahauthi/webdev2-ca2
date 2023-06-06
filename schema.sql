DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts
(
    account_id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_name TEXT NOT NULL,
    account_password TEXT NOT NULL,
    is_admin DEFAULT 0
);

DROP TABLE IF EXISTS saves;
CREATE TABLE saves
(
    save_id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    save_data TEXT NOT NULL
);