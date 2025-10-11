import React from "react";
import { Download } from "lucide-react";

const PageHeader = ({
  title,
  gradientFrom = "blue-700",
  gradientTo = "blue-500",
  onExport,
  subtitle,
}) => {
  return (
    <>
      <div
        className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} p-6 text-white shadow-md mb-6 rounded`}
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm opacity-90">{subtitle}</p>}
          </div>

          {onExport && (
            <div className="flex gap-4">
              <button
                onClick={onExport}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </button>
            </div>
          )}
        </div>
       
      </div>
      
    </>
  );
};

export default PageHeader;
