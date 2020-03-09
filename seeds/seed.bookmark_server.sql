INSERT INTO bookmark_server (title, url, description)
VALUES
('first bookmark post','mario_page.org','This is a red bookmark that resembles mario'),
('second bookmark post','peach_page.org','This is a pink bookmark that resembles peach'),
('third bookmark post','toad_page.org','This is a blue bookmark that resembles toad'),
('fourth bookmark post','koopa_page.org','This is a orange bookmark that resembles koopa'),

-- psql -U dunder_mifflin -d bookmarks -f ./seeds/seed.bookmark_server.sql