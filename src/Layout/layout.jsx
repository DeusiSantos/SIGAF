import {
  Archive,
  Award,
  BarChart3,
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  Coffee,
  EyeOff,
  File,
  Gavel,
  Globe,
  Home,
  Landmark,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sprout,
  TestTube,
  Tractor,
  TreePine,
  TrendingUp,
  Users,
  Wheat,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Outlet, useLocation, useNavigate } from "react-router-dom";

import imagetop from "../assets/emblema.png";
import imagebottom from "../assets/imageB1.png";
import DashboardStats from "../core/components/DashboardStats";
import { useProdutores } from "../modules/Agricola/hooks/useRnpaData";

// Configuração dos menus reorganizada mantendo todas as rotas existentes
const rnpaRoutes = {
  mainMenuItems: [
    {
      text: "Dashboard",
      icon: BarChart3,
      path: "/GerenciaRNPA/dashboard",
      submenu: false,
    },
    {
      text: "Produtores Agrícolas",
      icon: Wheat,
      path: "/GerenciaRNPA/gestao-agricultores",
      submenu: true,
    },
    {
      text: "Produtores Florestais",
      icon: TreePine,
      path: "/GerenciaRNPA/gestao-florestal",
      submenu: true,
    },
    {
      text: "Produtores de Café",
      icon: Coffee,
      path: "/GerenciaRNPA/gestao-de-cafe",
      submenu: true,
    },

    // {
    //   text: 'Entidades Associativas',
    //   icon: Building2,
    //   path: '/GerenciaRNPA/entidades-associativas',
    //   submenu: true
    // },
    // {
    //   text: 'Programas e Benefícios',
    //   icon: Award,
    //   path: '/GerenciaRNPA/programas-beneficios',
    //   submenu: true
    // }
  ],

  subMenus: {
    "Produtores Agrícolas": [
      {
        text: "Produtores",
        icon: Users,
        path: "/GerenciaRNPA/gestao-agricultores/produtores",
        hasDropdown: true,
        dropdownItems: [
          {
            text: "Pessoal",
            path: "/GerenciaRNPA/gestao-agricultores/produtores/pessoal",
          },
          {
            text: "Empresa",
            path: "/GerenciaRNPA/gestao-agricultores/produtores/empresa",
          },
          {
            text: "Cooperativa",
            path: "/GerenciaRNPA/gestao-agricultores/produtores/cooperativa",
          },
          {
            text: "Associação",
            path: "/GerenciaRNPA/gestao-agricultores/produtores/associacao",
          },
        ],
      },
      {
        text: "Infraestrutura",
        icon: Sprout,
        path: "/GerenciaRNPA/gestao-florestal/produtoresFlorestais",
        hasDropdown: true,
        dropdownItems: [
          {
            text: "Irrigação",
            icon: Sprout,
            path: "/GerenciaRNPA/gestao-agricultores/produtores/irrigacao",
          },
          {
            text: "Silos e Centro de Armazenamento",
            icon: Archive,
            path: "/GerenciaRNPA/gestao-agricultores/produtores/silos-armazenamento",
          },
          {
            text: "Entrepostos e Mercado",
            icon: Building2,
            path: "/GerenciaRNPA/gestao-agricultores/produtores/entrepostosMercado",
          },
          {
            text: "Infraestrutura Apoio Agrícola",
            icon: Tractor,
            path: "/GerenciaRNPA/gestao-agricultores/produtores/infraestrutura-agricola",
          },
          {
            text: "Empresas de Apoio Agrícola",
            icon: Tractor,
            path: "/GerenciaRNPA/gestao-agricultores/produtores/apoio-agricola",
          },
        ],
      },
      {
        text: "Painel e Monitoramento",
        icon: TrendingUp,
        path: "/GerenciaRNPA/painel-monitoramento",
        hasDropdown: true,
        dropdownItems: [
          {
            text: "Controle de Pragas",
            icon: ShieldAlert,
            path: "/GerenciaRNPA/painel-monitoramento/indicadores",
          },
          {
            text: "Meteorologia",
            icon: Globe,
            path: "/GerenciaRNPA/painel-monitoramento/meteorologia",
          },
          {
            text: "Hidrografia",
            icon: MapPin,
            path: "/GerenciaRNPA/painel-monitoramento/hidrografia",
          },
        ],
      },
      {
        text: "Validação e Certificado",
        icon: Shield,
        path: "/GerenciaRNPA/gestao-agricultores/workflow",
      },
      {
        text: "Programas e Benefícios",
        icon: Award,
        path: "/GerenciaRNPA/gestao-agricultores/programas",
      },
      {
        text: "Incentivos",
        icon: TrendingUp,
        path: "/GerenciaRNPA/gestao-agricultores/incentivos",
      },
      {
        text: "Amostra de Solo",
        icon: TestTube,
        path: "/GerenciaRNPA/gestao-agricultores/AmostrasDeSolo",
      },
    ],

    "Produtores Florestais": [
      {
        text: "Produtores",
        icon: Users,
        path: "/GerenciaRNPA/gestao-florestal/produtoresFlorestais",
        hasDropdown: true,
        dropdownItems: [
          {
            text: "Pessoal",
            path: "/GerenciaRNPA/gestao-florestal/produtores/pessoal",
          },
          {
            text: "Empresa",
            path: "/GerenciaRNPA/gestao-florestal/produtores/empresa",
          },
          {
            text: "Cooperativa",
            path: "/GerenciaRNPA/gestao-florestal/produtores/cooperativa",
          },
          {
            text: "Associação",
            path: "/GerenciaRNPA/gestao-florestal/produtores/associacao",
          },
        ],
      },
      {
        text: 'Infraestrutura',
        icon: Sprout,
        path: '/GerenciaRNPA/gestao-florestal/produtoresFlorestais',
        hasDropdown: true,
        dropdownItems: [
          { text: 'Armazenamento', icon: Archive, path: '/GerenciaRNPA/gestao-florestal/produtores/armazenamento' },
          { text: 'Entrepostos e Mercado', icon: Building2, path: '/GerenciaRNPA/gestao-florestal/produtores/entrepostosMercado' },
          { text: 'Empresas de Apoio Florestal', icon: Tractor, path: '/GerenciaRNPA/gestao-florestal/produtores/empresas-apoio-florestal' },
          { text: 'Infraestrutura de Apoio Florestal', icon: Tractor, path: '/GerenciaRNPA/gestao-florestal/produtores/intraestrutura-apoio-florestal' }
        ]
      },
      {
        text: 'Painel e Monitoramento',
        icon: TrendingUp,
        path: '/GerenciaRNPA/painel-monitoramento',
        hasDropdown: true,
        dropdownItems: [
          { text: 'Controle de Pragas', icon: ShieldAlert, path: '/GerenciaRNPA/painel-monitoramento/indicadores' },
        ]
      },
      { text: 'Programas e Benefícios', icon: Award, path: '/GerenciaRNPA/gestao-florestal/programas' },
      { text: 'Certificação Florestal', icon: File, path: '/GerenciaRNPA/gestao-florestal/certificacaoFlorestal' },
      { text: 'Transgreções', icon: Gavel, path: '/GerenciaRNPA/gestao-florestal/sancoes' },
      { text: 'Amostra de Solo', icon: TestTube, path: '/GerenciaRNPA/gestao-florestal/AmostrasDeSolo' }
    ],

    "Painel e Monitoramento": [
      {
        text: "Controle de Pragas",
        icon: ShieldAlert,
        path: "/GerenciaRNPA/painel-monitoramento/indicadores",
      },
      {
        text: "Meteorologia",
        icon: Globe,
        path: "/GerenciaRNPA/painel-monitoramento/meteorologia",
      },
      {
        text: "Hidrografia",
        icon: MapPin,
        path: "/GerenciaRNPA/painel-monitoramento/hidrografia",
      },
    ],

    "Entidades Associativas": [
      {
        text: "Cooperativas",
        icon: Building2,
        path: "/GerenciaRNPA/entidades-associativas/cooperativas",
      },
      {
        text: "Associações Rurais",
        icon: TreePine,
        path: "/GerenciaRNPA/entidades-associativas/associacoes",
      },
      {
        text: "Empresas",
        icon: Landmark,
        path: "/GerenciaRNPA/entidades-associativas/empresas",
      },
    ],

    "Programas e Benefícios": [
      {
        text: "Cadastro de Programas",
        icon: Plus,
        path: "/GerenciaRNPA/programas-beneficios/historico",
      },
      {
        text: "Incentivos",
        icon: Award,
        path: "/GerenciaRNPA/programas-beneficios/incentivos",
      },
    ],
    "Produtores de Café": [
      {
        text: "Produtores",
        icon: Users,
        path: "/GerenciaRNPA/produtores",
        hasDropdown: true,
        dropdownItems: [
          {
            text: "Pessoal",
            path: "produtores/pessoal",
          },
        ],
      },
    ],
  },
};

