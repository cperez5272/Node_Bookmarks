CREATE TABLE bookmarks_server (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT,
    url TEXT,
    description TEXT,
    rating TEXT
);