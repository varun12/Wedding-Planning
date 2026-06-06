
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by all authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Weddings table
CREATE TABLE public.weddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  partner1_name TEXT,
  partner2_name TEXT,
  wedding_date DATE,
  cultural_background JSONB DEFAULT '{}',
  total_budget NUMERIC DEFAULT 0,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weddings ENABLE ROW LEVEL SECURITY;

-- Wedding members (junction)
CREATE TYPE public.wedding_role AS ENUM ('planner', 'couple', 'parent');
CREATE TABLE public.wedding_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role wedding_role NOT NULL DEFAULT 'couple',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(wedding_id, user_id)
);
ALTER TABLE public.wedding_members ENABLE ROW LEVEL SECURITY;

-- Helper function: check if user is member of a wedding
CREATE OR REPLACE FUNCTION public.is_wedding_member(_user_id UUID, _wedding_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.wedding_members
    WHERE user_id = _user_id AND wedding_id = _wedding_id
  )
$$;

-- RLS for weddings
CREATE POLICY "Members can view their weddings" ON public.weddings FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), id));
CREATE POLICY "Authenticated users can create weddings" ON public.weddings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Members can update their weddings" ON public.weddings FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), id));

-- RLS for wedding_members
CREATE POLICY "Members can view wedding members" ON public.wedding_members FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can add to their weddings" ON public.wedding_members FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id) OR auth.uid() = user_id);
CREATE POLICY "Members can remove from their weddings" ON public.wedding_members FOR DELETE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  venue TEXT,
  guest_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'planning',
  sort_order INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view events" ON public.events FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create events" ON public.events FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update events" ON public.events FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can delete events" ON public.events FOR DELETE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'shortlisted',
  email TEXT,
  phone TEXT,
  location TEXT,
  website TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view vendors" ON public.vendors FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create vendors" ON public.vendors FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update vendors" ON public.vendors FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can delete vendors" ON public.vendors FOR DELETE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Contracts table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_url TEXT,
  analysis JSONB,
  risk_score TEXT,
  status TEXT DEFAULT 'uploaded',
  signed_at TIMESTAMPTZ,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view contracts" ON public.contracts FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create contracts" ON public.contracts FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update contracts" ON public.contracts FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Obligations table
CREATE TABLE public.obligations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  due_date DATE NOT NULL,
  amount NUMERIC,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.obligations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view obligations" ON public.obligations FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create obligations" ON public.obligations FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update obligations" ON public.obligations FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Budget items table
CREATE TABLE public.budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  description TEXT,
  allocated NUMERIC DEFAULT 0,
  spent NUMERIC DEFAULT 0,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view budget" ON public.budget_items FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create budget items" ON public.budget_items FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update budget items" ON public.budget_items FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can delete budget items" ON public.budget_items FOR DELETE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Guests table
CREATE TABLE public.guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  side TEXT DEFAULT 'mutual',
  relationship TEXT,
  event_tags TEXT[] DEFAULT '{}',
  rsvp_status TEXT DEFAULT 'pending',
  dietary_notes TEXT,
  plus_one BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view guests" ON public.guests FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create guests" ON public.guests FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update guests" ON public.guests FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can delete guests" ON public.guests FOR DELETE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Outreach messages table
CREATE TABLE public.outreach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wedding_id UUID NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  response_status TEXT DEFAULT 'pending',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.outreach_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can view outreach" ON public.outreach_messages FOR SELECT TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can create outreach" ON public.outreach_messages FOR INSERT TO authenticated
  WITH CHECK (public.is_wedding_member(auth.uid(), wedding_id));
CREATE POLICY "Members can update outreach" ON public.outreach_messages FOR UPDATE TO authenticated
  USING (public.is_wedding_member(auth.uid(), wedding_id));

-- Style profiles table
CREATE TABLE public.style_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  tone TEXT DEFAULT 'professional',
  sample_emails TEXT[] DEFAULT '{}',
  vocabulary_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.style_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own style profile" ON public.style_profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users can create own style profile" ON public.style_profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own style profile" ON public.style_profiles FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Timestamp update trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_weddings_updated_at BEFORE UPDATE ON public.weddings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_vendors_updated_at BEFORE UPDATE ON public.vendors FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_budget_items_updated_at BEFORE UPDATE ON public.budget_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_guests_updated_at BEFORE UPDATE ON public.guests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_outreach_updated_at BEFORE UPDATE ON public.outreach_messages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_style_profiles_updated_at BEFORE UPDATE ON public.style_profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-add creator as wedding member
CREATE OR REPLACE FUNCTION public.handle_new_wedding()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wedding_members (wedding_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 
    CASE WHEN (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = NEW.created_by) = 'planner'
      THEN 'planner'::wedding_role
      ELSE 'couple'::wedding_role
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_wedding_created
  AFTER INSERT ON public.weddings
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_wedding();
