-- Aura Crackers retail billing (desktop) — same Supabase project as website
-- Prefix billing_* to avoid clashing with storefront tables.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS billing_financial_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  financial_year_id UUID NOT NULL REFERENCES billing_financial_years(id),
  product_code TEXT NOT NULL,
  barcode TEXT,
  product_name TEXT NOT NULL,
  category_id UUID REFERENCES billing_categories(id),
  brand_id UUID REFERENCES billing_brands(id),
  purchase_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  sales_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  sales_price_2 NUMERIC(12,2),
  rate_per_box NUMERIC(12,2),
  unit TEXT NOT NULL DEFAULT 'PIECE',
  box_quantity INTEGER NOT NULL DEFAULT 1,
  product_type TEXT NOT NULL DEFAULT 'BRANDED',
  default_discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  opening_stock NUMERIC(12,3) NOT NULL DEFAULT 0,
  current_stock NUMERIC(12,3) NOT NULL DEFAULT 0,
  minimum_stock NUMERIC(12,3) NOT NULL DEFAULT 0,
  gst_rate NUMERIC(5,2) NOT NULL DEFAULT 0,
  hsn_code TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  website_product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (financial_year_id, product_code)
);

CREATE TABLE IF NOT EXISTS billing_customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_code TEXT,
  name TEXT NOT NULL,
  company_name TEXT,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  gstin TEXT,
  opening_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  credit_limit NUMERIC(12,2),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  address_line_1 TEXT,
  address_line_2 TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  phone TEXT,
  email TEXT,
  opening_balance NUMERIC(12,2) NOT NULL DEFAULT 0,
  gstin TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  gstin TEXT,
  address TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_estimates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_number TEXT NOT NULL,
  financial_year_id UUID NOT NULL REFERENCES billing_financial_years(id),
  customer_id UUID REFERENCES billing_customers(id),
  agent_id UUID REFERENCES billing_agents(id),
  estimate_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (financial_year_id, estimate_number)
);

CREATE TABLE IF NOT EXISTS billing_estimate_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  estimate_id UUID NOT NULL REFERENCES billing_estimates(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES billing_products(id),
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL DEFAULT 0,
  number_of_boxes NUMERIC(12,3) NOT NULL DEFAULT 0,
  rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_sales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_number TEXT NOT NULL,
  financial_year_id UUID NOT NULL REFERENCES billing_financial_years(id),
  estimate_id UUID REFERENCES billing_estimates(id),
  customer_id UUID REFERENCES billing_customers(id),
  agent_id UUID REFERENCES billing_agents(id),
  sale_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_status TEXT NOT NULL DEFAULT 'UNPAID',
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (financial_year_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS billing_sale_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES billing_sales(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES billing_products(id),
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity NUMERIC(12,3) NOT NULL DEFAULT 0,
  number_of_boxes NUMERIC(12,3) NOT NULL DEFAULT 0,
  rate NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  final_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sale_id UUID NOT NULL REFERENCES billing_sales(id) ON DELETE CASCADE,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(12,2) NOT NULL,
  payment_mode TEXT NOT NULL DEFAULT 'CASH',
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES billing_products(id),
  transaction_type TEXT NOT NULL,
  reference_type TEXT,
  reference_id UUID,
  quantity NUMERIC(12,3) NOT NULL,
  previous_stock NUMERIC(12,3) NOT NULL,
  new_stock NUMERIC(12,3) NOT NULL,
  remarks TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_number TEXT NOT NULL UNIQUE,
  supplier_id UUID REFERENCES billing_suppliers(id),
  purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  grand_total NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS billing_purchase_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id UUID NOT NULL REFERENCES billing_purchases(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES billing_products(id),
  quantity NUMERIC(12,3) NOT NULL,
  rate NUMERIC(12,2) NOT NULL,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS billing_document_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  financial_year_id UUID NOT NULL REFERENCES billing_financial_years(id),
  doc_type TEXT NOT NULL,
  last_number INTEGER NOT NULL DEFAULT 0,
  UNIQUE (financial_year_id, doc_type)
);

CREATE INDEX IF NOT EXISTS idx_billing_products_fy ON billing_products(financial_year_id);
CREATE INDEX IF NOT EXISTS idx_billing_products_code ON billing_products(product_code);
CREATE INDEX IF NOT EXISTS idx_billing_inventory_product ON billing_inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_billing_sales_date ON billing_sales(sale_date);

ALTER TABLE billing_financial_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_sales ENABLE ROW LEVEL SECURITY;

-- Admins (website is_admin) can manage billing tables
CREATE POLICY billing_admin_all_fy ON billing_financial_years FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()));

CREATE POLICY billing_admin_all_products ON billing_products FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()));

CREATE POLICY billing_admin_all_estimates ON billing_estimates FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()));

CREATE POLICY billing_admin_all_sales ON billing_sales FOR ALL
  USING (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM admin_users au WHERE au.auth_user_id = auth.uid()));