const DropdownMenuItem = ({ item, isActive, onItemClick, onDropdownClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMainClick = () => {
    onItemClick(item.text);
    if (item.hasDropdown) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const handleDropdownItemClick = (dropdownItem) => {
    onDropdownClick(dropdownItem.path);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={handleMainClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${isActive
          ? "text-blue-600 bg-blue-50 font-semibold shadow-sm"
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
          }`}
      >
        <div className="flex items-center min-w-0">
          <item.icon
            className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-blue-600" : ""
              }`}
          />
          <span className="ml-3 text-sm truncate">{item.text}</span>
        </div>
        {item.hasDropdown && (
          <ChevronRight
            className={`w-4 h-4 flex-shrink-0 transition-transform ${isDropdownOpen ? "rotate-90" : ""
              }`}
          />
        )}
        {isActive && !item.hasDropdown && (
          <div className="ml-auto">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          </div>
        )}
      </button>

      {item.hasDropdown && isDropdownOpen && (
        <div className="ml-8 mt-2 space-y-1 animate-fade-in">
          {item.dropdownItems.map((dropdownItem, index) => (
            <button
              key={index}
              onClick={() => handleDropdownItemClick(dropdownItem)}
              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors border-l-2 border-gray-200 hover:border-blue-300"
            >
              <span className="block truncate">{dropdownItem.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Layout = () => {
  const navigate = useNavigate();
  const { produtor, loading: loadingProdutor } = useProdutores();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isInSubmenu, setIsInSubmenu] = useState(false);
  const [activeSubmenuItem, setActiveSubmenuItem] = useState(null);
  const [menuTransition, setMenuTransition] = useState("none");
  const [showDashboardStats, setShowDashboardStats] = useState(false);

  // Determinar o menu e submenu ativo com base na URL atual
  useEffect(() => {
    const currentPath = location.pathname;

    const mainMenuItem = rnpaRoutes.mainMenuItems.find(
      (item) =>
        currentPath === item.path || currentPath.startsWith(`${item.path}/`)
    );

    if (mainMenuItem) {
      setActiveMenu(mainMenuItem.text);

      if (mainMenuItem.submenu && currentPath !== mainMenuItem.path) {
        setIsInSubmenu(true);

        const submenuItem = rnpaRoutes.subMenus[mainMenuItem.text]?.find(
          (item) =>
            currentPath === item.path ||
            (item.hasDropdown &&
              item.dropdownItems?.some(
                (dropItem) => currentPath === dropItem.path
              ))
        );

        if (submenuItem) {
          setActiveSubmenuItem(submenuItem.text);
        }
      } else {
        setIsInSubmenu(!!mainMenuItem.submenu);
        setActiveSubmenuItem(null);
      }
    }
  }, [location]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  const handleMenuClick = (menuName) => {
    const menuItem = rnpaRoutes.mainMenuItems.find(
      (item) => item.text === menuName
    );

    if (menuItem) {
      if (menuItem.submenu) {
        setMenuTransition("exiting");

        setTimeout(() => {
          setActiveMenu(menuName);
          setIsInSubmenu(true);
          setMenuTransition("entering");
          navigate(menuItem.path);

          setTimeout(() => {
            setMenuTransition("none");
          }, 300);
        }, 300);
      } else {
        setActiveMenu(menuName);
        setIsInSubmenu(false);
        navigate(menuItem.path);
      }
    }
  };

  const goBackToMainMenu = () => {
    setMenuTransition("exiting");

    setTimeout(() => {
      setIsInSubmenu(false);
      setActiveSubmenuItem(null);
      setMenuTransition("entering");

      setTimeout(() => {
        setMenuTransition("none");
      }, 300);
    }, 300);
  };

  const handleSubmenuItemClick = (itemText) => {
    const submenuItem = rnpaRoutes.subMenus[activeMenu]?.find(
      (item) => item.text === itemText
    );

    if (submenuItem && !submenuItem.hasDropdown) {
      setActiveSubmenuItem(itemText);
      navigate(submenuItem.path);
    } else if (submenuItem && submenuItem.hasDropdown) {
      setActiveSubmenuItem(itemText);
    }
  };

  const handleDropdownNavigation = (path) => {
    navigate(path);
  };

  const renderSidebarHeader = () => (
    <div className="flex flex-col items-center p-4 border-b bg-gradient-to-b from-blue-50 to-white">
      {!isSidebarCollapsed && (
        <>
          <img
            src={imagetop}
            className="w-[100px] h-[100px]"
            alt=""
            srcSet=""
          />
          <div className="text-center">
            <h3 className="text-xs font-semibold text-gray-800 mt-3 leading-tight">
              MINISTÉRIO DA AGRICULTURA
            </h3>
            <h4 className="text-xs font-semibold text-gray-800">E FLORESTAS</h4>
            <span className="text-xs font-medium text-blue-600 mt-1 block">
              SIGAF
            </span>
          </div>
        </>
      )}

      <button
        onClick={toggleSidebarCollapse}
        className={`mt-3 p-2 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 ${isSidebarCollapsed ? "mx-auto" : ""
          }`}
        title={isSidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen className="w-4 h-4" />
        ) : (
          <PanelLeftClose className="w-4 h-4" />
        )}
      </button>
    </div>
  );

  const renderMainMenu = () => (
    <div className="flex flex-col h-full">
      {renderSidebarHeader()}

      <div className="flex-1 overflow-y-auto">
        <nav className="py-2">
          <ul className="space-y-1">
            {rnpaRoutes.mainMenuItems.map((item, index) => (
              <li key={index} className="px-2">
                <button
                  onClick={() => handleMenuClick(item.text)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${activeMenu === item.text && !isInSubmenu
                    ? "text-blue-600 bg-blue-50 font-semibold shadow-sm"
                    : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  title={isSidebarCollapsed ? item.text : ""}
                >
                  <div className="flex items-center min-w-0">
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${activeMenu === item.text && !isInSubmenu
                        ? "text-blue-600"
                        : ""
                        }`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="ml-3 font-medium text-sm truncate">
                        {item.text}
                      </span>
                    )}
                  </div>
                  {!isSidebarCollapsed && item.submenu && (
                    <ChevronRight
                      className={`w-4 h-4 flex-shrink-0 transition-transform ${activeMenu === item.text ? "rotate-90" : ""
                        }`}
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t bg-white p-4">
        {!isSidebarCollapsed ? (
          <div className="mb-3 p-3 rounded-lg">
            <img src={imagebottom} alt="" srcSet="" />
          </div>
        ) : (
          <button
            className="w-full p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Perfil do Usuário"
          ></button>
        )}
      </div>
    </div>
  );

  const renderSubMenu = () => {
    const subMenuItems = rnpaRoutes.subMenus[activeMenu] || [];
    const mainMenuItem = rnpaRoutes.mainMenuItems.find(
      (item) => item.text === activeMenu
    );

    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-b from-blue-50 to-white">
          <button
            onClick={goBackToMainMenu}
            className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {!isSidebarCollapsed && (
              <span className="ml-2 text-sm">Voltar</span>
            )}
          </button>

          {!isSidebarCollapsed && (
            <button
              onClick={toggleSidebarCollapse}
              className="p-2 rounded-lg text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
              title="Recolher sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {!isSidebarCollapsed && (
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-gray-800 flex items-center">
              {mainMenuItem?.icon &&
                React.createElement(mainMenuItem.icon, {
                  className: "w-5 h-5 mr-2 text-blue-600",
                })}
              <span className="truncate">{activeMenu}</span>
            </h2>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
            <ul className="space-y-1">
              {subMenuItems.map((item, index) => (
                <li key={index} className="px-2">
                  {item.hasDropdown ? (
                    <DropdownMenuItem
                      item={item}
                      isActive={activeSubmenuItem === item.text}
                      onItemClick={handleSubmenuItemClick}
                      onDropdownClick={handleDropdownNavigation}
                    />
                  ) : (
                    <button
                      onClick={() => handleSubmenuItemClick(item.text)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${activeSubmenuItem === item.text
                        ? "text-blue-600 bg-blue-50 font-semibold shadow-sm"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      title={isSidebarCollapsed ? item.text : ""}
                    >
                      <item.icon
                        className={`w-5 h-5 flex-shrink-0 ${activeSubmenuItem === item.text ? "text-blue-600" : ""
                          }`}
                      />
                      {!isSidebarCollapsed && (
                        <>
                          <span className="ml-3 text-sm truncate">
                            {item.text}
                          </span>
                          {activeSubmenuItem === item.text && (
                            <div className="ml-auto">
                              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                          )}
                        </>
                      )}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed xl:static inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out ${isSidebarCollapsed ? "w-16" : "w-64"
          } ${isSidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
          }`}
      >
        <div
          className={`h-full overflow-hidden ${menuTransition === "entering"
            ? "animate-fade-in"
            : menuTransition === "exiting"
              ? "animate-fade-out"
              : ""
            }`}
        >
          {isInSubmenu ? renderSubMenu() : renderMainMenu()}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white shadow-sm border-b-2 border-blue-600">
          <div className="flex items-center min-w-0">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md xl:hidden text-gray-600 hover:bg-gray-100 mr-2"
            >
              {isSidebarOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            <div className="hidden lg:flex items-center min-w-0">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-blue-600 min-w-0"
              >
                <Home className="w-4 h-4 flex-shrink-0" />
                <span className="ml-2 text-sm truncate">SIGAF</span>
              </button>

              {activeMenu && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
                  <button
                    onClick={() =>
                      navigate(
                        rnpaRoutes.mainMenuItems.find(
                          (item) => item.text === activeMenu
                        )?.path || "/"
                      )
                    }
                    className="text-sm text-gray-600 hover:text-blue-600 truncate"
                  >
                    {activeMenu}
                  </button>
                </>
              )}

              {activeMenu && activeSubmenuItem && (
                <>
                  <ChevronRight className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-blue-600 font-medium truncate">
                    {activeSubmenuItem}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setShowDashboardStats(!showDashboardStats)}
              className="flex items-center px-2 md:px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition-all duration-200"
              title={
                showDashboardStats
                  ? "Ocultar Estatísticas"
                  : "Mostrar Estatísticas"
              }
            >
              {showDashboardStats ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span className="ml-2 text-sm hidden lg:inline">
                    Ocultar Estado
                  </span>
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  <span className="ml-2 text-sm hidden lg:inline">
                    Mostrar Estado
                  </span>
                </>
              )}
            </button>

            <div className="w-px h-6 bg-gray-300 hidden md:block"></div>

            <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <Search className="w-5 h-5" />
            </button>
            <button className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>

            <div className="w-px h-6 bg-gray-300 hidden md:block"></div>

            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium text-sm">
                AO
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 hidden sm:inline">
                Admin RNPA
              </span>
            </div>
          </div>
        </header>

        {/* DashboardStats com animação */}
        <div
          className={`transition-all z-[10] duration-500 ease-in-out overflow-hidden ${showDashboardStats ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <DashboardStats produtor={produtor} loading={loadingProdutor} />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="bg-white border-r-2 border-l-2 rounded-lg shadow-md p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 xl:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Estilos CSS customizados */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        .animate-fade-out {
          animation: fade-out 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Layout;
