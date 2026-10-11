CREATE TABLE IF NOT EXISTS complaints (
  id text PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS complaints_created_at_idx ON complaints (created_at DESC);
