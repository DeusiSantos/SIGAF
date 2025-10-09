import { Award, BarChart2, Briefcase, Calendar, Database, DollarSign, FileSearch, FileText, HelpCircle, Home, List, Plus, Settings, Users } from 'lucide-react';
import AddHistoricoProducao from '../modules/Agricola/public/AddHistoricoProducao';

// Configuração das rotas e menus
const routes = {
  mainMenuItems: [
    {
      icon: Home,
      text: 'Início',
      path: '/',
      submenu: false
    },
    {
      icon: BarChart2,
      text: 'Dashboard',
      path: '/dashboard',
      submenu: true
    },
    {
      icon: Users,
      text: 'Gestores',
      path: '/gestores',
      submenu: true
    },
    {
      icon: FileText,
      text: 'Núcleo',
      path: '/nucleo',
      submenu: true
    },
    {
      icon: FileText,
      text: 'Agrupamento',
      path: '/agrupamento',
      submenu: true
    },
    {
      icon: Users,
      text: 'Escuteiros',
      path: '/escuteiros',
      submenu: true
    },
    {
      icon: Users,
      text: 'Profissional',
      path: '/profissional',
      submenu: true
    },
    {
      icon: FileText,
      text: 'Atividades',
      path: '/atividades',
      submenu: true
    },
    {
      icon: Calendar,
      text: 'Eventos',
      path: '/eventos',
      submenu: true
    },
    {
      icon: Settings,
      text: 'Configurações',
      path: '/configuracoes',
      submenu: true
    },
    {
      icon: HelpCircle,
      text: 'Ajuda',
      path: '/ajuda',
      submenu: false
    }
  ],
  subMenus: {
    Dashboard: [
      {
        icon: BarChart2,
        text: 'Estatísticas',
        path: '/dashboard/estatisticas'
      },
      {
        icon: DollarSign,
        text: 'Financeiro',
        path: '/dashboard/financeiro'
      },
      {
        icon: FileSearch,
        text: 'Relatórios',
        path: '/dashboard/relatorios'
      },
      {
        icon: Database,
        text: 'Dados Gerais',
        path: '/dashboard/dados'
      }
    ],
    Gestores: [
      {
        icon: Plus,
        text: 'Novo Gestor',
        path: '/gestores/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/gestores/gestao'
      }
    ],
    Núcleo: [
      {
        icon: Plus,
        text: 'Novo Núcleo',
        path: '/nucleo/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/nucleo/gestao'
      },
      {
        icon: Plus,
        text: 'Add Agrupamento',
        path: '/nucleo/add'
      }
    ],
    Agrupamento: [
      {
        icon: Plus,
        text: 'Novo Agrupamento',
        path: '/agrupamento/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/agrupamento/gestao'
      }
    ],
    Escuteiros: [
      {
        icon: Plus,
        text: 'Novo Escuteiro',
        path: '/escuteiros/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/escuteiros/gestao'
      },
      {
        icon: Award,
        text: 'Promoção',
        path: '/escuteiros/promocao'
      },
    ],
    Profissional: [
      {
        icon: Plus,
        text: 'Novo Profissional',
        path: '/profissional/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/profissional/gestao'
      }
    ],
    Atividades: [
      {
        icon: Plus,
        text: 'Nova Atividade',
        path: '/atividades/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/atividades/gestao'
      }
    ],
    Eventos: [
      {
        icon: Plus,
        text: 'Novo Evento',
        path: '/eventos/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/eventos/gestao'
      },
      {
        icon: Calendar,
        text: 'Calendário',
        path: '/eventos/calendario'
      }
    ],
    Configurações: [
      {
        icon: Users,
        text: 'Perfil',
        path: '/configuracoes/perfil'
      },
      {
        icon: Briefcase,
        text: 'Conta',
        path: '/configuracoes/conta'
      },
      {
        icon: Users,
        text: 'Usuários',
        path: '/configuracoes/usuarios'
      },
      {
        icon: Settings,
        text: 'Sistema',
        path: '/configuracoes/sistema'
      }
    ],
    'Produtores': [
      {
        icon: Plus,
        text: 'Novo Produtor',
        path: '/produtores/novo'
      },
      {
        icon: List,
        text: 'Gestão',
        path: '/produtores/gestao'
      },
      {
        icon: AddHistoricoProducao,
        text: 'Histórico de Produção',
        path: '/produtores/historico-producao/:id/novo'
      }
    ]
  }
};

export default routes;