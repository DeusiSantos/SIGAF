/**
 * Sistema de navegação por tabs reutilizável (apenas os botões)
 *
 * @param {Array} tabs - Array de objetos com as tabs
 *   Cada tab deve ter: { id, title, description, icon, color }
 * @param {string} activeTab - ID da tab ativa
 * @param {Function} onTabChange - Função chamada quando muda de tab: (tabId) => void
 * @param {React.ReactNode} headerAction - Componente adicional no canto direito (ex: botão de info)
 */
const TabNavigation = ({ tabs = [], activeTab, onTabChange, headerAction }) => {
  // Mapeamento completo de estilos por cor
  const colorStyles = {
    blue: {
      active: "bg-blue-800 text-white border-blue-800",
      inactive: "bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300",
      iconActive: "text-white",
      iconInactive: "text-blue-600"
    },
    green: {
      active: "bg-green-600 text-white border-green-600",
      inactive: "bg-white text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300",
      iconActive: "text-white",
      iconInactive: "text-green-600"
    },
    red: {
      active: "bg-red-600 text-white border-red-600",
      inactive: "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300",
      iconActive: "text-white",
      iconInactive: "text-red-600"
    },
    purple: {
      active: "bg-purple-600 text-white border-purple-600",
      inactive: "bg-white text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300",
      iconActive: "text-white",
      iconInactive: "text-purple-600"
    },
    yellow: {
      active: "bg-yellow-600 text-white border-yellow-600",
      inactive: "bg-white text-yellow-600 border-yellow-200 hover:bg-yellow-50 hover:border-yellow-300",
      iconActive: "text-white",
      iconInactive: "text-yellow-600"
    },
    amber: {
      active: "bg-amber-800 text-white border-amber-800",
      inactive: "bg-white text-amber-800 border-amber-800 hover:bg-amber-50 hover:border-amber-800",
      iconActive: "text-white",
      iconInactive: "text-amber-800"
    }
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const styles = colorStyles.amber;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center px-6 py-4 rounded-lg border-2 transition-all duration-200 ${
                  isActive ? styles.active : styles.inactive
                }`}
              >
                <Icon className={`w-6 h-6 mr-3 ${isActive ? styles.iconActive : styles.iconInactive}`} />
                <div className="text-left">
                  <div className="font-semibold">{tab.title}</div>
                  <div className="text-sm opacity-75">{tab.description}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Ação adicional (ex: botão de info) */}
        {headerAction && (
          <div className="flex items-center">{headerAction}</div>
        )}
      </div>
    </div>
  );
};

export default TabNavigation;