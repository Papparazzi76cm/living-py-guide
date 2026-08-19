import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  DollarSign,
  KanbanSquare,
  ListTodo,
  Loader2,
  LogOut,
  MessageSquarePlus,
  Plus,
  RefreshCw,
  ShieldCheck,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import { format, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';
import { crmSupabase } from '@/integrations/supabase/crm';
import { supabase } from '@/integrations/supabase/client';
import { BrandLockup } from '@/components/brand/BrandLockup';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import type {
  CrmActivity,
  CrmActivityType,
  CrmAssignmentStatus,
  CrmDelegationUser,
  CrmLead,
  CrmLeadAssignment,
  CrmMembership,
  CrmPartnerAccount,
  CrmPriority,
  CrmTask,
} from '@/types/crm';

interface PartnerApplicationRow {
  id: string;
  company: string;
  name: string;
  email: string;
  category_name: string;
  membership_tier?: string | null;
  zone_name?: string | null;
  market_slug?: string | null;
  status: string;
  created_at: string;
}

const ASSIGNMENT_LABELS: Record<CrmAssignmentStatus, string> = {
  assigned: 'Asignado',
  accepted: 'Aceptado',
  contacted: 'Contactado',
  proposal: 'Propuesta',
  won: 'Ganado',
  lost: 'Perdido',
  declined: 'Rechazado',
};

const PIPELINE_GROUPS: { key: CrmAssignmentStatus; label: string }[] = [
  { key: 'assigned', label: 'Nuevos' },
  { key: 'contacted', label: 'En contacto' },
  { key: 'proposal', label: 'Propuesta' },
  { key: 'won', label: 'Ganados' },
];

const priorityClass: Record<CrmPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  normal: 'bg-secondary/10 text-secondary',
  high: 'bg-clay-soft text-clay',
  urgent: 'bg-destructive/10 text-destructive',
};

const currency = (value: number, code = 'USD') => new Intl.NumberFormat('es-ES', {
  style: 'currency', currency: code, maximumFractionDigits: 0,
}).format(value || 0);

