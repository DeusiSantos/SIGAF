import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Loader } from "lucide-react";

// ==================== COMPONENTE PRINCIPAL: MultiStepFormWizard ====================
/**
 * Componente reutilizável para formulários multi-step com navegação por tabs
 *
 * @param {Object} props
 * @param {Array} props.steps - Array de objetos com { label, icon, content }
 * @param {Function} props.onSubmit - Callback chamado ao finalizar (última etapa)
 * @param {Function} props.onStepChange - Callback opcional chamado ao mudar de etapa
 * @param {Function} props.validateStep - Função de validação que recebe (stepIndex) e retorna boolean
 * @param {Object} props.config - Configurações opcionais
 */
const MultiStepFormWizard = ({
  steps = [],
  onSubmit,
  onStepChange,
  validateStep,
  config = {},
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  // Configurações padrão (podem ser sobrescritas via props)
  const defaultConfig = {
    showProgressBar: true,
    showStepCounter: true,
    allowStepNavigation: true, // Permitir clicar em etapas anteriores
    autoScrollTop: true, // Scroll automático ao topo ao mudar de etapa
    previousButtonText: "Anterior",
    nextButtonText: "Próximo",
    submitButtonText: "Finalizar",
    loadingText: "Processando...",
    headerGradient: "from-amber-700 to-amber-500",
    primaryColor: "amber", // blue, green, purple, red, orange, etc.
    ...config,
  };

  const settings = defaultConfig;
  const isLastStep = activeIndex === steps.length - 1;
  const isFirstStep = activeIndex === 0;

  // Função para mudar de etapa
  const goToStep = (index) => {
    if (index < 0 || index >= steps.length) return;

    // Só permite navegação se for para trás ou se a configuração permitir
    if (index > activeIndex && !settings.allowStepNavigation) return;

    // Scroll automático
    if (settings.autoScrollTop) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    setActiveIndex(index);

    // Callback opcional
    if (onStepChange) {
      onStepChange(index, steps[index]);
    }
  };

  // Avançar para próxima etapa
  const handleNext = async () => {
    // Validar etapa atual se a função foi fornecida
    if (validateStep) {
      const isValid = await validateStep(activeIndex);
      if (!isValid) return;
    }

    // Marcar etapa como concluída
    setCompletedSteps((prev) => new Set([...prev, activeIndex]));

    // Avançar
    goToStep(activeIndex + 1);
  };

  // Voltar para etapa anterior
  const handlePrevious = () => {
    goToStep(activeIndex - 1);
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Validar última etapa
    if (validateStep) {
      const isValid = await validateStep(activeIndex);
      if (!isValid) return;
    }

    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit();
      }
    } finally {
      setLoading(false);
    }
  };

  // Calcular progresso
  const progress = ((activeIndex + 1) / steps.length) * 100;

  return (
    <div className="w-full mt-8">
      {/* Navegação de Tabs */}
      <div className="flex justify-between items-center px-4 md:px-8 mb-6 overflow-x-auto">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isCompleted = completedSteps.has(index);
          const isCurrent = index === activeIndex;
          const isClickable =
            settings.allowStepNavigation && index <= activeIndex;

          return (
            <div
              key={index}
              className={`flex flex-col items-center min-w-0 flex-shrink-0 mx-1 transition-all ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed"
              } ${index > activeIndex ? "opacity-50" : "opacity-100"}`}
              onClick={() => isClickable && goToStep(index)}
            >
              {/* Ícone da etapa */}
              <div
                className={`flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-2 transition-all ${
                  isCompleted
                    ? `bg-${settings.primaryColor}-500 text-white`
                    : isCurrent
                    ? `bg-${settings.primaryColor}-600 text-white shadow-lg `
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {isCompleted ? (
                  <Check size={20} className="md:w-6 md:h-6" />
                ) : (
                  <StepIcon size={20} className="md:w-6 md:h-6" />
                )}
              </div>

              {/* Label da etapa */}
              <span
                className={`text-xs md:text-sm text-center font-medium transition-colors ${
                  isCurrent
                    ? `text-${settings.primaryColor}-700`
                    : "text-gray-500"
                }`}
              >
                {step.label}
              </span>

              {/* Linha de conexão (exceto no último) */}
              {index < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute w-full  transition-colors ${
                    isCompleted
                      ? `bg-${settings.primaryColor}-500`
                      : "bg-gray-300"
                  }`}
                  style={{
                    width: "calc(100% - 3.5rem)",
                    marginLeft: "1.75rem",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Barra de Progresso */}
      {settings.showProgressBar && (
        <div className="w-full bg-gray-200 h-2 mb-6 rounded-full overflow-hidden">
          <div
            className={`bg-${settings.primaryColor}-600 h-2 transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Contador de Etapas */}
      {settings.showStepCounter && (
        <div className="text-center mb-6">
          <span className="text-sm font-medium text-gray-600">
            Etapa {activeIndex + 1} de {steps.length}
          </span>
        </div>
      )}

      {/* Conteúdo da Etapa Atual */}
      <div className="min-h-[400px] p-4 md:p-6">
        {steps[activeIndex]?.content || (
          <div className="text-center text-gray-500">
            Nenhum conteúdo definido para esta etapa
          </div>
        )}
      </div>

      {/* Botões de Navegação */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
        {/* Botão Anterior */}
        <button
          type="button"
          className={`px-6 py-2.5 md:px-8 md:py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
            isFirstStep
              ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400"
          }`}
          onClick={handlePrevious}
          disabled={isFirstStep || loading}
        >
          <ChevronLeft size={20} className="mr-2" />
          {settings.previousButtonText}
        </button>

        {/* Espaçador para centralizar o contador (se existir) */}
        <div className="flex-1" />

        {/* Botão Próximo/Finalizar */}
        <button
          type="button"
          className={`px-6 py-2.5 md:px-8 md:py-3 rounded-xl flex items-center transition-all font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : `bg-${settings.primaryColor}-600 hover:bg-${settings.primaryColor}-700 text-white shadow-lg`
          }`}
          onClick={isLastStep ? handleSubmit : handleNext}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader size={20} className="animate-spin mr-2" />
              {settings.loadingText}
            </>
          ) : isLastStep ? (
            <>
              <Check size={20} className="mr-2" />
              {settings.submitButtonText}
            </>
          ) : (
            <>
              <span className="mr-2">{settings.nextButtonText}</span>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MultiStepFormWizard;