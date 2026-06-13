-- Lead admin fields: status, notes, updated_at
CREATE TYPE lead_status AS ENUM ('nuevo', 'contactado', 'cerrado', 'descartado');

ALTER TABLE leads
  ADD COLUMN status lead_status NOT NULL DEFAULT 'nuevo',
  ADD COLUMN admin_notes TEXT NOT NULL DEFAULT '',
  ADD COLUMN updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_leads_status ON leads(status);

-- Admin can update lead status and notes
CREATE POLICY "Admin update leads"
  ON leads FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());