const CrmDashboardPage = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [partners, setPartners] = useState<CrmPartnerAccount[]>([]);
  const [delegationUsers, setDelegationUsers] = useState<CrmDelegationUser[]>([]);
  const [memberships, setMemberships] = useState<CrmMembership[]>([]);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [assignments, setAssignments] = useState<CrmLeadAssignment[]>([]);
  const [tasks, setTasks] = useState<CrmTask[]>([]);
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [applications, setApplications] = useState<PartnerApplicationRow[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [leadDialogOpen, setLeadDialogOpen] = useState(false);
  const [newLeadOpen, setNewLeadOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);

    if (!isAdmin) {
      await crmSupabase.rpc('crm_claim_partner_access');
    }

    const [partnerRes, delegationRes, membershipRes, leadRes, assignmentRes, taskRes, activityRes, applicationRes] = await Promise.all([
      crmSupabase.from('crm_partner_accounts').select('*').order('company'),
      crmSupabase.from('crm_delegation_users').select('*').eq('user_id', user.id),
      crmSupabase.from('crm_memberships').select('*').order('starts_at', { ascending: false }),
      crmSupabase.from('crm_leads').select('*').order('created_at', { ascending: false }),
      crmSupabase.from('crm_lead_assignments').select('*').order('assigned_at', { ascending: false }),
      crmSupabase.from('crm_tasks').select('*').order('due_at'),
      crmSupabase.from('crm_activities').select('*').order('occurred_at', { ascending: false }).limit(300),
      supabase.from('partner_applications').select('id,company,name,email,category_name,status,created_at').in('status', ['new', 'screening', 'waitlist', 'approved']).order('created_at', { ascending: false }).limit(100),
    ]);

    const errors = [partnerRes.error, delegationRes.error, membershipRes.error, leadRes.error, assignmentRes.error, taskRes.error, activityRes.error]
      .filter(Boolean);
    if (errors.length) {
      toast({ title: 'No se ha podido cargar todo el CRM', description: errors[0]?.message, variant: 'destructive' });
    }

    setPartners(partnerRes.data ?? []);
    setDelegationUsers(delegationRes.data ?? []);
    setMemberships(membershipRes.data ?? []);
    setLeads(leadRes.data ?? []);
    setAssignments(assignmentRes.data ?? []);
    setTasks(taskRes.data ?? []);
    setActivities(activityRes.data ?? []);
    setApplications((applicationRes.data as unknown as PartnerApplicationRow[] | null) ?? []);
    setLoading(false);
    setRefreshing(false);
  }, [isAdmin, toast, user]);

  useEffect(() => { void loadData(); }, [loadData]);

  const managerMode = isAdmin || delegationUsers.some((item) => item.active);
  const leadMap = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [leads]);
  const partnerMap = useMemo(() => new Map(partners.map((partner) => [partner.id, partner])), [partners]);
  const selectedAssignment = assignments.find((item) => item.id === selectedAssignmentId) ?? null;
  const selectedLead = selectedAssignment ? leadMap.get(selectedAssignment.lead_id) ?? null : null;

  const closedAssignments = assignments.filter((item) => ['won', 'lost', 'declined'].includes(item.status));
  const wonAssignments = assignments.filter((item) => item.status === 'won');
  const activeAssignments = assignments.filter((item) => !['won', 'lost', 'declined'].includes(item.status));
  const wonValue = wonAssignments.reduce((sum, item) => sum + Number(item.won_value || 0), 0);
  const membershipInvestment = memberships
    .filter((item) => item.status === 'active')
    .reduce((sum, item) => sum + Number(item.amount_usd || 0) + Number(item.exclusivity_amount_usd || 0), 0);
  const conversion = closedAssignments.length ? (wonAssignments.length / closedAssignments.length) * 100 : 0;
  const answered = assignments.filter((item) => item.first_response_at);
  const inSla = answered.filter((item) => item.first_response_at && new Date(item.first_response_at) <= new Date(item.response_due_at));
  const sla = answered.length ? (inSla.length / answered.length) * 100 : 100;
  const overdueTasks = tasks.filter((task) => task.status === 'pending' && isBefore(new Date(task.due_at), new Date()));
  const roi = membershipInvestment > 0 ? wonValue / membershipInvestment : null;

  const handleLogout = async () => {
    await signOut();
    navigate('/crm/login', { replace: true });
  };

  const updateAssignment = async (id: string, patch: Partial<CrmLeadAssignment>) => {
    const { error } = await crmSupabase.from('crm_lead_assignments').update(patch).eq('id', id);
    if (error) {
      toast({ title: 'No se pudo actualizar el lead', description: error.message, variant: 'destructive' });
      return false;
    }
    await loadData();
    return true;
  };

  const completeTask = async (task: CrmTask) => {
    const completed = task.status !== 'completed';
    const { error } = await crmSupabase.from('crm_tasks').update({
      status: completed ? 'completed' : 'pending',
      completed_at: completed ? new Date().toISOString() : null,
    }).eq('id', task.id);
    if (error) toast({ title: 'No se pudo actualizar la tarea', description: error.message, variant: 'destructive' });
    else await loadData();
  };

  const activateApplication = async (applicationId: string) => {
    const { error } = await crmSupabase.rpc('crm_activate_partner_application', { _application_id: applicationId });
    if (error) {
      toast({ title: 'No se pudo activar el partner', description: error.message, variant: 'destructive' });
      return;
    }
    toast({ title: 'Partner activado', description: 'Se ha creado su cuenta CRM, membresía y acceso reclamable por email.' });
    await loadData();
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!managerMode && partners.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-sand px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-lg sm:p-12">
          <BrandLockup variant="network" compact className="mx-auto" />
          <ShieldCheck className="mx-auto mt-8 h-12 w-12 text-primary" />
          <h1 className="mt-5 text-2xl font-black text-ink">Tu acceso todavía no está vinculado a un partner.</h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Si tu empresa ya fue admitida, entra con exactamente el mismo email usado en la candidatura. Si acabas de ser aprobada, vuelve a intentarlo cuando la delegación active tu cuenta.</p>
          <div className="mt-7 flex justify-center gap-3">
            <Button variant="outline" onClick={() => void loadData()}><RefreshCw className="mr-2 h-4 w-4" />Reintentar</Button>
            <Button variant="ghost" onClick={handleLogout}>Cerrar sesión</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <BrandLockup variant="network" compact />
            <div className="hidden border-l border-border pl-4 sm:block">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Partner CRM</p>
              <p className="text-xs text-muted-foreground">{managerMode ? 'Operación de delegación' : partners[0]?.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => void loadData()} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 sm:mr-2 ${refreshing ? 'animate-spin' : ''}`} /><span className="hidden sm:inline">Actualizar</span>
            </Button>
            {managerMode && <Button size="sm" onClick={() => setNewLeadOpen(true)}><Plus className="h-4 w-4 sm:mr-2" /><span className="hidden sm:inline">Asignar lead</span></Button>}
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Cerrar sesión"><LogOut className="h-4 w-4" /></Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-7 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">{managerMode ? 'Control de la red' : 'Tu negocio dentro de Living Business Club'}</p>
            <h1 className="mt-1 text-3xl font-black text-ink">{managerMode ? 'Centro de operaciones CRM' : `Hola, ${partners[0]?.primary_contact_name ?? 'Partner'}`}</h1>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">Trazabilidad completa desde la derivación hasta el cierre: respuesta, seguimiento, conversión, facturación y retorno.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          <Metric title="Leads activos" value={String(activeAssignments.length)} icon={Target} detail={`${assignments.length} totales`} />
          <Metric title="Conversión" value={`${conversion.toFixed(0)}%`} icon={BarChart3} detail={`${wonAssignments.length} ganados`} />
          <Metric title="Facturación atribuida" value={currency(wonValue)} icon={DollarSign} detail="negocio cerrado" />
          <Metric title="Respuesta en SLA" value={`${sla.toFixed(0)}%`} icon={Clock3} detail="objetivo: 24 h" />
          <Metric title="ROI directo" value={roi === null ? '—' : `${roi.toFixed(1)}×`} icon={BriefcaseBusiness} detail={membershipInvestment ? `${currency(membershipInvestment)} invertidos` : 'sin cuota activa'} />
          <Metric title="Tareas vencidas" value={String(overdueTasks.length)} icon={overdueTasks.length ? AlertTriangle : CheckCircle2} detail={overdueTasks.length ? 'requieren atención' : 'todo al día'} />
        </div>

        <Tabs defaultValue="pipeline" className="mt-8">
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-card p-1">
            <TabsTrigger value="pipeline"><KanbanSquare className="mr-2 h-4 w-4" />Pipeline</TabsTrigger>
            <TabsTrigger value="tasks"><ListTodo className="mr-2 h-4 w-4" />Tareas</TabsTrigger>
            {managerMode && <TabsTrigger value="partners"><Users className="mr-2 h-4 w-4" />Partners</TabsTrigger>}
            {managerMode && <TabsTrigger value="onboarding"><UserCheck className="mr-2 h-4 w-4" />Candidaturas</TabsTrigger>}
          </TabsList>

          <TabsContent value="pipeline" className="mt-5">
            <div className="grid gap-4 xl:grid-cols-4">
              {PIPELINE_GROUPS.map((group) => {
                const rows = assignments.filter((assignment) => assignment.status === group.key || (group.key === 'contacted' && assignment.status === 'accepted'));
                return (
                  <section key={group.key} className="rounded-2xl border border-border bg-card p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <h2 className="font-bold text-ink">{group.label}</h2><Badge variant="secondary">{rows.length}</Badge>
                    </div>
                    <div className="space-y-3">
                      {rows.length === 0 && <p className="rounded-xl bg-muted/50 p-4 text-center text-xs text-muted-foreground">Sin leads</p>}
                      {rows.map((assignment) => {
                        const lead = leadMap.get(assignment.lead_id);
                        const partner = partnerMap.get(assignment.partner_account_id);
                        if (!lead) return null;
                        const slaLate = !assignment.first_response_at && new Date() > new Date(assignment.response_due_at);
                        return (
                          <button
                            key={assignment.id}
                            type="button"
                            onClick={() => { setSelectedAssignmentId(assignment.id); setLeadDialogOpen(true); }}
                            className="w-full rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary/40 hover:shadow-sm"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold text-ink">{lead.contact_name}</p>
                              <span className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase ${priorityClass[lead.priority]}`}>{lead.priority}</span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{lead.need_summary}</p>
                            {managerMode && <p className="mt-3 text-[11px] font-semibold text-secondary">{partner?.company}</p>}
                            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>{lead.category_name}</span>
                              <span className={slaLate ? 'font-semibold text-destructive' : ''}>{slaLate ? 'SLA vencido' : format(new Date(assignment.assigned_at), 'dd MMM', { locale: es })}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
            {assignments.some((assignment) => ['lost', 'declined'].includes(assignment.status)) && (
              <Card className="mt-5">
                <CardHeader><CardTitle className="text-base">Cerrados sin venta</CardTitle><CardDescription>Aprendizaje comercial: motivo de pérdida y tendencias.</CardDescription></CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {assignments.filter((assignment) => ['lost', 'declined'].includes(assignment.status)).slice(0, 9).map((assignment) => {
                    const lead = leadMap.get(assignment.lead_id);
                    return <button key={assignment.id} onClick={() => { setSelectedAssignmentId(assignment.id); setLeadDialogOpen(true); }} className="rounded-xl border p-4 text-left"><p className="font-semibold text-ink">{lead?.contact_name}</p><p className="mt-1 text-xs text-muted-foreground">{assignment.lost_reason || ASSIGNMENT_LABELS[assignment.status]}</p></button>;
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="mt-5">
            <Card>
              <CardHeader><CardTitle>Agenda operativa</CardTitle><CardDescription>Seguimientos y compromisos vinculados a cada lead.</CardDescription></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No hay tareas todavía.</p>}
                  {tasks.map((task) => {
                    const lead = task.lead_id ? leadMap.get(task.lead_id) : null;
                    const overdue = task.status === 'pending' && new Date(task.due_at) < new Date();
                    return (
                      <div key={task.id} className="flex items-start gap-3 rounded-xl border border-border bg-background p-4">
                        <button onClick={() => void completeTask(task)} className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${task.status === 'completed' ? 'border-secondary bg-secondary text-white' : 'border-border'}`} aria-label="Cambiar estado de tarea">{task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}</button>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><p className={`font-semibold ${task.status === 'completed' ? 'text-muted-foreground line-through' : 'text-ink'}`}>{task.title}</p>{overdue && <Badge variant="destructive">Vencida</Badge>}</div>
                          <p className="mt-1 text-xs text-muted-foreground">{lead?.contact_name ? `${lead.contact_name} · ` : ''}{format(new Date(task.due_at), "dd MMM · HH:mm", { locale: es })}</p>
                          {task.description && <p className="mt-2 text-sm text-muted-foreground">{task.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {managerMode && (
            <TabsContent value="partners" className="mt-5">
              <Card>
                <CardHeader><CardTitle>Red de partners</CardTitle><CardDescription>Estado, categoría, territorio, exclusividad y rendimiento de cada miembro.</CardDescription></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Delegación / zona</TableHead><TableHead>Rubro</TableHead><TableHead>Estado</TableHead><TableHead>Exclusividad</TableHead><TableHead>Leads</TableHead><TableHead>Conversión</TableHead><TableHead>Facturación</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {partners.map((partner) => {
                        const rows = assignments.filter((item) => item.partner_account_id === partner.id);
                        const closed = rows.filter((item) => ['won', 'lost', 'declined'].includes(item.status));
                        const won = rows.filter((item) => item.status === 'won');
                        return (
                          <TableRow key={partner.id}>
                            <TableCell><p className="font-semibold">{partner.company}</p><p className="text-xs text-muted-foreground">{partner.primary_contact_name}</p></TableCell>
                            <TableCell><p>{partner.market_slug}</p><p className="text-xs text-muted-foreground">{partner.zone_name}</p></TableCell>
                            <TableCell><Badge variant="outline">{partner.membership_tier}</Badge><span className="ml-2 text-xs">{partner.category_name}</span></TableCell>
                            <TableCell><Badge>{partner.status}</Badge></TableCell>
                            <TableCell>{partner.exclusivity_active ? <Badge className="bg-ink">Activa</Badge> : partner.exclusivity_requested ? <Badge variant="secondary">Solicitada</Badge> : <span className="text-xs text-muted-foreground">No</span>}</TableCell>
                            <TableCell>{rows.length}</TableCell>
                            <TableCell>{closed.length ? `${((won.length / closed.length) * 100).toFixed(0)}%` : '—'}</TableCell>
                            <TableCell>{currency(won.reduce((sum, item) => sum + Number(item.won_value || 0), 0))}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {managerMode && (
            <TabsContent value="onboarding" className="mt-5">
              <Card>
                <CardHeader><CardTitle>Candidaturas de partners</CardTitle><CardDescription>Convierte una candidatura cualificada en una cuenta CRM operativa. La capacidad del rubro y la exclusividad se validan también en base de datos.</CardDescription></CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow><TableHead>Empresa</TableHead><TableHead>Categoría</TableHead><TableHead>Zona</TableHead><TableHead>Estado</TableHead><TableHead>Fecha</TableHead><TableHead /></TableRow></TableHeader>
                    <TableBody>
                      {applications.map((application) => {
                        const active = partners.some((partner) => partner.application_id === application.id);
                        return (
                          <TableRow key={application.id}>
                            <TableCell><p className="font-semibold">{application.company}</p><p className="text-xs text-muted-foreground">{application.name} · {application.email}</p></TableCell>
                            <TableCell><Badge variant="outline">{application.membership_tier ?? 'Standard'}</Badge><span className="ml-2 text-xs">{application.category_name}</span></TableCell>
                            <TableCell>{application.zone_name ?? '—'}</TableCell>
                            <TableCell><Badge variant="secondary">{application.status}</Badge></TableCell>
                            <TableCell>{format(new Date(application.created_at), 'dd MMM yyyy', { locale: es })}</TableCell>
                            <TableCell className="text-right"><Button size="sm" variant={active ? 'outline' : 'default'} disabled={active} onClick={() => void activateApplication(application.id)}>{active ? 'Activado' : 'Activar CRM'}</Button></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </main>

      <NewLeadDialog open={newLeadOpen} onOpenChange={setNewLeadOpen} partners={partners.filter((partner) => ['trial', 'active'].includes(partner.status))} userId={user?.id ?? ''} onSaved={loadData} />
      <LeadDetailDialog open={leadDialogOpen} onOpenChange={setLeadDialogOpen} assignment={selectedAssignment} lead={selectedLead} partner={selectedAssignment ? partnerMap.get(selectedAssignment.partner_account_id) ?? null : null} activities={selectedLead ? activities.filter((item) => item.lead_id === selectedLead.id) : []} userId={user?.id ?? ''} onUpdate={updateAssignment} onSaved={loadData} />
    </div>
  );
};

const Metric = ({ title, value, detail, icon: Icon }: { title: string; value: string; detail: string; icon: typeof Target }) => (
  <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle><Icon className="h-4 w-4 text-primary" /></CardHeader><CardContent><p className="text-2xl font-black text-ink">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></CardContent></Card>
);

const NewLeadDialog = ({ open, onOpenChange, partners, userId, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; partners: CrmPartnerAccount[]; userId: string; onSaved: () => Promise<void> }) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [partnerId, setPartnerId] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [nationality, setNationality] = useState('');
  const [city, setCity] = useState('');
  const [source, setSource] = useState('community');
  const [need, setNeed] = useState('');
  const [priority, setPriority] = useState<CrmPriority>('normal');
  const [estimated, setEstimated] = useState('0');

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const partner = partners.find((item) => item.id === partnerId);
    if (!partner) return;
    setSaving(true);
    const { data: lead, error: leadError } = await crmSupabase.from('crm_leads').insert({
      market_slug: partner.market_slug,
      zone_slug: partner.zone_slug,
      category_slug: partner.category_slug,
      category_name: partner.category_name,
      contact_name: contactName.trim(),
      contact_email: email.trim() || null,
      contact_whatsapp: whatsapp.trim() || null,
      nationality: nationality.trim() || null,
      city: city.trim() || null,
      source,
      need_summary: need.trim(),
      priority,
      estimated_value: Number(estimated) || 0,
      actual_value: 0,
      currency_code: 'USD',
      consent_privacy: true,
      created_by: userId,
      status: 'qualified',
    }).select('*').single();

    if (leadError || !lead) {
      setSaving(false);
      toast({ title: 'No se pudo crear el lead', description: leadError?.message, variant: 'destructive' });
      return;
    }

    const { error: assignmentError } = await crmSupabase.from('crm_lead_assignments').insert({
      lead_id: lead.id,
      partner_account_id: partner.id,
      assigned_by: userId,
      status: 'assigned',
      assigned_at: new Date().toISOString(),
      response_due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      estimated_value: Number(estimated) || 0,
      won_value: 0,
      currency_code: 'USD',
    });

    if (assignmentError) {
      await crmSupabase.from('crm_leads').delete().eq('id', lead.id);
      setSaving(false);
      toast({ title: 'No se pudo asignar el lead', description: assignmentError.message, variant: 'destructive' });
      return;
    }

    setSaving(false);
    toast({ title: 'Lead asignado', description: `${contactName} ha sido derivado a ${partner.company}. SLA de primera respuesta: 24 horas.` });
    setPartnerId(''); setContactName(''); setEmail(''); setWhatsapp(''); setNationality(''); setCity(''); setNeed(''); setEstimated('0'); setPriority('normal');
    onOpenChange(false);
    await onSaved();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>Asignar nuevo lead</DialogTitle><DialogDescription>La ficha queda aislada por delegación y solo será visible para el partner asignado y sus gestores autorizados.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <Field label="Partner / rubro" className="sm:col-span-2"><select required className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={partnerId} onChange={(event) => setPartnerId(event.target.value)}><option value="">Selecciona partner</option>{partners.map((partner) => <option key={partner.id} value={partner.id}>{partner.company} · {partner.category_name} · {partner.zone_name}</option>)}</select></Field>
          <Field label="Nombre"><Input required value={contactName} onChange={(event) => setContactName(event.target.value)} /></Field>
          <Field label="WhatsApp"><Input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></Field>
          <Field label="Nacionalidad"><Input value={nationality} onChange={(event) => setNationality(event.target.value)} /></Field>
          <Field label="Ciudad"><Input value={city} onChange={(event) => setCity(event.target.value)} /></Field>
          <Field label="Origen"><select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={source} onChange={(event) => setSource(event.target.value)}><option value="community">Comunidad</option><option value="contact">Contacto web</option><option value="event">Evento</option><option value="referral">Recomendación</option><option value="manual">Manual</option></select></Field>
          <Field label="Prioridad"><select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={priority} onChange={(event) => setPriority(event.target.value as CrmPriority)}><option value="low">Baja</option><option value="normal">Normal</option><option value="high">Alta</option><option value="urgent">Urgente</option></select></Field>
          <Field label="Valor estimado (USD)"><Input type="number" min="0" value={estimated} onChange={(event) => setEstimated(event.target.value)} /></Field>
          <Field label="Necesidad / contexto" className="sm:col-span-2"><Textarea required rows={4} value={need} onChange={(event) => setNeed(event.target.value)} placeholder="Qué necesita, plazo, contexto familiar/empresarial y cualquier dato útil para que el partner llegue preparado." /></Field>
          <div className="sm:col-span-2 flex justify-end"><Button type="submit" disabled={saving || partners.length === 0}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Asignar lead</Button></div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const LeadDetailDialog = ({ open, onOpenChange, assignment, lead, partner, activities, userId, onUpdate, onSaved }: { open: boolean; onOpenChange: (open: boolean) => void; assignment: CrmLeadAssignment | null; lead: CrmLead | null; partner: CrmPartnerAccount | null; activities: CrmActivity[]; userId: string; onUpdate: (id: string, patch: Partial<CrmLeadAssignment>) => Promise<boolean>; onSaved: () => Promise<void> }) => {
  const { toast } = useToast();
  const [status, setStatus] = useState<CrmAssignmentStatus>('assigned');
  const [wonValue, setWonValue] = useState('0');
  const [lostReason, setLostReason] = useState('');
  const [activityType, setActivityType] = useState<CrmActivityType>('whatsapp');
  const [activityBody, setActivityBody] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDue, setTaskDue] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!assignment) return;
    setStatus(assignment.status);
    setWonValue(String(assignment.won_value || 0));
    setLostReason(assignment.lost_reason || '');
  }, [assignment]);

  if (!assignment || !lead || !partner) return null;

  const saveStatus = async () => {
    setSaving(true);
    const closed = ['won', 'lost', 'declined'].includes(status);
    const ok = await onUpdate(assignment.id, {
      status,
      won_value: status === 'won' ? Number(wonValue) || 0 : 0,
      lost_reason: ['lost', 'declined'].includes(status) ? lostReason.trim() || null : null,
      closed_at: closed ? new Date().toISOString() : null,
    });
    setSaving(false);
    if (ok) toast({ title: 'Estado actualizado' });
  };

  const addActivity = async (event: FormEvent) => {
    event.preventDefault();
    if (!activityBody.trim()) return;
    const { error } = await crmSupabase.from('crm_activities').insert({
      lead_id: lead.id,
      assignment_id: assignment.id,
      partner_account_id: partner.id,
      actor_user_id: userId,
      activity_type: activityType,
      body: activityBody.trim(),
      occurred_at: new Date().toISOString(),
      next_action_at: nextAction ? new Date(nextAction).toISOString() : null,
    });
    if (error) toast({ title: 'No se pudo registrar la actividad', description: error.message, variant: 'destructive' });
    else {
      setActivityBody(''); setNextAction('');
      toast({ title: 'Actividad registrada', description: 'El SLA y el último contacto se actualizarán automáticamente.' });
      await onSaved();
    }
  };

  const addTask = async (event: FormEvent) => {
    event.preventDefault();
    if (!taskTitle.trim() || !taskDue) return;
    const { error } = await crmSupabase.from('crm_tasks').insert({
      lead_id: lead.id,
      assignment_id: assignment.id,
      partner_account_id: partner.id,
      owner_user_id: userId,
      title: taskTitle.trim(),
      due_at: new Date(taskDue).toISOString(),
      priority: lead.priority,
      status: 'pending',
    });
    if (error) toast({ title: 'No se pudo crear la tarea', description: error.message, variant: 'destructive' });
    else { setTaskTitle(''); setTaskDue(''); toast({ title: 'Tarea creada' }); await onSaved(); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader><DialogTitle>{lead.contact_name}</DialogTitle><DialogDescription>{lead.category_name} · {partner.company} · {partner.zone_name}</DialogDescription></DialogHeader>
        <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <div className="space-y-5">
            <Card><CardHeader><CardTitle className="text-base">Ficha del lead</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p className="leading-relaxed text-muted-foreground">{lead.need_summary}</p><div className="grid gap-2 sm:grid-cols-2"><p><strong>WhatsApp:</strong> {lead.contact_whatsapp || '—'}</p><p><strong>Email:</strong> {lead.contact_email || '—'}</p><p><strong>Nacionalidad:</strong> {lead.nationality || '—'}</p><p><strong>Origen:</strong> {lead.source}</p></div></CardContent></Card>

            <Card><CardHeader><CardTitle className="text-base">Pipeline y resultado</CardTitle></CardHeader><CardContent className="space-y-4"><Field label="Estado"><select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={status} onChange={(event) => setStatus(event.target.value as CrmAssignmentStatus)}>{Object.entries(ASSIGNMENT_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field>{status === 'won' && <Field label="Facturación atribuida"><Input type="number" min="0" value={wonValue} onChange={(event) => setWonValue(event.target.value)} /></Field>}{['lost', 'declined'].includes(status) && <Field label="Motivo de pérdida"><Textarea value={lostReason} onChange={(event) => setLostReason(event.target.value)} /></Field>}<Button onClick={() => void saveStatus()} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Guardar estado</Button></CardContent></Card>

            <Card><CardHeader><CardTitle className="text-base">Registrar actividad</CardTitle><CardDescription>Llamadas, WhatsApp, emails, reuniones, notas y propuestas construyen el historial y actualizan métricas.</CardDescription></CardHeader><CardContent><form onSubmit={addActivity} className="space-y-3"><div className="grid gap-3 sm:grid-cols-2"><Field label="Tipo"><select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={activityType} onChange={(event) => setActivityType(event.target.value as CrmActivityType)}><option value="whatsapp">WhatsApp</option><option value="call">Llamada</option><option value="email">Email</option><option value="meeting">Reunión</option><option value="proposal">Propuesta</option><option value="note">Nota</option></select></Field><Field label="Próxima acción"><Input type="datetime-local" value={nextAction} onChange={(event) => setNextAction(event.target.value)} /></Field></div><Textarea required value={activityBody} onChange={(event) => setActivityBody(event.target.value)} placeholder="Qué ocurrió, objeciones, acuerdos y siguiente paso." /><Button type="submit" variant="secondary"><MessageSquarePlus className="mr-2 h-4 w-4" />Registrar actividad</Button></form></CardContent></Card>
          </div>

          <div className="space-y-5">
            <Card><CardHeader><CardTitle className="text-base">Crear seguimiento</CardTitle></CardHeader><CardContent><form onSubmit={addTask} className="space-y-3"><Field label="Tarea"><Input required value={taskTitle} onChange={(event) => setTaskTitle(event.target.value)} placeholder="Llamar después de enviar propuesta" /></Field><Field label="Fecha y hora"><Input required type="datetime-local" value={taskDue} onChange={(event) => setTaskDue(event.target.value)} /></Field><Button type="submit" variant="outline"><ListTodo className="mr-2 h-4 w-4" />Añadir tarea</Button></form></CardContent></Card>

            <Card><CardHeader><CardTitle className="text-base">Historial</CardTitle><CardDescription>{activities.length} actividades registradas.</CardDescription></CardHeader><CardContent><div className="space-y-4">{activities.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Todavía no hay actividad.</p>}{activities.map((activity) => <div key={activity.id} className="relative border-l-2 border-primary/20 pl-4"><div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" /><div className="flex items-center justify-between gap-2"><Badge variant="outline">{activity.activity_type}</Badge><span className="text-[11px] text-muted-foreground">{format(new Date(activity.occurred_at), 'dd MMM · HH:mm', { locale: es })}</span></div><p className="mt-2 text-sm leading-relaxed text-ink-soft">{activity.body}</p></div>)}</div></CardContent></Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) => <div className={className}><Label className="mb-1.5 block">{label}</Label>{children}</div>;

export default CrmDashboardPage;
